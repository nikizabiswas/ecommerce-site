
// frontend/cart.js - manages cart with auth-aware checkout
function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart-items");
  const summary = document.getElementById("cart-summary");
  container.innerHTML = "";
  if (!cart.length) { container.innerHTML = "<p>Cart is empty</p>"; summary.innerHTML=""; return; }
  cart.forEach(it => {
    const div = document.createElement("div");
    div.className = "cart-row";
    div.innerHTML = `
      <div style="width:80px"><img src="${it.image||'images/laptop.jpg'}" style="width:100%"/></div>
      <div style="flex:1">
        <strong>${it.name}</strong>
        <div>₹ ${it.price} x <input type="number" min="1" value="${it.quantity}" data-id="${it.id}" class="qty" style="width:60px" /></div>
      </div>
      <div><button class="btn remove" data-id="${it.id}">Remove</button></div>
    `;
    container.appendChild(div);
  });
  const total = cart.reduce((s,it)=>s + it.price * it.quantity, 0);
  summary.innerHTML = `<h3>Total: ₹ ${total}</h3>`;

  document.querySelectorAll(".remove").forEach(b=>{
    b.addEventListener("click", (e)=>{
      const id = e.target.dataset.id;
      let cart = JSON.parse(localStorage.getItem("cart"))||[];
      cart = cart.filter(it=>it.id !== id);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart(); updateCartBadge();
    });
  });
  document.querySelectorAll(".qty").forEach(inp=>{
    inp.addEventListener("change", (e)=>{
      const id = e.target.dataset.id;
      const q = parseInt(e.target.value,10) || 1;
      const cart = JSON.parse(localStorage.getItem("cart"))||[];
      const item = cart.find(it=>it.id===id);
      if (item) item.quantity = q;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart(); updateCartBadge();
    });
  });
}

renderCart();
window.updateCartBadge = window.updateCartBadge || function(){};
updateCartBadge();
