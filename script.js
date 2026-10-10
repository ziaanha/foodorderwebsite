
const foods = [
    {
        id: 1,
        name: "Classic Smash Burger",
        category: "Burgers",
        price: 249,
        description: "Juicy smashed patty, cheddar, lettuce and signature sauce.",
        image: "smashburger.jpg"
    },
    {
        id: 2,
        name: "Double Cheese Burger",
        category: "Burgers",
        price: 299,
        description: "Double cheese, grilled patty and our house-made sauce.",
        image: "doublecheeseburger'.jpg"
    },
    {
        id: 3,
        name: "Margherita Pizza",
        category: "Pizza",
        price: 279,
        description: "Classic mozzarella, tomato and fragrant fresh basil.",
        image: "Margherita Pizza.jpg"
    },
    {
        id: 4,
        name: "Pepperoni Pizza",
        category: "Pizza",
        price: 349,
        description: "Golden crust, rich tomato sauce and spicy pepperoni.",
        image: "Pepperoni Pizza.jpg"
    },
    {
        id: 5,
        name: "Loaded Fries",
        category: "Sides",
        price: 159,
        description: "Crispy fries topped with cheese and our special seasoning.",
        image: "Loaded Fries.jpg"
    },
    {
        id: 6,
        name: "Chocolate Brownie",
        category: "Desserts",
        price: 149,
        description: "Rich chocolate brownie with a soft, fudgy centre.",
        image: "Chocolate Brownie.jpg"
    },
    {
        id: 7,
        name: "Strawberry Cheesecake",
        category: "Desserts",
        price: 189,
        description: "Creamy cheesecake finished with sweet strawberry topping.",
        image: "Strawberry Cheesecake.jpg"
    },
    {
        id: 8,
        name: "Iced Coffee",
        category: "Drinks",
        price: 119,
        description: "Chilled coffee, creamy milk and a smooth espresso finish.",
        image: "iced coffee.jpg"
    },
    {
        id: 9,
        name: "Fresh Lemonade",
        category: "Drinks",
        price: 89,
        description: "Refreshing lemon, ice and a touch of sweetness.",
        image: "Fresh Lemonade.jpg"
    }
];

const foodGrid = document.getElementById("food-grid");
const searchInput = document.getElementById("search-input");
const filters = document.getElementById("filters");
const noResults = document.getElementById("no-results");

const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const clearCartButton = document.getElementById("clear-cart");
const checkoutButton = document.getElementById("demo-checkout");
const checkoutMessage = document.getElementById("checkout-message");

let activeCategory = "All";
let searchTerm = "";
let cart = {};

const formatPrice = amount =>
    "₹" + amount.toLocaleString("en-IN");

// Display food cards
function renderFoods() {
    const filteredFoods = foods.filter(food => {
        const matchesCategory =
            activeCategory === "All" ||
            food.category === activeCategory;

        const matchesSearch =
            food.name.toLowerCase().includes(searchTerm) ||
            food.category.toLowerCase().includes(searchTerm) ||
            food.description.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    foodGrid.innerHTML = filteredFoods.map(food => `
        <article class="food-card">
            <div class="food-image">
                <img
                    src="${food.image}"
                    alt="${food.name}"
                    loading="lazy"
                >
                <span class="food-category">${food.category}</span>
            </div>

            <div class="food-info">
                <h3>${food.name}</h3>
                <p>${food.description}</p>

                <div class="food-bottom">
                    <span class="price">${formatPrice(food.price)}</span>
                    <button
                        class="add-button"
                        data-add="${food.id}"
                        aria-label="Add ${food.name} to cart"
                    >+ Add to cart</button>
                </div>
            </div>
        </article>
    `).join("");

    noResults.hidden = filteredFoods.length > 0;
}

// Add a food item to the demo cart
foodGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");
    if (!button) return;

    const id = Number(button.dataset.add);
    cart[id] = (cart[id] || 0) + 1;

    checkoutMessage.textContent = "";
    renderCart();
});

// Search food
searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value.trim().toLowerCase();
    renderFoods();
});

// Filter categories
filters.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    activeCategory = button.dataset.category;

    filters.querySelectorAll(".filter").forEach(filter => {
        filter.classList.toggle("active", filter === button);
    });

    renderFoods();
});

// Display cart contents
function renderCart() {
    const cartEntries = Object.entries(cart)
        .filter(([, quantity]) => quantity > 0);

    const totalQuantity = cartEntries.reduce(
        (sum, [, quantity]) => sum + quantity, 0
    );

    const totalPrice = cartEntries.reduce((sum, [id, quantity]) => {
        const food = foods.find(item => item.id === Number(id));
        return sum + food.price * quantity;
    }, 0);

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = formatPrice(totalPrice);

    if (cartEntries.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is waiting for something delicious.
            </p>
        `;
        return;
    }

    cartItems.innerHTML = cartEntries.map(([id, quantity]) => {
        const food = foods.find(item => item.id === Number(id));

        return `
            <div class="cart-item">
                <img src="${food.image}" alt="${food.name}">

                <div class="cart-item-info">
                    <h3>${food.name}</h3>
                    <p>${formatPrice(food.price * quantity)}</p>
                </div>

                <div class="quantity-controls">
                    <button data-action="decrease" data-id="${id}"
                        aria-label="Decrease ${food.name} quantity">−</button>

                    <span>${quantity}</span>

                    <button data-action="increase" data-id="${id}"
                        aria-label="Increase ${food.name} quantity">+</button>

                    <button data-action="remove" data-id="${id}"
                        aria-label="Remove ${food.name}">×</button>
                </div>
            </div>
        `;
    }).join("");
}

// Change item quantities or remove items
cartItems.addEventListener("click", event => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "increase") {
        cart[id] = (cart[id] || 0) + 1;
    } else if (action === "decrease") {
        cart[id]--;

        if (cart[id] <= 0) {
            delete cart[id];
        }
    } else if (action === "remove") {
        delete cart[id];
    }

    checkoutMessage.textContent = "";
    renderCart();
});

// Clear the cart
clearCartButton.addEventListener("click", () => {
    cart = {};
    checkoutMessage.textContent = "";
    renderCart();
});

// Demo-only checkout
checkoutButton.addEventListener("click", () => {
    const itemCount = Object.values(cart).reduce(
        (sum, quantity) => sum + quantity, 0
    );

    if (itemCount === 0) {
        checkoutMessage.textContent =
            "Your cart is empty. Add a dish to preview your order!";
        return;
    }

    checkoutMessage.textContent =
        `Demo preview: ${itemCount} item(s), total ${cartTotal.textContent}. No real order was placed.`;
});

// Initial page render
renderFoods();
renderCart();
