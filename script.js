// Add the public form ID from your Formspree dashboard before accepting enquiries.
const FORMSPREE_FORM_ID = "myekoypj";

const products = [
  { id: "soft-blush", name: "Soft Blush", price: 90, description: "A gentle, romantic candle for quiet evenings.", image: "images/pink.jpeg", imageAlt: "Pink candle in a glass jar with flowers" },
  { id: "golden-hour", name: "Golden Hour", price: 90, description: "A warm glow for a little everyday luxury.", image: "images/teal.jpeg", imageAlt: "Teal candle in a glass jar" },
  { id: "petal-kiss", name: "Petal Kiss", price: 90, description: "A floral-inspired gift for someone dear.", image: "images/purple.jpeg", imageAlt: "Purple candle in a glass jar with roses" },
  { id: "love-note", name: "Love Note Gift", price: 100, description: "A candle made extra special with a message.", image: "images/packages.jpeg", imageAlt: "Gift box with four candles in colored glass jars" }
];
let selectedProduct = products[0];
const productGrid = document.querySelector("#productGrid");
const toast = document.querySelector("#toast");
const orderForm = document.querySelector("#orderForm");
const orderStatus = document.querySelector("#orderStatus");
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
document.querySelector("#giftForm").addEventListener("submit", event => {
  event.preventDefault(); readGiftForm();
  showToast("Gift details saved for this visit. Choose a candle and send your email enquiry.");
  document.querySelector("#order").scrollIntoView({ behavior: "smooth" });
});
orderForm.addEventListener("submit", async event => {
  event.preventDefault();
  if (FORMSPREE_FORM_ID === "YOUR_FORMSPREE_FORM_ID") {
    orderStatus.textContent = "Email requests aren't connected yet. Add your Formspree form ID in script.js to receive orders.";
    return;
  }

  readGiftForm();
  const submitButton = orderForm.querySelector("button[type='submit']");
  const formData = new FormData(orderForm);
  formData.append("_replyto", formData.get("email"));
  formData.append("_subject", `Candle gift enquiry: ${selectedProduct.name}`);
  formData.append("Candle", `${selectedProduct.name} (listed price R${selectedProduct.price.toFixed(2)})`);
  formData.append("Occasion", giftDetails.occasion);
  formData.append("Gift recipient", giftDetails.recipient || "Not specified");
  formData.append("Gift message", giftDetails.message || "No message added");
  formData.append("Packaging", giftDetails.wrap);
  formData.append("message", "Please confirm availability, final price and delivery or pick-up options before payment.");

  submitButton.disabled = true;
  orderStatus.textContent = "Sending your enquiry...";
  try {
    const response = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error("Form submission failed");
    orderForm.reset();
    orderStatus.textContent = "Your enquiry was sent. We'll reply to your email soon.";
  } catch {
    orderStatus.textContent = "We couldn't send your enquiry. Please try again in a moment.";
  } finally {
    submitButton.disabled = false;
  }
});
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
