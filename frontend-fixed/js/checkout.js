console.log("CHECKOUT.JS LOADED");

function loadCheckout() {
  const checkoutBox = document.getElementById("checkout-items");
  const totalEl = document.getElementById("checkout-total");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    checkoutBox.innerHTML = "<p>Your cart is empty.</p>";
    totalEl.textContent = "0";
    return;
  }

  let html = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    html += `
      <div class="checkout-row">
        <img src="${item.image}" class="checkout-item-img" />

        <div class="checkout-info">
          <h3>${item.name}</h3>
          <p>Quantity: ${item.quantity}</p>
        </div>

        <div class="checkout-price">₹${item.price}</div>
      </div>
    `;
  });

  checkoutBox.innerHTML = html;
  totalEl.textContent = total;
}

document.getElementById("placeOrderBtn").addEventListener("click", () => {
  localStorage.removeItem("cart");
  document.getElementById("checkout-message").textContent = "Order Placed Successfully!";
  loadCheckout();
  updateCartBadge();
});

loadCheckout();
