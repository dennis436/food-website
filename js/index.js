document.addEventListener("DOMContentLoaded", function () {
  let cart = [];

  function updateCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalContainer = document.getElementById("total");
    cartItemsContainer.innerHTML = "";
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "Cart is empty.";
      totalContainer.innerHTML = "Total: $0.00";
      return;
    }
    let total = 0;
    cart.forEach((item, index) => {
      total += parseFloat(item.price);
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
        <span>${item.name} - $${item.price.toFixed(2)}</span>
        <button onclick="removeFromCart(${index})">Remove</button>
      `;
      cartItemsContainer.appendChild(cartItem);
    });
    totalContainer.innerHTML = `Total: $${total.toFixed(2)}`;
  }

  function addToCart(itemName, price) {
    cart.push({ name: itemName, price: parseFloat(price) });
    updateCart();
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
  }

  document
    .getElementById("menu-list")
    .addEventListener("click", function (event) {
      if (event.target.tagName === "IMG") {
        const itemName = event.target.alt;
        const price = event.target.nextElementSibling.innerText.split("$")[1];
        addToCart(itemName, price);
      }
    });

  updateCart();

  // Stripe Payment Handling
  const stripe = Stripe("your-publishable-key-here");
  const elements = stripe.elements();
  const card = elements.create("card");
  card.mount("#card-element");

  document
    .getElementById("payment-form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const { token, error } = await stripe.createToken(card);
      if (error) {
        document.getElementById("card-errors").textContent = error.message;
      } else {
        alert("Payment successful!");
        cart = [];
        updateCart();
      }
    });
});
