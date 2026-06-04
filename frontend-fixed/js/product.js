// frontend/product.js
// Do NOT redefine API here — script.js already defines it

function q(selector) {
  return document.querySelector(selector);
}

async function loadProduct() {
  const params = new URLSearchParams(location.search);
  const id = params.get("id");

  if (!id) {
    q("#product-main").innerHTML = "<p>No product specified</p>";
    return;
  }

  try {
    const res = await fetch(API + "/products/" + id); // API comes from script.js

    if (!res.ok) throw new Error("Not found");

    const p = await res.json();

    q("#product-main").innerHTML = `
      <div class="product-page">
        <img src="${p.image || 'images/laptop.jpg'}" style="max-width:300px" />
        <h2>${p.name}</h2>
        <p>₹ ${p.price}</p>
        <p>${p.description}</p>
        <button class="btn" id="addBtn">Add to cart</button>
      </div>
    `;

    document.getElementById("addBtn").addEventListener("click", () => {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existing = cart.find(it => it.id === p._id);

      if (existing) existing.quantity += 1;
      else cart.push({
        id: p._id,
        name: p.name,
        price: p.price,
        image: p.image,
        quantity: 1
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartBadge();
      alert("Added to cart");
    });

    updateCartBadge();

  } catch (err) {
    q("#product-main").innerHTML = "<p>Failed to load product</p>";
  }
}

loadProduct();
