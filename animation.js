import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const carousel = document.getElementById("carousel");
let inventory = [];
let currentIndex = 0;

// Load products
async function loadCarousel() {
  const snapshot = await getDocs(collection(db, "products"));
  inventory = snapshot.docs.map(doc => doc.data());

  if (!inventory.length) return;

  renderCarousel();
  setInterval(nextSlide, 3000); // auto-rotate
}

// Render 3 visible products
function renderCarousel() {
  carousel.innerHTML = "";

  for (let i = 0; i < inventory.length; i++) {
    const img = document.createElement("img");
    img.src = inventory[i].image;

    if (i === currentIndex) img.classList.add("front");
    else if (i === (currentIndex + 1) % inventory.length) img.classList.add("middle");
    else if (i === (currentIndex + 2) % inventory.length) img.classList.add("back");

    carousel.appendChild(img);
  }
}

// Move to next slide
function nextSlide() {
  currentIndex = (currentIndex + 1) % inventory.length;
  renderCarousel();
}

// Click carousel to go to shop page
document.getElementById("carouselContainer").onclick = () => {
  window.location.href = "shop.html?category=all";
};

loadCarousel();