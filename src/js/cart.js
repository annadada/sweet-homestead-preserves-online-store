(function () {
  // Cart object to manage the shopping cart state
  const cart = {
    price: 0,
    counter: null,
    getPrice(cb) {
      this.price = cb(this.items, this.getDiscountIfEnabled());
      if (this.price < 0) this.price = 0;
      return this.price;
    },
    getDiscount() {
      return this.discount.percentage;
    },
    getDiscountIfEnabled() {
      if (this.discount.enabled) {
        return this.getDiscount();
      } else {
        return 0;
      }
    },
    removeItem(id) {
      const index = this.items.findIndex(item => item.id === id);
      this.items.splice(index, 1);
      this.saveToLocalStorage();
      this.refreshProductsCount();
    },
    updateQuantity(id, newQuantity) {
      const item = this.items.find(item => item.id === id);
      if (item) {
        item.quantity = newQuantity;
        this.saveToLocalStorage();
        this.refreshProductsCount();
      }
    },
    saveToLocalStorage() {
      localStorage.setItem('items', JSON.stringify(this.items));
    },
    discount: {
      percentage: 10,
      enabled: false,
    },
    items: [],
    initCounter(counterElement) {
      this.counter = counterElement;
      this.refreshProductsCount();
    },
    refreshProductsCount() {
      if (this.counter) {
        this.counter.innerText = this.items.reduce((total, item) => total + item.quantity, 0);
      }
    },
  }

  // Load data from localStorage
  cart.items = JSON.parse(localStorage.getItem('items')) || [];


  const discountElement = document.querySelector('#discount');
  const itemsContainer = document.querySelector('#items');
  const discountCheckbox = document.querySelector('#add-discount');
  const counterElement = document.querySelector('.counter');

  // Initialize the counter
  cart.initCounter(counterElement);

  // Invoke calculatePrice initially
  calculatePrice();

  // Add products to the table
  for (const item of cart.items) {
    addItem(item);
  }

  // Function to add a row for each item in the cart
  function addItem(item) {
    itemsContainer.innerHTML += `<tr data-item-id="${item.id}">
      <td><button class="delete">x</button></td>
      <td>${item.title}</td>
      <td><input class="quantity" type="number" value="${item.quantity || 1}"></td>
      <td class="item-price">${parseFloat(item.price * (item.quantity || 1)).toFixed(2)}</td>
    </tr>`;
  }

  // Function to remove rows
  const removeRow = (e) => {
    if (e.target.classList.contains('delete')) {
      const row = e.target.closest('tr');
      if (row) {
        cart.removeItem(Number(row.dataset.itemId));
        row.remove();
        calculatePrice();
      }
    }
  }

  // Function to update quantity from input
  const updatePriceFromQuantity = (e) => {
    const quantityInput = e.target;
    const row = quantityInput.closest('tr');
    const itemId = Number(row.dataset.itemId);
    const newQuantity = parseInt(quantityInput.value);

    if (newQuantity >= 1) {
      cart.updateQuantity(itemId, newQuantity);

      const itemPriceElement = row.querySelector('.item-price');
      const item = cart.items.find(item => item.id === itemId);
      const newPrice = parseFloat(item.price) * newQuantity;
      itemPriceElement.textContent = newPrice.toFixed(2);

      calculatePrice();
    } else {
      quantityInput.value = 1;
    }
  }

  // Function to calculate the total price
  function calculatePrice() {
    let total = cart.getPrice((items, discount) => {
      return items.reduce((acc, item) => acc + item.price * item.quantity * (1 - discount / 100), 0);
    });

    document.querySelector('#total-price').innerHTML = total.toFixed(2);
    cart.saveToLocalStorage(); // Zapisz zmiany w localStorage
  }

  // Function to add discount
  const addDiscount = function () {
    cart.discount.enabled = discountCheckbox.checked;
    if (cart.getDiscount() > 0) {
      document
        .querySelector('#discount-amount')
        .innerHTML = ` -${cart.getDiscount()}%`;
      discountElement.classList.toggle('hidden', !discountCheckbox.checked);
    }
    calculatePrice();
  }


  discountCheckbox.addEventListener('change', addDiscount);
  itemsContainer.addEventListener('click', removeRow);
  itemsContainer.addEventListener('input', updatePriceFromQuantity);

  // Save the total price to memory
  const savePriceToStore = () => {
    localStorage.setItem('totalPrice', cart.price);
  }

  const nextButton = document.querySelector('#go-to-summary');
  nextButton.addEventListener('click', savePriceToStore);
})();
