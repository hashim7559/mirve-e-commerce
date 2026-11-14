const productDetail = document.getElementById("product-detail");

// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

async function loadProduct() {
  try {
    const res = await fetch(`http://localhost:5000/api/products/${productId}`);
    const product = await res.json();

    productDetail.innerHTML = `
  <div class="product-card">

    <!-- IMAGE GALLERY -->
    <div class="image-gallery">
      <img 
        id="main-image" 
        src="${
          product.images && product.images.length > 0
            ? product.images[0]
            : "https://via.placeholder.com/300"
        }"
      >

      <div id="thumbnail-container" class="thumbnails"></div>
    </div>

    <div class="product-info">
  <h2>${product.name}</h2>
  <p>${product.description}</p>
  <p class="price">₹${product.price}</p>

  <h4>Select Size</h4>
  <div id="size-options">
    ${product.variants
      .map(
        (v) => `
      <button 
        class="size-btn" 
        data-size="${v.size}" 
        ${v.stock === 0 ? "disabled" : ""}
      >
        ${v.size}
      </button>
    `,
      )
      .join("")}
  </div>

  <button id="add-to-cart">Add to Cart</button>
</div>
  </div>
`;

    // ---------- IMAGE GALLERY LOGIC ----------
    const images =
      product.images && product.images.length > 0
        ? product.images
        : ["https://via.placeholder.com/300"];

    // Hide thumbnails if only one image
    if (images.length <= 1) {
      document.getElementById("thumbnail-container").style.display = "none";
    }

    const mainImage = document.getElementById("main-image");
    const thumbnailContainer = document.getElementById("thumbnail-container");
    const gallery = document.querySelector(".image-gallery");

    thumbnailContainer.innerHTML = "";

    images.forEach((img, index) => {
      const thumb = document.createElement("img");
      thumb.src = img;

      if (index === 0) thumb.classList.add("active");

      thumb.addEventListener("click", () => {
        mainImage.src = img;

        document
          .querySelectorAll(".thumbnails img")
          .forEach((i) => i.classList.remove("active"));

        thumb.classList.add("active");
      });

      thumbnailContainer.appendChild(thumb);
    });

    gallery.addEventListener("mousemove", (e) => {
      const rect = gallery.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      mainImage.style.transformOrigin = `${x}% ${y}%`; //for zooming the prodect
    });

    gallery.addEventListener("mouseleave", () => {
      mainImage.style.transformOrigin = "center center";
    });

    // 🔹 Check if all variants are out of stock
    const allOutOfStock = product.variants.every((v) => v.stock === 0);

    let selectedSize = null;

    document.querySelectorAll(".size-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".size-btn").forEach((b) => {
          b.classList.remove("active");
        });

        btn.classList.add("active");
        selectedSize = btn.dataset.size;

        console.log("Selected size:", selectedSize);
      });
    });
    document.getElementById("add-to-cart").addEventListener("click", () => {
      if (!selectedSize) {
        alert("Please select a size");
        return;
      }

      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        size: selectedSize,
        image: product.images[0],
        quantity: 1,
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Added to cart");
    });
  } catch (err) {
    productDetail.innerHTML = "<p>Failed to load product</p>";
    console.error(err);
  }
}

loadProduct();
