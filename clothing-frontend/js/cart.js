const cartItemsDiv = document.getElementById("cart-items");
const cart = JSON.parse(localStorage.getItem("cart")) || [];

if (cart.length === 0) {
  cartItemsDiv.innerHTML = "<p>Your cart is empty</p>";
} else {
  cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "product-card";

    div.innerHTML = `
      <img src="${item.image}" style="
          width:120px;
          height:120px;
          object-fit:cover;
          border-radius:8px;
          border:1px solid #ddd;
        ">
      <h3>${item.name}</h3>
      <p>Size: ${item.size}</p>
      <p>Price: ₹${item.price}</p>
      <p>Quantity: ${item.quantity}</p>
    `;

    cartItemsDiv.appendChild(div);
  });
}
