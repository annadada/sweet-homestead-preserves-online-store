// Function createCart takes a counter (DOM element) and returns an object with methods for handling the shopping cart

export default function createCart(counter) {
  // Array to store cart items
  let items = [];

  // Function to refresh the product count displayed in the cart
  const refreshProductsCount = () => {
    // Using the reduce method to calculate the total quantity of products in the cart
    const totalCount = items.reduce((total, item) => total + item.quantity, 0);
    counter.innerText = totalCount;
  };

  // Function to update the cart state in the local storage
  const updateStore = () => {
    localStorage.setItem('items', JSON.stringify(items));
  };

  // Function to set cart items based on new data
  const setItems = newItems => {
    items = newItems;
    updateStore();
    refreshProductsCount();
  };

  // Function to add a new product to the cart with an optional default quantity of 1
  const add = (id, title, price, quantity = 1) => {
    items.push({ id, title, price, quantity });
    refreshProductsCount();
    updateStore();
  };

  // Function to remove a product from the cart based on its identifier
  const remove = (id) => {
    const index = items.findIndex(item => item.id === id);
    items.splice(index, 1);
    refreshProductsCount();
    updateStore();
  };

  // Function to check if a product with the given identifier is in the cart
  const hasItem = (id) => {
    return items.find(item => item.id === id);
  };

  return {
    add,
    remove,
    setItems,
    hasItem,
  };
}
