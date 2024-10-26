// Sample Data for Food Items with Image URLs
const foodItems = [
    { name: "McChicken", description: "Classic chicken patty with lettuce and mayonnaise", price: 1500, image: "assets/03-McChicken-178x178.png" },
    { name: "Spicy McCrispy", description: "Spicy crispy chicken fillet with lettuce", price: 1800, image: "assets/06-McCrispy-178x178.png" },
    { name: "McArabia", description: "Chicken patties wrapped in flatbread with lettuce", price: 1200, image: "assets/012-McArabia-178x178.png" },
    { name: "2pcs Big Chicken", description: "2 pieces of juicy, crispy fried chicken", price: 1500, image: "assets/014-2pcs-BIC-178x178.png" },
    { name: "9pcs Chicken Nuggets", description: "9 pieces of golden, tender chicken nuggets", price: 1300, image: "assets/015-9pc-Nuggets-178x178.png" },
    { name: "Cheeseburger", description: "Beef patty with cheese, pickles, and ketchup", price: 800, image: "assets/cheese-burger-1-178x178.png" },
    { name: "Chocolate Frappe", description: "Chilled chocolate drink topped with whipped cream", price: 700, image: "assets/Chocolate-Frappe-178x178.png" },
    { name: "Chocolate Shake", description: "Thick, creamy chocolate milkshake", price: 600, image: "assets/Chocolate-Shake-1-178x178.png" },
    { name: "Coke", description: "Refreshing, chilled Coca-Cola drink", price: 150, image: "assets/Coke-1-178x178.png" },
    { name: "McFlurry Fudge Brownie", description: "Soft serve with fudge brownie topping", price: 500, image: "assets/mcflurry-fudge-brownie-178x178.png" },
    { name: "Regular Fries", description: "Golden, crispy, salted fries", price: 300, image: "assets/Regular-Fries-1-178x178.png" },
    { name: "Sundae Brownie", description: "Vanilla ice cream topped with chocolate brownie", price: 600, image: "assets/Sundae-Brownie-178x178.png" },
];

const foodItemTemplate = document.getElementById("food-item-template");
const menuContainer = foodItemTemplate.parentElement;

foodItems.forEach(item => {
    const itemElement = foodItemTemplate.cloneNode(true);
    itemElement.style.display = "block";

    itemElement.querySelector(".item-name").textContent = item.name;
    itemElement.querySelector(".item-desc").textContent = item.description;
    itemElement.querySelector(".item-price").textContent = `Rs. ${item.price.toFixed(2)}`;
    itemElement.querySelector(".item-img").src = item.image;

    itemElement.querySelector(".add-to-cart").addEventListener("click", () => addToCart(item));
    menuContainer.appendChild(itemElement);
});

let cartItems = [];

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    cartItemsContainer.innerHTML = ""; // Clear existing items
    const viewOrderSummaryButton = document.getElementById("viewOrderSummary");

    if (cartItems.length === 0) {
        // Display "Your cart is empty" if no items in cart
        const emptyMessage = document.createElement("li");
        emptyMessage.className = "list-group-item text-muted text-center";
        emptyMessage.textContent = "Your cart is empty";
        cartItemsContainer.appendChild(emptyMessage);
        cartTotal.textContent = "Total: Rs. 0.00";
        viewOrderSummaryButton.disabled = true;

        return;
    }

    viewOrderSummaryButton.disabled = false;
    let totalPrice = 0; // Initialize total price

    // Header row
    const headerRow = document.createElement("li");
    headerRow.className = "list-group-item d-flex justify-content-between font-weight-bold";
    headerRow.innerHTML = `
        <div style="flex: 1;">Item</div>
        <div style="flex: 2; text-align: center;">Quantity</div>
    `;
    cartItemsContainer.appendChild(headerRow);

    cartItems.forEach(cartItem => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item d-flex align-items-center";

        // Item name section
        const itemName = document.createElement("div");
        itemName.style.flex = "1";
        itemName.textContent = cartItem.name;

        // Quantity controls
        const quantityControls = document.createElement("div");
        quantityControls.style.flex = "1";
        quantityControls.className = "d-flex justify-content-center align-items-center";

        const decreaseButton = document.createElement("button");
        decreaseButton.className = "btn btn-sm btn-outline-secondary";
        decreaseButton.innerHTML = `<i class="fas fa-minus"></i>`;
        decreaseButton.onclick = () => {
            if (cartItem.quantity > 1) {
                cartItem.quantity--;
                updateCartDisplay();
            }
        };

        const quantityDisplay = document.createElement("span");
        quantityDisplay.className = "px-2";
        quantityDisplay.textContent = cartItem.quantity;

        const increaseButton = document.createElement("button");
        increaseButton.className = "btn btn-sm btn-outline-secondary";
        increaseButton.innerHTML = `<i class="fas fa-plus"></i>`;
        increaseButton.onclick = () => {
            cartItem.quantity++;
            updateCartDisplay();
        };

        quantityControls.appendChild(decreaseButton);
        quantityControls.appendChild(quantityDisplay);
        quantityControls.appendChild(increaseButton);

        const removeButton = document.createElement("button");
        removeButton.className = "btn btn-sm btn-outline-danger";
        removeButton.innerHTML = `<i class="fas fa-trash-alt"></i>`;
        removeButton.onclick = () => {
            cartItems.splice(cartItems.indexOf(cartItem), 1);
            updateCartDisplay();
        };

        listItem.appendChild(itemName);
        listItem.appendChild(quantityControls);
        listItem.appendChild(removeButton);
        cartItemsContainer.appendChild(listItem);

        totalPrice += cartItem.price * cartItem.quantity;
    });

    // Update total price display
    cartTotal.textContent = `Total: Rs. ${totalPrice.toFixed(2)}`;
}

function addToCart(item) {

    const existingItem = cartItems.find(cartItem => cartItem.name === item.name);
    if (existingItem) {
        existingItem.quantity++;
        updateCartDisplay()
    } else {
        cartItems.push({ ...item, quantity: 1 });
        updateCartDisplay()
    }
    console.log("Items in cart:", cartItems);
}

const viewOrderSummary = document.getElementById('viewOrderSummary').addEventListener('click', () => orderSummary(cartItems));

const overlay = document.querySelector('.overlay')
const summaryDiv = document.getElementById("orderSummary");

function orderSummary(cartItems) {


    summaryDiv.style.visibility = "visible"; // Show the order summary
    overlay.style.visibility = "visible"

    const itemList = document.getElementById("itemList");

    let totalItems = 0;
    let totalPrice = 0;

    cartItems.forEach(cartItem => {

        totalItems += cartItem.quantity;
        totalPrice += cartItem.price * cartItem.quantity;

        const row = document.createElement("tr");

        const quantityCell = document.createElement("td");
        quantityCell.textContent = `${cartItem.quantity}`;

        const x = document.createElement("td");
        x.textContent = `x`;

        const nameCell = document.createElement("td");
        nameCell.textContent = `${cartItem.name}`;

        const priceCell = document.createElement("td");
        priceCell.textContent = `Rs. ${cartItem.price.toFixed(2)}`;

        row.appendChild(quantityCell);
        row.appendChild(x);
        row.appendChild(nameCell);
        row.appendChild(priceCell);

        itemList.appendChild(row);

    });


    const totalQty = document.getElementById("totalQty");
    totalQty.innerHTML = `${totalItems}`;

    const totalValue = document.getElementById("totalValue");
    totalValue.innerHTML = `Rs.${totalPrice.toFixed(2)}`;

    document.getElementById("cancelBtn").onclick = () => {
        summaryDiv.style.visibility = "hidden";
        overlay.style.visibility = "hidden"
        const itemList = document.getElementById("itemList");
        itemList.innerHTML = ""
    };
}

document.getElementById('placeOrder').addEventListener('click', () => {
    const confirmationModal = document.getElementById('confirmationModal');
    confirmationModal.style.visibility = "visible";

    summaryDiv.style.visibility = "hidden";
    overlay.style.visibility = "hidden";
    const itemList = document.getElementById("itemList");
    itemList.innerHTML = "";

    setTimeout(() => {
        confirmationModal.style.visibility = "hidden"; // Hide the modal after 3 seconds
    }, 1000);

    cartItems = [];
    updateCartDisplay();
});







updateCartDisplay()






