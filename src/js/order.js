// Function to validate the full name
const validateName = (value) => {
  if (!value) return 'Full name is required';
  if (value.length < 3) return 'Full name is too short';
}

// Function to validate the phone number
const validateTel = (value) => {
  if (!value) return 'Phone number is required';
  if (value.length < 9) return 'Phone number is incorrect';
}

// Function to validate the email address
const validateEmail = (value) => {
  if (!value) return 'Email is required';
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(value)) return 'Email is not valid';
}

// Function to validate the confirmation email address
const validateEmailConfirm = (value, email) => {
  if (value !== email) return 'Email is different';
}

// Function to choose the appropriate validation based on the key
const validate = (key, value, allValues) => {
  switch (key) {
    case 'name': return validateName(value);
    case 'tel': return validateTel(value);
    case 'email': return validateEmail(value);
    case 'email-confirm': return validateEmailConfirm(value, allValues.email);
  }
}

// Function to validate all values and display errors
const validateValues = (values) => {
  const errors = [];
  Object.entries(values).forEach(([key, value]) => {
    const error = validate(key, value, values);
    if (error) errors.push(error);
  })

  // Display errors in the HTML element
  document.querySelector('#errors').innerHTML = errors
    .map(e => `<li>${e}</li>`)
    .join('');

  return errors.length > 0;
}

// Function to handle form submission
const onSubmit = (e) => {
  e.preventDefault();

  // Get form elements
  const elements = document.querySelector("form").elements;
  const values = {
    name: elements['name'].value,
    email: elements['email'].value,
    'email-confirm': elements['email-confirm'].value,
    tel: elements['tel'].value,
    payment: elements['payment'].value,
  };

  // Validate form values
  const hasErrors = validateValues(values);

  // If no errors, proceed with data submission
  if (!hasErrors) {
    // Display "Sending..."
    document.querySelector('#loading').style.display = 'flex';

    // Clear items from the shopping cart
    localStorage.removeItem('items');

    // Simulate server communication with a delay
    setTimeout(() => {
      // Redirect to the order confirmation page
      window.location.href = './order-accepted.html'
    }, 3000);
  }
}

// Attach the form submission handler
document.querySelector('form').addEventListener('submit', onSubmit);

// Display the order date
const dateContianer = document.querySelector('#date');

const showOrderDate = (element) => {
  const d = new Date();
  element.innerHTML = d.toLocaleString();
}
showOrderDate(dateContianer);

// Display the summary of ordered products
const itemsContainer = document.querySelector('#items-list');
const items = JSON.parse(localStorage.getItem('items')) || [];

const showProducts = (products, element) => {
  const html = products
    .map(p => `<li>${p.quantity} x ${p.title}</li>`)
    .join('');
  element.innerHTML = html;
}
showProducts(items, itemsContainer);

// Display the total price
const priceContainer = document.querySelector('#total-price');
const totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;
const roundedPrice = totalPrice.toFixed(2);
priceContainer.innerText = `${roundedPrice}`;