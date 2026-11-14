let allProducts = [];

async function fetchProducts() {

  try {

    const response = await fetch("http://localhost:5000/api/products");
    const products = await response.json();

    allProducts = products;

    displayProducts(products);

  } catch (error) {
    console.error(error);
  }

}

function displayProducts(products){

  const kurtisContainer = document.getElementById("kurtis-products");
  const unisexContainer = document.getElementById("unisex-products");
  const tshirtsContainer = document.getElementById("tshirts-products");

  const kurtisSection = document.getElementById("kurtis-section");
  const unisexSection = document.getElementById("unisex-section");
  const tshirtsSection = document.getElementById("tshirts-section");

  kurtisContainer.innerHTML = "";
  unisexContainer.innerHTML = "";
  tshirtsContainer.innerHTML = "";

  let kurtisCount = 0;
  let unisexCount = 0;
  let tshirtsCount = 0;

  products.forEach(product => {

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.images?.[0] || 'https://via.placeholder.com/200'}" />
      <h3>${product.name}</h3>
      <p>${product.category}</p>
      <p class="price">₹${product.price}</p>
    `;

    card.style.cursor = "pointer";

    card.onclick = () => {
      window.location.href = `product.html?id=${product._id}`;
    };

    if (product.category.toLowerCase() === "kurtis") {
      kurtisContainer.appendChild(card);
      kurtisCount++;
    }

    else if (product.category.toLowerCase() === "unisex") {
      unisexContainer.appendChild(card);
      unisexCount++;
    }

    else if (product.category.toLowerCase() === "t-shirts") {
      tshirtsContainer.appendChild(card);
      tshirtsCount++;
    }

  });

  /* Hide sections if empty */

  kurtisSection.style.display = kurtisCount ? "block" : "none";
  unisexSection.style.display = unisexCount ? "block" : "none";
  tshirtsSection.style.display = tshirtsCount ? "block" : "none";
if(products.length === 0){
  document.querySelector("main").innerHTML =
    "<p style='text-align:center'>No products found</p>";
}
}

function searchProducts(){

  const keyword = document
    .getElementById("searchInput")
    .value
    .toLowerCase();

  const filtered = allProducts.filter(product =>
    product.name.toLowerCase().includes(keyword) ||
    product.category.toLowerCase().includes(keyword)
  );

  displayProducts(filtered);

}

fetchProducts();

function toggleSidebar(){

  const sidebar = document.getElementById("sidebar");

  sidebar.classList.toggle("active");

}

function filterCategory(category){

  const kurtisSection = document.getElementById("kurtis-section");
  const unisexSection = document.getElementById("unisex-section");
  const tshirtsSection = document.getElementById("tshirts-section");

  if(category === "kurtis"){
    kurtisSection.style.display = "block";
    unisexSection.style.display = "none";
    tshirtsSection.style.display = "none";
  }

  else if(category === "unisex"){
    kurtisSection.style.display = "none";
    unisexSection.style.display = "block";
    tshirtsSection.style.display = "none";
  }

  else if(category === "t-shirts"){
    kurtisSection.style.display = "none";
    unisexSection.style.display = "none";
    tshirtsSection.style.display = "block";
  }

}

let slideIndex = 0;

const slidesContainer = document.querySelector(".slides");
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

function showSlide(index){

  if(index >= slides.length){
    slideIndex = 0;
  }

  if(index < 0){
    slideIndex = slides.length - 1;
  }

  slidesContainer.style.transform =
    `translateX(-${slideIndex * 100}%)`;

  dots.forEach(dot => dot.classList.remove("active"));
  dots[slideIndex].classList.add("active");
}

function changeSlide(step){
  slideIndex += step;
  showSlide(slideIndex);
}

function setSlide(index){
  slideIndex = index;
  showSlide(slideIndex);
}

/* AUTO SLIDE (5 seconds) */

setInterval(()=>{
  slideIndex++;
  showSlide(slideIndex);
},3000);