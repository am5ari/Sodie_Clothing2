import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {

  const ticker = document.getElementById("ticker");
  let inventory = [];

  // Load inventory from Firebase
  const snapshot = await getDocs(collection(db, "products"));
  snapshot.forEach(doc => inventory.push(doc.data()));

  // Create ticker after inventory is ready
  function createTicker() {
    ticker.innerHTML = "";

    // duplicate items for infinite loop effect
    const loopItems = [...inventory, ...inventory];

    loopItems.forEach(item => {
      const div = document.createElement("div");
      div.className = "ticker-item";

      div.innerHTML = `
        <img src="${item.image}">
        <p>${item.name}</p>
        <p>$${item.price}</p>
      `;

      // click → go to shop
      div.onclick = () => {
        window.location.href = "shop.html?category=" + item.category;
      };

      ticker.appendChild(div);
    });
  }

  createTicker();

});

