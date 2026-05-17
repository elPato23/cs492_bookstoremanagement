const inventory = [
  { id: 1, title: "The Art of JavaScript", author: "Alex Martinez", price: 24.99, stock: 12, cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80" },
  { id: 2, title: "CSS for Designers", author: "Maya Lin", price: 19.99, stock: 8, cover: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" },
  { id: 3, title: "Modern Web Apps", author: "Jordan Lee", price: 29.99, stock: 5, cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80" },
  { id: 4, title: "Design Thinking", author: "Riley Patel", price: 21.5, stock: 10, cover: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" },
  { id: 5, title: "Atomic Habits", author: "James Clear", price: 17.95, stock: 7, cover: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80" }
];

const inventoryList = document.getElementById("inventoryList");
const cartCount = document.getElementById("cartCount");
const cartPanel = document.getElementById("cartPanel");
const loginPanel = document.getElementById("loginPanel");
const userStatus = document.getElementById("userStatus");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

const loginBtn = document.getElementById("loginBtn");
const cartBtn = document.getElementById("cartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const closeLoginBtn = document.getElementById("closeLoginBtn");
const checkoutBtn = document.getElementById("checkoutBtn");
const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

let cart = JSON.parse(localStorage.getItem("bookstoreCart") || "[]");
let currentUser = localStorage.getItem("bookstoreUser") || null;

function renderInventory() {
  inventoryList.innerHTML = inventory
    .map(book => {
      const disabled = cart.find(item => item.id === book.id) ? "disabled" : "";
      return `
        <article class="book-card">
          <img src="${book.cover}" alt="${book.title} cover" />
          <div class="book-card-content">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
            <div class="book-meta">
              <span>$${book.price.toFixed(2)}</span>
              <span>${book.stock} in stock</span>
            </div>
            <button class="primary-btn add-btn" data-id="${book.id}" ${disabled}>${disabled ? "In Cart" : "Add to Cart"}</button>
          </div>
        </article>
      `;
    })
    .join("");

  document.querySelectorAll(".add-btn").forEach(button => {
    button.addEventListener("click", () => addToCart(Number(button.dataset.id)));
  });
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = `<p>Your cart is empty. Add books to start shopping.</p>`;
    cartTotal.textContent = "0.00";
    cartCount.textContent = "0";
    return;
  }

  cartItems.innerHTML = cart
    .map(item => `
      <div class="cart-item">
        <div>
          <h4>${item.title}</h4>
          <small>Author: ${item.author}</small>
          <p>$${item.price.toFixed(2)} each</p>
        </div>
        <div class="quantity-controls">
          <button data-action="decrease" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button data-action="increase" data-id="${item.id}">+</button>
          <button data-action="remove" data-id="${item.id}" class="close-btn">×</button>
        </div>
      </div>
    `)
    .join("");

  cartCount.textContent = cart.reduce((count, item) => count + item.quantity, 0);
  cartTotal.textContent = cart
    .reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);

  cartItems.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id);
      if (button.dataset.action === "increase") updateQuantity(id, 1);
      if (button.dataset.action === "decrease") updateQuantity(id, -1);
      if (button.dataset.action === "remove") removeFromCart(id);
    });
  });
}

function updateQuantity(bookId, change) {
  cart = cart.map(item => {
    if (item.id !== bookId) return item;
    return { ...item, quantity: Math.max(1, item.quantity + change) };
  });
  saveState();
  renderCart();
  renderInventory();
}

function removeFromCart(bookId) {
  cart = cart.filter(item => item.id !== bookId);
  saveState();
  renderCart();
  renderInventory();
  showToast("Removed from cart");
}

function addToCart(bookId) {
  if (!currentUser) {
    showLoginPanel();
    return;
  }

  const book = inventory.find(item => item.id === bookId);
  if (!book) return;

  const cartItem = cart.find(item => item.id === bookId);
  if (cartItem) {
    updateQuantity(bookId, 1);
    return;
  }

  cart.push({ ...book, quantity: 1 });
  saveState();
  renderCart();
  renderInventory();
  showToast(`Added "${book.title}" to cart`);
}

function saveState() {
  localStorage.setItem("bookstoreCart", JSON.stringify(cart));
}

function showLoginPanel() {
  loginPanel.classList.remove("hidden");
  loginPanel.setAttribute("aria-hidden", "false");
}

function hideLoginPanel() {
  loginPanel.classList.add("hidden");
  loginPanel.setAttribute("aria-hidden", "true");
}

function showCartPanel() {
  cartPanel.classList.remove("hidden");
  cartPanel.setAttribute("aria-hidden", "false");
}

function hideCartPanel() {
  cartPanel.classList.add("hidden");
  cartPanel.setAttribute("aria-hidden", "true");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2500);
}

function setUser(user) {
  currentUser = user;
  localStorage.setItem("bookstoreUser", user);
  userStatus.textContent = `Signed in as ${user}`;
  loginBtn.textContent = "Sign Out";
}

function signOut() {
  currentUser = null;
  localStorage.removeItem("bookstoreUser");
  userStatus.textContent = "Not signed in";
  loginBtn.textContent = "Login";
}

loginBtn.addEventListener("click", () => {
  if (currentUser) {
    signOut();
    showToast("Signed out successfully");
    return;
  }
  showLoginPanel();
});

cartBtn.addEventListener("click", () => {
  renderCart();
  showCartPanel();
});

closeCartBtn.addEventListener("click", hideCartPanel);
closeLoginBtn.addEventListener("click", hideLoginPanel);

checkoutBtn.addEventListener("click", () => {
  if (!currentUser) {
    hideCartPanel();
    showLoginPanel();
    return;
  }
  if (cart.length === 0) {
    showToast("Your cart is empty.");
    return;
  }
  cart = [];
  saveState();
  renderCart();
  renderInventory();
  showToast("Checkout successful! Thank you for your order.");
});

loginForm.addEventListener("submit", event => {
  event.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if (!username || !password) {
    showToast("Please enter both username and password.");
    return;
  }
  setUser(username);
  hideLoginPanel();
  showToast(`Welcome, ${username}!`);
  loginForm.reset();
});

window.addEventListener("click", event => {
  if (!cartPanel.classList.contains("hidden") && event.target === cartPanel) {
    hideCartPanel();
  }
  if (!loginPanel.classList.contains("hidden") && event.target === loginPanel) {
    hideLoginPanel();
  }
});

function init() {
  if (currentUser) {
    userStatus.textContent = `Signed in as ${currentUser}`;
    loginBtn.textContent = "Sign Out";
  }
  renderInventory();
  renderCart();
}

init();
