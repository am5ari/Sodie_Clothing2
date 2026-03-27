import { db } from "./firebase.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const ticker = document.getElementById("ticker");
  if (!ticker) return console.error("Ticker element not found!");

  let inventory = [];

  // Listen to Firestore in real-time
  const productsCollection = collection(db, "products");
  onSnapshot(productsCollection, (snapshot) => {
    inventory = []; // clear previous data
    snapshot.forEach(doc => inventory.push(doc.data()));

    // Build the ticker
    ticker.innerHTML = ""; // clear previous elements
    const loopItems = [...inventory, ...inventory]; // duplicate for infinite effect

    loopItems.forEach(item => {
      const div = document.createElement("div");
      div.className = "ticker-item";
      div.innerHTML = `
        <img src="${item.image}">
        <p>${item.name}</p>
        <p>$${item.price}</p>
      `;
      div.onclick = () => {
        window.location.href = "shop.html?category=" + item.category;
      };
      ticker.appendChild(div);
    });
  }, (error) => {
    console.error("Error fetching products:", error);
  });
});