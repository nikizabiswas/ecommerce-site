
console.log("SCRIPT.JS LOADED");


// frontend/script.js - list & search products
window.API = window.API || "http://localhost:5001/api";

let allProducts = [];

// badge
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((s, it) => s + (it.quantity||1), 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = count;
}

// render
function renderProducts(products) {
  const container = document.getElementById("product-list");
  if (!container) return;
  container.innerHTML = "";
  if (!products.length) { container.innerHTML = "<p>No products</p>"; return; }
  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.image || 'images/laptop.jpg'}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>₹ ${p.price}</p>
      <p>${p.category}</p>
      <div>
        <a class="btn" href="product.html?id=${p._id}">View</a>
        <button class="btn" onclick="addToCart('${p._id}', '${escapeHtml(p.name)}', ${p.price}, '${p.image||''}')">Add to cart</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/'/g, "\'").replace(/"/g, '&quot;');
}

// fetch
async function fetchProducts() {
  try {
    const res = await fetch(API + "/products");
    allProducts = await res.json();
    populateCategories();
    renderProducts(allProducts);
    updateCartBadge();
  } catch (err) {
    console.error(err);
    document.getElementById("product-list").innerText = "Failed to load products";
  }
}

function populateCategories() {
  const sel = document.getElementById("category");
  if (!sel) return;
  const cats = Array.from(new Set(allProducts.map(p=>p.category).filter(Boolean)));
  sel.innerHTML = '<option value="">All categories</option>';
  cats.forEach(c => sel.innerHTML += `<option value="${c}">${c}</option>`);
}

// filtering
function applyFilters() {
  const q = document.getElementById("search")?.value?.toLowerCase() || "";
  const cat = document.getElementById("category")?.value || "";
  const sort = document.getElementById("sort")?.value || "";

  let out = allProducts.filter(p => {
    return (!cat || p.category === cat) &&
           (!q || p.name.toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q));
  });

  if (sort === "price-asc") out.sort((a,b)=>a.price-b.price);
  if (sort === "price-desc") out.sort((a,b)=>b.price-a.price);
  if (sort === "name-asc") out.sort((a,b)=>a.name.localeCompare(b.name));
  if (sort === "name-desc") out.sort((a,b)=>b.name.localeCompare(a.name));

  renderProducts(out);
}

// cart helpers
function addToCart(id,name,price,image){
  let cart = JSON.parse(localStorage.getItem("cart"))||[];
  const existing = cart.find(it=>it.id===id);
  if (existing) existing.quantity += 1;
  else cart.push({ id, name, price, image, quantity: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
  alert(name + " added to cart");
}

// init
document.getElementById("applyBtn")?.addEventListener("click", applyFilters);
fetchProducts();
window.updateCartBadge = updateCartBadge;
window.addToCart = addToCart;
