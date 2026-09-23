const allocationHistory = [];

const form = document.getElementById("allocatorForm");
const output = document.getElementById("cppOutput");
const messageBox = document.getElementById("message");
const summaryOutput = document.getElementById("summaryOutput");
const downloadBtn = document.getElementById("downloadBtn");
const undoBtn = document.getElementById("undoBtn");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const disasterType = document.getElementById("disasterType").value;
  const location = document.getElementById("location").value.trim();
  const victims = parseInt(document.getElementById("victims").value);
  const resources = parseInt(document.getElementById("resources").value);

  messageBox.style.display = "none";
  summaryOutput.innerHTML = "";
  output.textContent = "";
  downloadBtn.style.display = "none";

  if (!disasterType || !location || isNaN(victims) || isNaN(resources)) {
    showMessage("Please fill all fields correctly.", "error");
    return;
  }
  if (victims <= 0) {
    showMessage("Number of victims must be greater than zero.", "error");
    return;
  }

  const allocated = Math.floor(resources / victims);
  const remainder = resources % victims;

  const summary = `<strong>Disaster:</strong> ${disasterType}<br>
                   <strong>Location:</strong> ${location}<br>
                   <strong>Each victim receives:</strong> ${allocated} units<br>
                   <strong>Leftover resources:</strong> ${remainder}`;
  summaryOutput.innerHTML = summary;

  const cppCode = `// C++ Resource Allocation Result

#include <iostream>
using namespace std;

int main() {
    string disasterType = "${disasterType}";
    string location = "${location}";
    int victims = ${victims};
    int resources = ${resources};
    int allocated = resources / victims;
    int leftover = resources % victims;

    cout << "Disaster: " << disasterType << endl;
    cout << "Location: " << location << endl;
    cout << "Each victim receives: " << allocated << " units" << endl;
    cout << "Leftover resources: " << leftover << endl;

    return 0;
}`;

  output.textContent = cppCode;
  downloadBtn.style.display = "block";

  allocationHistory.push({ disasterType, location, victims, resources });

  downloadBtn.onclick = () => {
    const blob = new Blob([cppCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resource_allocation_${location}.cpp`;
    a.click();
    URL.revokeObjectURL(url);
  };
});

undoBtn.addEventListener("click", () => {
  if (allocationHistory.length > 0) {
    const last = allocationHistory.pop();
    document.getElementById("disasterType").value = last.disasterType;
    document.getElementById("location").value = last.location;
    document.getElementById("victims").value = last.victims;
    document.getElementById("resources").value = last.resources;
    showMessage("Last allocation restored.", "success");
  } else {
    showMessage("No previous allocations to undo.", "error");
  }
});

function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = type;
  messageBox.style.display = "block";
}

class Node {
  constructor(name) {
    this.name = name;
    this.next = null;
  }
}

let head = null;

function addVictim() {
  const name = document.getElementById("victimName").value.trim();
  if (!name) return;
  const newNode = new Node(name);
  if (!head) head = newNode;
  else {
    let temp = head;
    while (temp.next) temp = temp.next;
    temp.next = newNode;
  }
  renderVictims();
  document.getElementById("victimName").value = "";
}

function renderVictims() {
  const ul = document.getElementById("victimList");
  ul.innerHTML = "";
  let temp = head;
  while (temp) {
    const li = document.createElement("li");
    li.textContent = temp.name;
    ul.appendChild(li);
    temp = temp.next;
  }
}

const treeData = {
  name: "India",
  children: [
    { name: "Maharashtra", children: [ { name: "Mumbai" }, { name: "Pune" } ] },
    { name: "Gujarat", children: [ { name: "Ahmedabad" }, { name: "Surat" } ] }
  ]
};

function renderTree(node, container) {
  const el = document.createElement("div");
  el.textContent = node.name;
  container.appendChild(el);
  if (node.children) {
    const childContainer = document.createElement("div");
    childContainer.style.marginLeft = "20px";
    node.children.forEach(child => renderTree(child, childContainer));
    container.appendChild(childContainer);
  }
}

window.onload = function () {
  renderTree(treeData, document.getElementById("treeContainer"));
};

const graph = {
  A: { B: 2, C: 4 },
  B: { C: 1, D: 7 },
  C: { E: 3 },
  D: { F: 1 },
  E: { D: 2, F: 5 },
  F: {}
};

function dijkstra(start, end) {
  const distances = {};
  const visited = {};
  const queue = [];

  for (let node in graph) {
    distances[node] = Infinity;
  }
  distances[start] = 0;
  queue.push({ node: start, dist: 0 });

  while (queue.length) {
    queue.sort((a, b) => a.dist - b.dist);
    const { node } = queue.shift();
    visited[node] = true;

    for (let neighbor in graph[node]) {
      if (!visited[neighbor]) {
        const newDist = distances[node] + graph[node][neighbor];
        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          queue.push({ node: neighbor, dist: newDist });
        }
      }
    }
  }

  return distances[end];
}

function visualizeGraph() {
  const result = dijkstra("A", "F");
  document.getElementById("graphResult").textContent =
    result < Infinity ? `Shortest path from A to F: ${result}` : "No path found.";
}

function toggleSidebar() {
  const sidebar = document.getElementById("mySidebar");
  if (sidebar.style.width === "250px") {
    sidebar.style.width = "0";
  } else {
    sidebar.style.width = "250px";
  }
}

window.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const navUserSlot = document.getElementById("nav-user-slot");
  if (isLoggedIn && navUserSlot) {
    navUserSlot.innerHTML = `
      <img src="tp-logo.png" alt="User Logo" style="
        height: 38px;
        width: 38px;
        border-radius: 50%;
        object-fit: cover;
        cursor: pointer;
      " title="Welcome!" />
    `;
  }
});
