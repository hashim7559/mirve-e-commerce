const token = localStorage.getItem("adminToken");
const ordersDiv = document.getElementById("orders");
let selectedImages = [];   //for remove selected images before upload 


if (!token) {
  window.location.href = "admin-login.html";
}

async function loadOrders() {
  try {
    const res = await fetch("http://localhost:5000/api/orders", {
      headers: {
        Authorization: "Bearer " + token
      }
    });
    const orders = await res.json();

    ordersDiv.innerHTML = "";

    orders.forEach(order => {
      const div = document.createElement("div");
      div.className = "order-card";

div.innerHTML = `
  <div class="order-layout">

    <!-- LEFT SIDE -->
    <div class="order-left">
      <div><b>Order id :</b> ${order._id}</div>
      <div><b>Name :</b> ${order.customerName}</div>
      <div><b>Phone :</b> ${order.phone}</div>
      <div><b>Address :</b> ${order.address}</div>
      <div><b>Pincode :</b> ${order.pincode}</div>
      <div><b>Status :</b>
        <span id="status-${order._id}">
          ${order.status}
        </span>
      </div>
      <div><b>Total :</b> ₹${order.totalAmount}</div>
    </div>

    <!-- RIGHT SIDE -->
    <div class="order-right">
      <b>Item’s</b>
      <ul>
        ${order.items
          .map(
            item =>
              `<li>${item.name} - ${item.size} × ${item.quantity}</li>`
          )
          .join("")}
      </ul>
    </div>

  </div>

  <!-- ACTION BUTTONS -->
  <div class="order-actions">
    <button onclick="updateStatus('${order._id}', 'Shipped')">
      Mark Shipped
    </button>

    <button onclick="updateStatus('${order._id}', 'Delivered')">
      Mark Delivered
    </button>
  </div>
`;



      ordersDiv.appendChild(div);
    });

  } catch (err) {
    ordersDiv.innerHTML = "<p>Failed to load orders</p>";
    console.error(err);
  }
}

loadOrders();

async function updateStatus(orderId, newStatus) {
  const token = localStorage.getItem("adminToken");

  try {
    const res = await fetch(
      `http://localhost:5000/api/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (!res.ok) {
      const data = await res.json();
      alert(data.message || "Failed to update status");
      return;
    }

    const updatedOrder = await res.json();

    // Update status text instantly
    document.getElementById(`status-${orderId}`).innerText =
      updatedOrder.status;

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

async function addProduct() {
  const token = localStorage.getItem("adminToken");

  const sizeEls = document.querySelectorAll(".variantSize");
  const stockEls = document.querySelectorAll(".variantStock");

  const variants = [];

  sizeEls.forEach((sizeEl, index) => {
    const size = sizeEl.value;
    const stock = Number(stockEls[index].value);

    if (size && stock >= 0) {
      variants.push({ size, stock });
    }
  });

  if (variants.length === 0) {
    alert("Please add at least one variant");
    return;
  }

  // ✅ FormData instead of JSON
  const formData = new FormData();

  formData.append("name", document.getElementById("pName").value);
  formData.append("description", document.getElementById("pDesc").value);
  formData.append("price", document.getElementById("pPrice").value);
  formData.append("category", document.getElementById("pCategory").value);
  formData.append("variants", JSON.stringify(variants));

  // ✅ Image files
  for (let i = 0; i < selectedImages.length; i++) {
    formData.append("images", selectedImages[i]);
}

  const res = await fetch("http://localhost:5000/api/admin/products", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token // ❌ no Content-Type
    },
    body: formData
  });

  const data = await res.json();
  alert(data.message);

  if (res.ok) loadProducts(); // 🔥 refresh list
}

//preview of newly upload images  💕
function previewSelectedImages() {
  const fileInput = document.getElementById("images");
  const previewContainer = document.getElementById("imagePreviewContainer");

  // Convert FileList to Array and store
  selectedImages = Array.from(fileInput.files);

  document.getElementById("fileCount").innerText =
  selectedImages.length + " Files";


  previewContainer.innerHTML = "";

  selectedImages.forEach((file, index) => {
    const wrapper = document.createElement("div");
    wrapper.style.display = "inline-block";
    wrapper.style.position = "relative";
    wrapper.style.margin = "5px";

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.style.width = "100px";
    img.style.height = "100px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "6px";
    img.style.border = "1px solid #ccc";

    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = "✖";
    removeBtn.style.position = "absolute";
    removeBtn.style.top = "2px";
    removeBtn.style.right = "2px";
    removeBtn.style.background = "rgba(0,0,0,0.6)";
    removeBtn.style.color = "white";
    removeBtn.style.border = "none";
    removeBtn.style.borderRadius = "50%";
    removeBtn.style.cursor = "pointer";

    removeBtn.onclick = () => removeImage(index);

    wrapper.appendChild(img);
    wrapper.appendChild(removeBtn);
    previewContainer.appendChild(wrapper);
  });
}

function removeImage(index) {
  // Remove from array
  selectedImages.splice(index, 1);

  // Re-render previews
  renderPreviews();
}

function renderPreviews() {
  const previewContainer = document.getElementById("imagePreviewContainer");
  previewContainer.innerHTML = "";

  selectedImages.forEach((file, index) => {
    const wrapper = document.createElement("div");
    wrapper.style.display = "inline-block";
    wrapper.style.position = "relative";
    wrapper.style.margin = "5px";

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.style.width = "100px";
    img.style.height = "100px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "6px";
    img.style.border = "1px solid #ccc";

    const removeBtn = document.createElement("button");
    removeBtn.innerHTML = "✖";
    removeBtn.style.position = "absolute";
    removeBtn.style.top = "2px";
    removeBtn.style.right = "2px";
    removeBtn.style.background = "rgba(0,0,0,0.6)";
    removeBtn.style.color = "white";
    removeBtn.style.border = "none";
    removeBtn.style.borderRadius = "50%";
    removeBtn.style.cursor = "pointer";

    removeBtn.onclick = () => removeImage(index);

    wrapper.appendChild(img);
    wrapper.appendChild(removeBtn);
    previewContainer.appendChild(wrapper);
  });
}





function addVariantRow() {
  const div = document.createElement("div");
  div.className = "variantRow";

  div.innerHTML = `
    <div class="variantRow">
  <span>Size :</span>

  <select class="variantSize" style="max-width: 50px;">
    <option value="S">S</option>
    <option value="M">M</option>
    <option value="L">L</option>
    <option value="XL">XL</option>
    <option value="XXL">XXL</option>
  </select>

  <span>Stock :</span>

  <input
    type="number"
    class="variantStock"
    min="0"
    style="max-width: 30px;"
  />
</div>
  `;

  document.getElementById("variantsContainer").appendChild(div);
}

async function loadProducts() {
  const token = localStorage.getItem("adminToken");
  const container = document.getElementById("admin-products");

  const res = await fetch("http://localhost:5000/api/admin/products", {
    headers: { Authorization: "Bearer " + token }
  });

  const products = await res.json();
  container.innerHTML = "";

 products.forEach(p => {
  const div = document.createElement("div");
  div.className = "admin-product-card";

  div.innerHTML = `
  <div class="product-card-ui">

    <!-- LEFT IMAGE -->
    <img 
      src="${p.images?.[0] || 'https://via.placeholder.com/120'}"
      class="product-img"
    />

    <!-- RIGHT CONTENT -->
    <div class="product-info">

      <h2>${p.name}</h2>
      <p class="category">Category : ${p.category}</p>

      <div class="field-row">
        <label>Price :</label>
        <input 
          type="number" 
          id="price-${p._id}" 
          value="${p.price}"
        />
      </div>

      <div class="field-row">
        <label>Description :</label>
        <textarea 
          id="desc-${p._id}" 
          rows="2"
        >${p.description}</textarea>
      </div>

      ${p.variants.map(v => `
        <div class="variant-row">
          <label>Size :</label>
          <select disabled>
            <option>${v.size}</option>
          </select>

          <label>Stock :</label>
          <input 
            type="number"
            id="stock-${p._id}-${v.size}"
            data-size="${v.size}"
            value="${v.stock}"
            min="0"
          />
        </div>
      `).join("")}

      <div class="btn-row">
        <button class="btn-update" onclick="updateProduct('${p._id}')">
          Update Product
        </button>

        <button class="btn-delete" onclick="deleteProduct('${p._id}')">
          Delete Product
        </button>
      </div>

    </div>
  </div>
`;


  document.getElementById("admin-products").appendChild(div);
});

}

loadProducts();


async function updateProduct(productId) {
  const token = localStorage.getItem("adminToken");

  const price = Number(document.getElementById(`price-${productId}`).value);
  const description = document.getElementById(`desc-${productId}`).value;

  // 🔥 Get ALL stock inputs for this product
  const stockInputs = document.querySelectorAll(
    `#all-products input[id^="stock-${productId}-"]`
  );

  const variants = [];

  stockInputs.forEach(input => {
    variants.push({
      size: input.dataset.size,           // ← SAFE
      stock: Number(input.value)           // ← SAFE
    });
  });

  const res = await fetch(
    `http://localhost:5000/api/admin/products/${productId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        price,
        description,
        variants
      })
    }
  );

  const data = await res.json();
  alert(data.message);
}


async function deleteProduct(productId) {
  const token = localStorage.getItem("adminToken");

  if (!confirm("Are you sure you want to delete this product?")) return;

  const res = await fetch(
    `http://localhost:5000/api/admin/products/${productId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  const data = await res.json();
  alert(data.message);
  loadProducts(); // refresh list
}


async function loadUsers() {
  const token = localStorage.getItem("adminToken");

  const res = await fetch("http://localhost:5000/api/admin/users", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const users = await res.json();
  const container = document.getElementById("users");
  container.innerHTML = "";

  users.forEach(user => {
    const div = document.createElement("div");
    div.className = "user-card";

    div.innerHTML = `
      <p><strong>Name :</strong> ${user.name}</p>
      <p><strong>Email :</strong> ${user.email}</p>
      <p><strong>Joined :</strong> ${new Date(user.createdAt).toDateString()}</p>
    `;

    container.appendChild(div);
  });
}


loadUsers();


async function loadInventory() {
  const res = await fetch("http://localhost:5000/api/products", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("adminToken"),
    },
  });

  const products = await res.json();
  const inventoryDiv = document.getElementById("inventoryList");
  inventoryDiv.innerHTML = "";

  products.forEach(product => {
    const imageUrl =
      product.images?.length && product.images[0].startsWith("http")
        ? product.images[0]
        : "https://via.placeholder.com/70";

    const categoryName = product.category || "Uncategorized";

    const card = document.createElement("div");
card.className = "inventory-card";

let variantsHTML = "";
product.variants.forEach(v => {
  let status = "OK";
  let statusClass = "ok";

  if (v.stock === 0) {
    status = "OUT OF STOCK";
    statusClass = "out";
  } else if (v.stock <= 2) {
    status = "LOW STOCK";
    statusClass = "low";
  }

variantsHTML += `
  <div class="variant-row">
    <div class="variant-size">
      Size : <span>${v.size}</span>
    </div>

    <div class="variant-stock">
      Stock :
      <input type="text" value="${v.stock}" readonly />
    </div>

    <div class="variant-status ${status.replace(" ", "-").toLowerCase()}">
      ${status}
    </div>
  </div>
`;

});

card.innerHTML = `
  <div class="inventory-header">
    <img src="${imageUrl}" />
    <div>
      <h3>${product.name}</h3>
      <p>Category : ${categoryName}</p>
    </div>
  </div>

  ${variantsHTML}
`;

inventoryDiv.appendChild(card);

  });
}

loadInventory();



//nav bar

function showSection(sectionId, btn) {
  // hide all sections
  document.querySelectorAll(".admin-section").forEach(sec => {
    sec.classList.add("hidden");
  });

  // show selected section
  document.getElementById(sectionId).classList.remove("hidden");

  // reset all nav buttons
  document.querySelectorAll(".nav-btn").forEach(b => {
    b.classList.remove("active");
  });

  // activate clicked button
  btn.classList.add("active");
}
