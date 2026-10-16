// With Love, Always — beginner-friendly product catalogue and WhatsApp order builder.
// Before launch: replace this placeholder with your business WhatsApp number.
// Use international format with digits only: South Africa starts with 27; omit the leading 0.
const WHATSAPP_NUMBER = "27XXXXXXXXX";

const products = [
  { id: "soft-blush", name: "Soft Blush", price: 89, description: "A gentle, romantic candle for quiet evenings.", image: "images/pink.jpeg", imageAlt: "Pink candle in a glass jar with flowers" },
  { id: "golden-hour", name: "Golden Hour", price: 99, description: "A warm glow for a little everyday luxury.", image: "images/teal.jpeg", imageAlt: "Teal candle in a glass jar" },
  { id: "petal-kiss", name: "Petal Kiss", price: 109, description: "A floral-inspired gift for someone dear.", image: "images/purple.jpeg", imageAlt: "Purple candle in a glass jar with roses" },
  { id: "love-note", name: "Love Note Gift", price: 129, description: "A candle made extra special with a message.", image: "images/packages.jpeg", imageAlt: "Gift box with four candles in colored glass jars" }
];
let selectedProduct = products[0];
const productGrid = document.querySelector("#productGrid");
const toast = document.querySelector("#toast");
let giftDetails = { occasion: "Birthday", recipient: "", message: "", wrap: "Gift-ready packaging (confirm availability)" };

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function renderProducts() {
  productGrid.innerHTML = products.map((product, index) => `
    <article class="product-card"><div class="product-art has-photo"><img class="product-photo" src="${product.image}" alt="${product.imageAlt}" loading="lazy"></div>
      <div class="product-info"><div class="product-title-row"><h3>${product.name}</h3><span class="price">R${product.price.toFixed(2)}</span></div><p>${product.description}</p>
      <button class="add-button ${index === 0 ? "selected" : ""}" data-product="${product.id}" type="button">${index === 0 ? "✓ Selected for your order" : "Choose this candle"}</button></div></article>`).join("");
  productGrid.querySelectorAll("[data-product]").forEach(button => button.addEventListener("click", () => {
    selectedProduct = products.find(product => product.id === button.dataset.product);
    productGrid.querySelectorAll("[data-product]").forEach(item => {
      const active = item.dataset.product === selectedProduct.id;
      item.classList.toggle("selected", active);
      item.textContent = active ? "✓ Selected for your order" : "Choose this candle";
    });
    showToast(`${selectedProduct.name} selected for your gift request.`);
  }));
}

function readGiftForm() {
  giftDetails = {
    occasion: document.querySelector("#occasion").value,
    recipient: document.querySelector("#recipient").value.trim(),
    message: document.querySelector("#giftMessage").value.trim(),
    wrap: document.querySelector("#wrapChoice").value
  };
}
function buildOrderMessage() {
  readGiftForm();
  return [
    "Hello! I'd like to enquire about a candle gift from With Love, Always.", "",
    `Candle: ${selectedProduct.name} (listed prototype price R${selectedProduct.price.toFixed(2)})`,
    `Occasion: ${giftDetails.occasion}`, `Gift recipient: ${giftDetails.recipient || "Not specified"}`,
    `Gift message: ${giftDetails.message || "No message added yet"}`, `Packaging: ${giftDetails.wrap}`, "",
    "Please confirm availability, final price and delivery/pick-up options before I pay. Thank you!"
  ].join("\n");
}
function openWhatsApp() {
  if (WHATSAPP_NUMBER.includes("X")) {
    showToast("Demo mode: add your business WhatsApp number in script.js before ordering.");
    return;
  }
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildOrderMessage())}`, "_blank", "noopener,noreferrer");
}

document.querySelector("#giftForm").addEventListener("submit", event => {
  event.preventDefault(); readGiftForm();
  showToast("Gift details saved for this visit. Choose a candle and start your WhatsApp order.");
  document.querySelector("#order").scrollIntoView({ behavior: "smooth" });
});
document.querySelector("#whatsappButton").addEventListener("click", openWhatsApp);
const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open"); menuToggle.setAttribute("aria-expanded", String(open));
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false");
}));
document.querySelector("#year").textContent = new Date().getFullYear();
renderProducts();
