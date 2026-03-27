import { db } from "./firebase.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// ----------------------
// ELEMENTS
// ----------------------
const productsDiv = document.getElementById("products");
const modal = document.getElementById("productModal");
const modalImage = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalPrice = document.getElementById("modalPrice");
const modalSize = document.getElementById("modalSize");
const modalStock = document.getElementById("modalStock");
const addToCartBtn = document.getElementById("addToCart");

const cartIcon = document.getElementById("cartIcon");
const cart = document.getElementById("cart");
const cartItemsDiv = document.getElementById("cartItems");
const cartTotalDiv = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const closeCart = document.getElementById("closeCart");
const closeModalBtn = document.getElementById("closeModalBtn");

const sizeFilter = document.getElementById("sizeFilter");
const priceSort = document.getElementById("priceSort");
const categoryFilter = document.getElementById("categoryFilter");

const toggleFiltersTop = document.getElementById("toggleFiltersTop");
const filtersSidebarTop = document.getElementById("filtersSidebarTop");

let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
let currentProduct = null;
let inventory = [];

// ----------------------
// CART
// ----------------------
cartIcon.onclick = () => cart.classList.add("open");
closeCart.onclick = () => cart.classList.remove("open");

function updateCart() {
  cartItemsDiv.innerHTML = "";
  let total = 0;

  cartItems.forEach((item, index) => {
    total += Number(item.price);
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <span>${item.name}</span>
      <span>$${item.price}</span>
      <button data-index="${index}">X</button>
    `;
    div.querySelector("button").onclick = () => {
      cartItems.splice(index, 1);
      updateCart();
    };
    cartItemsDiv.appendChild(div);
  });

  cartTotalDiv.innerText = total;
  cartCount.innerText = cartItems.length;
  localStorage.setItem("cart", JSON.stringify(cartItems));
}

// ----------------------
// MODAL
// ----------------------
closeModalBtn.onclick = () => (modal.style.display = "none");
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };
addToCartBtn.onclick = () => {
  if (!currentProduct) return;
  cartItems.push(currentProduct);
  updateCart();
  modal.style.display = "none";
};

// ----------------------
// INITIAL CATEGORY FROM URL
// ----------------------
const params = new URLSearchParams(window.location.search);
const categoryParam = params.get("category") || "all";

if (categoryFilter) categoryFilter.value = categoryParam;

// ----------------------
// LOAD PRODUCTS
// ----------------------
onSnapshot(collection(db, "products"), snapshot => {
  inventory = [];
  snapshot.forEach(docSnap => {
    const item = docSnap.data();
    item.id = docSnap.id;
    inventory.push(item);
  });

  // Render products using initial category from URL
  applyFilters(); 
});

// ----------------------
// RENDER PRODUCTS
// ----------------------
function renderProducts(list) {
  productsDiv.innerHTML = "";
  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.size = item.size;
    card.dataset.category = item.category;
    card.dataset.price = item.price;

    card.innerHTML = `
      <img src="${item.image}">
      <h3>${item.name}</h3>
      <p>$${item.price}</p>
    `;

    card.onclick = () => {
      modal.style.display = "flex";
      modalImage.src = item.image;
      modalName.innerText = item.name;
      modalPrice.innerText = "$" + item.price;
      modalSize.innerText = "Size: " + item.size;
      modalStock.innerText = "Stock: " + item.stock;
      currentProduct = item;
    };

    productsDiv.appendChild(card);
  });
}

// ----------------------
// FILTERS
// ----------------------
function applyFilters() {
  let filtered = [...inventory];

  const selectedCategory = categoryFilter.value || categoryParam;
  if (selectedCategory !== "all")
    filtered = filtered.filter(p => p.category === selectedCategory);

  const selectedSize = sizeFilter.value;
  if (selectedSize !== "all")
    filtered = filtered.filter(p =>
      Array.isArray(p.size) ? p.size.includes(selectedSize) : p.size === selectedSize
    );

  const sort = priceSort.value;
  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  else if (sort === "high") filtered.sort((a, b) => b.price - a.price);

  renderProducts(filtered);
}

// Apply filters on dropdown change
categoryFilter.addEventListener("change", applyFilters);
sizeFilter.addEventListener("change", applyFilters);
priceSort.addEventListener("change", applyFilters);

// ----------------------
// TOP FILTERS TOGGLE
// ----------------------
// Hide button dynamically
const hideFiltersBtn = document.createElement("button");
hideFiltersBtn.innerText = "Hide Filters ▾";
hideFiltersBtn.style.marginTop = "10px";
hideFiltersBtn.style.padding = "10px 20px";
hideFiltersBtn.style.border = "none";
hideFiltersBtn.style.borderRadius = "8px";
hideFiltersBtn.style.cursor = "pointer";
hideFiltersBtn.style.background = "#ff6464";
hideFiltersBtn.style.color = "white";
hideFiltersBtn.style.alignSelf = "center";
filtersSidebarTop.appendChild(hideFiltersBtn);

// Show filters when top button clicked
toggleFiltersTop.addEventListener("click", () => {
  toggleFiltersTop.style.display = "none";
  filtersSidebarTop.style.display = "flex";
});

// Hide filters when hide button clicked
hideFiltersBtn.addEventListener("click", () => {
  filtersSidebarTop.style.display = "none";
  toggleFiltersTop.style.display = "block";
});