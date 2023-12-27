import createCart from './helpers/createCart.js';

const coursesList = document.querySelector('.products-list');
const counter = document.querySelector('.counter');
const buttonsCart = document.querySelectorAll('.cart-button');

const cart = createCart(counter);

// Retrieve items from local storage and set them in the cart if available
const startItems = JSON.parse(localStorage.getItem('items'));
if (startItems) {
  cart.setItems(startItems);
}


// Function to handle button color toggling
const toggleClass = (className, text, mode) => {
  // mode = 'add', 'remove'
  return (element) => {
    element.classList[mode](className);
    element.innerText = text;
  }
}

// Function to add class for cart styling when item is in the cart
const addClassInCart = toggleClass('in-cart', 'Remove from cart', 'add');

// Function to remove class for cart styling when item is not in the cart
const removeClassInCart = toggleClass('in-cart', 'Add to cart', 'remove');


// Function to handle button click events and manage cart state
const addToCartHandler = (e) => {
  if (e.target.tagName !== 'BUTTON') return;
  const title = e.target.dataset.title;
  const price = Number(e.target.dataset.price);
  const id = Number(e.target.dataset.id);

  // If item is in the cart, remove it; otherwise, add it to the cart
  if (cart.hasItem(id)) {
    cart.remove(id);
    removeClassInCart(e.target);
  } else {
    cart.add(id, title, price);
    addClassInCart(e.target);
  }
}

// Add a click event listener to the products list to handle cart updates
coursesList.addEventListener('click', addToCartHandler);


buttonsCart.forEach(button => {
  // Check if the item corresponding to the button is in the cart
  if (cart.hasItem(+button.dataset.id)) {
    // Apply the 'in-cart' class and update the button styling
    addClassInCart(button);
  }
});