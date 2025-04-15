// Types
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  sizes: string[];
}

interface CartItem extends Product {
  selectedSize: string;
  quantity: number;
}

interface OrderItem {
  name: string;
  price: number;
  size: string;
  quantity: number;
  total: number;
}

interface OrderData {
  name: string;
  city: string;
  street: string;
  apartment: string;
  items: OrderItem[];
  totalAmount: number;
}

// Product Data
const products: Product[] = [
  {
    id: 1,
    name: "Crossed red lines",
    price: 49.99,
    image: "https://cdn.discordapp.com/attachments/1338141958933057590/1361716438515056761/IMG_20250413_185553.png?ex=67ffc4c2&is=67fe7342&hm=3cfb407776901a6be6c2ccdc83bfe24855486f346fa5db18f184057642a7d113&",
    description: "A very comy baggy sweatpants for stylish daily usage in dark red.",
    sizes: ["Small", "Medium", "Large"]
  },
  {
    id: 2,
    name: "Blue Lounge Set",
    price: 79.99,
    image: "https://i5.walmartimages.com/seo/Yuzhih-Womens-2-Piece-Outfits-Oversized-Sweatshirt-Baggy-Fall-Fashion-Sweatpants-with-Pockets-Lounge-Sweatsuit-Sets_9b922787-99df-4bbc-874f-3846547ea0f9.cd9134a6c88d6922fafafc55125d2bf6.jpeg",
    description: "Matching blue sweatshirt and sweatpants set. Oversized for maximum comfort.",
    sizes: ["Small", "Medium", "Large", "XXL"]
  },
  {
    id: 3,
    name: "Checkered Pattern Pants",
    price: 59.99,
    image: "https://m.media-amazon.com/images/I/71gAfsRq0kL._AC_UY1000_.jpg",
    description: "Stylish checkered pattern wide-leg pants. Stand out with this unique design.",
    sizes: ["Small", "Medium", "Large", "XXL"]
  },
  {
    id: 4,
    name: "Grey Stripe Sweatpants",
    price: 54.99,
    image: "https://thekawaiifactory.com/cdn/shop/files/Se608241c6e884988921842fcb898fab0x_1024x1024@2x.webp?v=1706750200",
    description: "Grey sweatpants with pink stripe detail. Comfortable and stylish for casual wear.",
    sizes: ["Small", "Medium", "Large", "XXL"]
  },
  {
    id: 5,
    name: "Basic Black Jeans",
    price: 64.99,
    image: "https://m.media-amazon.com/images/I/41h0OtevGPL._AC_UY1000_.jpg",
    description: "Classic black jeans with a modern fit. Essential for every wardrobe.",
    sizes: ["Small", "Medium", "Large", "XXL"]
  },
  {
    id: 6,
    name: "Vintage Washed Sweatpants",
    price: 69.99,
    image: "https://m.media-amazon.com/images/I/51Lu55YJNIL._AC_UY1000_.jpg",
    description: "Vintage washed black sweatpants with white contrast stitching and branding.",
    sizes: ["Small", "Medium", "Large", "XXL"]
  }
];

// Discord webhook URL
const DISCORD_WEBHOOK_URL = "https://dcrelay.liteeagle.me/relay/871feb1c-8efd-432e-a275-0754f52b2a3f";

// Shopping cart
let cart: CartItem[] = [];

// DOM elements
const productGrid = document.querySelector('.product-grid');
const cartCountElement = document.querySelector('.cart-count');
const cartListElement = document.querySelector('.cart-list');
const emptyCartMessage = document.querySelector('.empty-cart') as HTMLElement;
const totalAmountElement = document.querySelector('.total-amount');
const orderButton = document.querySelector('.btn-order') as HTMLButtonElement;
const modal = document.getElementById('confirmation-modal');
const closeModal = document.querySelector('.close-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const orderDetailsElement = document.querySelector('.order-details');
const deliveryForm = document.getElementById('delivery-form') as HTMLFormElement;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  updateCartUI();

  // Event listeners
  deliveryForm?.addEventListener('submit', handleSubmitOrder);
  closeModal?.addEventListener('click', hideModal);
  closeModalBtn?.addEventListener('click', hideModal);
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      hideModal();
    }
  });
});

// Load products into the page
function loadProducts(): void {
  if (!productGrid) {
    console.error('Product grid element not found');
    return;
  }

  for (const product of products) {
    const productElement = createProductElement(product);
    productGrid.appendChild(productElement);
  }
}

// Create a product card element
function createProductElement(product: Product): HTMLDivElement {
  const productCard = document.createElement('div');
  productCard.className = 'product-card';

  const productImage = document.createElement('img');
  productImage.src = product.image;
  productImage.alt = product.name;
  productImage.className = 'product-image';
  productImage.onerror = () => {
    // Fallback if image fails to load
    productImage.src = 'https://via.placeholder.com/300x300?text=Product+Image';
  };

  const productInfo = document.createElement('div');
  productInfo.className = 'product-info';

  const productTitle = document.createElement('h3');
  productTitle.className = 'product-title';
  productTitle.textContent = product.name;

  const productDescription = document.createElement('p');
  productDescription.textContent = product.description;

  const productPrice = document.createElement('p');
  productPrice.className = 'product-price';
  productPrice.textContent = `EGP ${product.price.toFixed(2)}`;

  const sizeOptions = document.createElement('div');
  sizeOptions.className = 'size-options';

  // Size selection
  if (product.sizes.length > 0) {
    product.sizes.forEach((size, index) => {
      const sizeOption = document.createElement('div');
      sizeOption.className = 'size-option';
      sizeOption.textContent = size;
      sizeOption.dataset.size = size;
      if (index === 0) {
        sizeOption.classList.add('selected');
      }

      sizeOption.addEventListener('click', () => {
        // Remove selected class from all size options
        const options = sizeOptions.querySelectorAll('.size-option');
        for (const option of options) {
          option.classList.remove('selected');
        }

        // Add selected class to clicked size option
        sizeOption.classList.add('selected');
      });

      sizeOptions.appendChild(sizeOption);
    });
  } else {
    // Handle case where product has no sizes
    const noSizes = document.createElement('p');
    noSizes.textContent = 'One size fits all';
    sizeOptions.appendChild(noSizes);
  }

  const productActions = document.createElement('div');
  productActions.className = 'product-actions';

  const addToCartBtn = document.createElement('button');
  addToCartBtn.className = 'btn btn-small';
  addToCartBtn.textContent = 'Add to Cart';

  addToCartBtn.addEventListener('click', () => {
    const selectedSizeElement = sizeOptions.querySelector('.size-option.selected') as HTMLElement;
    if (selectedSizeElement) {
      const selectedSize = selectedSizeElement.dataset.size || '';
      addToCart(product, selectedSize);
    } else if (product.sizes.length === 0) {
      // If no sizes available, use "One Size" as default
      addToCart(product, "One Size");
    } else {
      showNotification('Please select a size first');
    }
  });

  productActions.appendChild(addToCartBtn);

  productInfo.appendChild(productTitle);
  productInfo.appendChild(productDescription);
  productInfo.appendChild(productPrice);
  productInfo.appendChild(sizeOptions);
  productInfo.appendChild(productActions);

  productCard.appendChild(productImage);
  productCard.appendChild(productInfo);

  return productCard;
}

// Add a product to the cart
function addToCart(product: Product, selectedSize: string): void {
  // Check if the product with the selected size is already in the cart
  const existingItemIndex = cart.findIndex(
    item => item.id === product.id && item.selectedSize === selectedSize
  );

  if (existingItemIndex !== -1) {
    // If the product is already in the cart, increase the quantity
    cart[existingItemIndex].quantity += 1;
  } else {
    // Otherwise, add the product to the cart
    cart.push({
      ...product,
      selectedSize,
      quantity: 1
    });
  }

  // Update the cart UI
  updateCartUI();

  // Show notification
  showNotification(`${product.name} (${selectedSize}) added to cart!`);
}

// Remove an item from the cart
function removeFromCart(index: number): void {
  if (index < 0 || index >= cart.length) {
    console.error('Invalid cart index:', index);
    return;
  }

  cart.splice(index, 1);
  updateCartUI();
  showNotification('Item removed from cart');
}

// Update quantity of an item in the cart
function updateQuantity(index: number, newQuantity: number): void {
  if (index < 0 || index >= cart.length) {
    console.error('Invalid cart index:', index);
    return;
  }

  if (newQuantity <= 0) {
    removeFromCart(index);
    return;
  }

  cart[index].quantity = newQuantity;
  updateCartUI();
}

// Update the cart UI
function updateCartUI(): void {
  if (!cartCountElement || !cartListElement || !emptyCartMessage || !totalAmountElement || !orderButton) {
    console.error('One or more cart UI elements not found');
    return;
  }

  // Update the cart count
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  cartCountElement.textContent = cartCount.toString();

  // Update the cart list
  cartListElement.innerHTML = '';

  if (cart.length === 0) {
    // Show the empty cart message
    emptyCartMessage.style.display = 'block';
    orderButton.disabled = true;
  } else {
    // Hide the empty cart message
    emptyCartMessage.style.display = 'none';
    orderButton.disabled = false;

    // Add the cart items to the list
    cart.forEach((item, index) => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';

      const cartItemImage = document.createElement('img');
      cartItemImage.src = item.image;
      cartItemImage.alt = item.name;
      cartItemImage.className = 'cart-item-image';
      cartItemImage.onerror = () => {
        cartItemImage.src = 'https://via.placeholder.com/100x100?text=Product';
      };

      const cartItemDetails = document.createElement('div');
      cartItemDetails.className = 'cart-item-details';

      const cartItemTitle = document.createElement('h4');
      cartItemTitle.className = 'cart-item-title';
      cartItemTitle.textContent = item.name;

      const cartItemPrice = document.createElement('p');
      cartItemPrice.className = 'cart-item-price';
      cartItemPrice.textContent = `EGP ${(item.price * item.quantity).toFixed(2)}`;

      const cartItemInfo = document.createElement('div');
      cartItemInfo.className = 'cart-item-info';

      const cartItemSize = document.createElement('span');
      cartItemSize.className = 'cart-item-size';
      cartItemSize.textContent = `Size: ${item.selectedSize}`;

      const quantityControls = document.createElement('div');
      quantityControls.className = 'quantity-controls';

      const decreaseBtn = document.createElement('button');
      decreaseBtn.className = 'quantity-btn';
      decreaseBtn.textContent = '-';
      decreaseBtn.addEventListener('click', () => updateQuantity(index, item.quantity - 1));

      const quantityDisplay = document.createElement('span');
      quantityDisplay.className = 'quantity-display';
      quantityDisplay.textContent = item.quantity.toString();

      const increaseBtn = document.createElement('button');
      increaseBtn.className = 'quantity-btn';
      increaseBtn.textContent = '+';
      increaseBtn.addEventListener('click', () => updateQuantity(index, item.quantity + 1));

      quantityControls.appendChild(decreaseBtn);
      quantityControls.appendChild(quantityDisplay);
      quantityControls.appendChild(increaseBtn);

      cartItemInfo.appendChild(cartItemSize);
      cartItemInfo.appendChild(quantityControls);

      const cartItemRemove = document.createElement('span');
      cartItemRemove.className = 'cart-item-remove';
      cartItemRemove.innerHTML = '<i class="fas fa-trash"></i>';
      cartItemRemove.addEventListener('click', () => {
        removeFromCart(index);
      });

      cartItemDetails.appendChild(cartItemTitle);
      cartItemDetails.appendChild(cartItemPrice);
      cartItemDetails.appendChild(cartItemInfo);

      cartItem.appendChild(cartItemImage);
      cartItem.appendChild(cartItemDetails);
      cartItem.appendChild(cartItemRemove);

      cartListElement.appendChild(cartItem);
    });
  }

  // Update the total amount
  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  totalAmountElement.textContent = `EGP ${totalAmount.toFixed(2)}`;

  // Save cart to local storage
  saveCartToLocalStorage();
}

// Save cart to local storage
function saveCartToLocalStorage(): void {
  try {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to local storage:', error);
  }
}

// Load cart from local storage
function loadCartFromLocalStorage(): void {
  try {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
      cart = JSON.parse(savedCart);
      updateCartUI();
    }
  } catch (error) {
    console.error('Error loading cart from local storage:', error);
  }
}

// Show a notification
function showNotification(message: string): void {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Validate form data
function validateForm(formData: FormData): string | null {
  const name = formData.get('name') as string;
  const city = formData.get('city') as string;
  const street = formData.get('street') as string;

  if (!name || name.trim().length < 2) {
    return 'Please enter a valid name (minimum 2 characters)';
  }

  if (!city || city.trim().length < 2) {
    return 'Please enter a valid city name';
  }

  if (!street || street.trim().length < 5) {
    return 'Please enter a valid street address';
  }

  return null; // Form is valid
}

// Handle form submission
async function handleSubmitOrder(e: Event): Promise<void> {
  e.preventDefault();

  if (cart.length === 0) {
    showNotification('Your cart is empty');
    return;
  }

  const formData = new FormData(deliveryForm);
  
  // Validate form
  const validationError = validateForm(formData);
  if (validationError) {
    showNotification(validationError);
    return;
  }

  const orderData: OrderData = {
    name: formData.get('name') as string,
    city: formData.get('city') as string,
    street: formData.get('street') as string,
    apartment: formData.get('apartment') as string,
    items: cart.map(item => ({
      name: item.name,
      price: item.price,
      size: item.selectedSize,
      quantity: item.quantity,
      total: item.price * item.quantity
    })),
    totalAmount: cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  };

  try {
    // Send the order to Discord
    await sendOrderToDiscord(orderData);

    // Show the order confirmation
    showOrderConfirmation(orderData);

    // Clear the cart
    cart = [];
    localStorage.removeItem('shoppingCart');
    updateCartUI();

    // Reset the form
    deliveryForm.reset();
  } catch (error) {
    console.error('Error processing order:', error);
    showNotification('Error processing your order. Please try again.');
  }
}

// Send the order to Discord
async function sendOrderToDiscord(orderData: OrderData): Promise<void> {
  try {
    const orderItems = orderData.items.map((item: OrderItem) =>
      `${item.name} (${item.size}) - Qty: ${item.quantity} - EGP ${item.total.toFixed(2)}`
    ).join('\n');

    const payload = {
      content: "New Order Received!",
      embeds: [
        {
          title: "Order Details",
          color: 0x00FFFF,
          fields: [
            {
              name: "Customer Information",
              value: `Name: ${orderData.name}\nCity: ${orderData.city}\nStreet: ${orderData.street}\nApartment/House: ${orderData.apartment || 'Not specified'}`,
              inline: false
            },
            {
              name: "Items Ordered",
              value: orderItems,
              inline: false
            },
            {
              name: "Total Amount",
              value: `EGP ${orderData.totalAmount.toFixed(2)}`,
              inline: false
            },
            {
              name: "Payment Method",
              value: "Cash on Delivery",
              inline: false
            },
            {
              name: "Order Time",
              value: new Date().toLocaleString(),
              inline: false
            }
          ],
          timestamp: new Date().toISOString()
        }
      ]
    };

    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Failed to send order to Discord: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error sending order to Discord:', error);
    // We'll still show the confirmation to the user even if Discord fails
  }
}

// Show the order confirmation
function showOrderConfirmation(orderData: OrderData): void {
  if (!modal || !orderDetailsElement) {
    console.error('Modal or order details element not found');
    return;
  }

  const orderItems = orderData.items.map((item: OrderItem) =>
    `<div class="order-item">
      <p class="order-item-name">${item.name} (${item.size})</p>
      <p class="order-item-details">Qty: ${item.quantity} - EGP ${item.total.toFixed(2)}</p>
    </div>`
  ).join('');

  orderDetailsElement.innerHTML = `
    <h4>Thank you for your order!</h4>
    <div class="confirmation-details">
      <h4>Delivery Information:</h4>
      <p><strong>Name:</strong> ${orderData.name}</p>
      <p><strong>City:</strong> ${orderData.city}</p>
      <p><strong>Street:</strong> ${orderData.street}</p>
      <p><strong>Apartment/House:</strong> ${orderData.apartment || 'Not specified'}</p>

      <h4>Order Items:</h4>
      <div class="order-items-list">
        ${orderItems}
      </div>

      <p class="total-amount-confirmation"><strong>Total Amount:</strong> EGP ${orderData.totalAmount.toFixed(2)}</p>
      <p><strong>Payment Method:</strong> Cash on Delivery</p>
      <p><strong>Order Time:</strong> ${new Date().toLocaleString()}</p>
    </div>
  `;

  modal.classList.add('active');
}

// Hide the modal
function hideModal(): void {
  if (!modal) return;
  modal.classList.remove('active');
}

// Load cart from local storage on page load
document.addEventListener('DOMContentLoaded', () => {
  loadCartFromLocalStorage();
});