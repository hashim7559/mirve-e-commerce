const summaryDiv = document.getElementById("order-summary");
const totalSpan = document.getElementById("total");
const token = localStorage.getItem("userToken");

if (!token) {
  alert("Please login before placing an order");
  window.location.href = "login.html";
  throw new Error("User not logged in");
}

const cart = JSON.parse(localStorage.getItem("cart")) || [];

let subtotal = 0;
const DELIVERY_CHARGE = 60;

// Clear summary first (safe)
summaryDiv.innerHTML = "";

cart.forEach(item => {
  const row = document.createElement("div");
  row.className = "summary-row";

  const itemTotal = item.price * item.quantity;

  row.innerHTML = `
    <span>${item.name} (${item.size}) × ${item.quantity}</span>
    <span>₹${itemTotal}</span>
  `;

  summaryDiv.appendChild(row);
  subtotal += itemTotal;
});

// ✅ Final total calculation
const grandTotal = subtotal + DELIVERY_CHARGE;
totalSpan.textContent = grandTotal;

document.getElementById("place-order").addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const pincode = document.getElementById("pincode").value;

  if (!name || !phone || !address || !pincode) {
    alert("Please fill all details");
    return;
  }

  const orderData = {
    customerName: name,
    phone,
    address,
    pincode,
    items: cart,
    deliveryCharge: DELIVERY_CHARGE,
    totalAmount: grandTotal
  };

  try {
    const res = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Order placed successfully");
      localStorage.removeItem("cart");
      window.location.href = "index.html";
    } else {
      alert(data.message || "Order failed");
    }
  } catch (err) {
    alert("Server error");
    console.error(err);
  }
});
