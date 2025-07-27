// Append item to localStorage without page change
function appendSpecificItem(itemName) {
  let data = JSON.parse(localStorage.getItem("tableData")) || [];
  data.push(itemName);
  localStorage.setItem("tableData", JSON.stringify(data));

  // Show optional confirmation
  const msg = document.getElementById("confirmation");
  if (msg) {
    msg.textContent = `${itemName} added to order.`;
    setTimeout(() => msg.textContent = "", 2000);
  }
}

// When page loads, fill the table if #table-body exists
window.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("table-body");
  if (tableBody) {
    const data = JSON.parse(localStorage.getItem("tableData")) || [];
    tableBody.innerHTML = ""; // clear before filling
    data.forEach((item) => {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.textContent = item;
      row.appendChild(cell);
      tableBody.appendChild(row);
    });
  }
});

// Clear table and storage
function clearTable() {
  localStorage.removeItem("tableData");
  const tableBody = document.getElementById("table-body");
  if (tableBody) tableBody.innerHTML = "";
}
