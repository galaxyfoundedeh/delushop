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
    name: "Classic Black Sweatpants",
    price: 49.99,
    image: "https://i5.walmartimages.com/seo/JWZUY-Woman-Cargo-Sweatpants-with-Pockets-Y2k-Baggy-Wide-Leg-Pants-Streetwear-Aesthetic-3-Black-Small_f05fb3a1-806b-4ef6-ba60-c8ccb5656c52.050b1b2567524db0c742139d2daabdd7.jpeg",
    description: "Comfortable classic black sweatpants with pockets. Perfect for everyday wear.",
    sizes: ["Small", "Medium", "Large", "XXL"]
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

// Discord webhook URL - replace with your actual webhook URL
// For demonstration purposes, leave this as empty string. In production, replace with your Discord webhook URL.
const DISCORD_WEBHOOK_URL = "";

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
  if (!productGrid) return;

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

  const productInfo = document.createElement('div');
  productInfo.className = 'product-info';

  const productTitle = document.createElement('h3');
  productTitle.className = 'product-title';
  productTitle.textContent = product.name;

  const productDescription = document.createElement('p');
  productDescription.textContent = product.description;

  const productPrice = document.createElement('p');
  productPrice.className = 'product-price';
  productPrice.textContent = `$${product.price.toFixed(2)}`;

  const sizeOptions = document.createElement('div');
  sizeOptions.className = 'size-options';

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
  cart.splice(index, 1);
  updateCartUI();
}

// Update the cart UI
function updateCartUI(): void {
  if (!cartCountElement || !cartListElement || !emptyCartMessage || !totalAmountElement || !orderButton) return;

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

      const cartItemDetails = document.createElement('div');
      cartItemDetails.className = 'cart-item-details';

      const cartItemTitle = document.createElement('h4');
      cartItemTitle.className = 'cart-item-title';
      cartItemTitle.textContent = item.name;

      const cartItemPrice = document.createElement('p');
      cartItemPrice.className = 'cart-item-price';
      cartItemPrice.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

      const cartItemSize = document.createElement('p');
      cartItemSize.className = 'cart-item-size';
      cartItemSize.textContent = `Size: ${item.selectedSize} | Quantity: ${item.quantity}`;

      const cartItemRemove = document.createElement('span');
      cartItemRemove.className = 'cart-item-remove';
      cartItemRemove.innerHTML = '<i class="fas fa-trash"></i>';
      cartItemRemove.addEventListener('click', () => {
        removeFromCart(index);
      });

      cartItemDetails.appendChild(cartItemTitle);
      cartItemDetails.appendChild(cartItemPrice);
      cartItemDetails.appendChild(cartItemSize);

      cartItem.appendChild(cartItemImage);
      cartItem.appendChild(cartItemDetails);
      cartItem.appendChild(cartItemRemove);

      cartListElement.appendChild(cartItem);
    });
  }

  // Update the total amount
  const totalAmount = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  totalAmountElement.textContent = `$${totalAmount.toFixed(2)}`;
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

// Handle form submission
async function handleSubmitOrder(e: Event): Promise<void> {
  e.preventDefault();

  if (cart.length === 0) return;

  const formData = new FormData(deliveryForm);
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

  // Send the order to Discord
  await sendOrderToDiscord(orderData);

  // Show the order confirmation
  showOrderConfirmation(orderData);

  // Clear the cart
  cart = [];
  updateCartUI();

  // Reset the form
  deliveryForm.reset();
}

// Send the order to Discord
async function sendOrderToDiscord(orderData: OrderData): Promise<void> {
  try {
    // If no webhook URL is set, just log the order and return
    if (!DISCORD_WEBHOOK_URL || DISCORD_WEBHOOK_URL === "YOUR_DISCORD_WEBHOOK_URL") {
      console.log("Discord webhook URL not set. Order data:", orderData);
      return;
    }

    const orderItems = orderData.items.map((item: OrderItem) =>
      `${item.name} (${item.size}) - Qty: ${item.quantity} - $${item.total.toFixed(2)}`
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
              value: `Name: ${orderData.name}\nCity: ${orderData.city}\nStreet: ${orderData.street}\nApartment/House: ${orderData.apartment}`,
              inline: false
            },
            {
              name: "Items Ordered",
              value: orderItems,
              inline: false
            },
            {
              name: "Total Amount",
              value: `$${orderData.totalAmount.toFixed(2)}`,
              inline: false
            },
            {
              name: "Payment Method",
              value: "Cash on Delivery",
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
      throw new Error('Failed to send order to Discord');
    }
  } catch (error) {
    console.error('Error sending order to Discord:', error);
    // Fallback - you can still show the confirmation even if Discord fails
  }
}

// Show the order confirmation
function showOrderConfirmation(orderData: OrderData): void {
  if (!modal || !orderDetailsElement) return;

  const orderItems = orderData.items.map((item: OrderItem) =>
    `<p>${item.name} (${item.size}) - Qty: ${item.quantity} - $${item.total.toFixed(2)}</p>`
  ).join('');

  let webhookNotice = '';
  if (!DISCORD_WEBHOOK_URL || DISCORD_WEBHOOK_URL === "YOUR_DISCORD_WEBHOOK_URL") {
    webhookNotice = `<div class="webhook-notice">
      <p><strong>Note:</strong> Discord webhook URL is not configured. In a production environment, this order would be sent to your Discord server.</p>
    </div>`;
  }

  orderDetailsElement.innerHTML = `
    <h4>Delivery Information:</h4>
    <p><strong>Name:</strong> ${orderData.name}</p>
    <p><strong>City:</strong> ${orderData.city}</p>
    <p><strong>Street:</strong> ${orderData.street}</p>
    <p><strong>Apartment/House:</strong> ${orderData.apartment}</p>

    <h4>Order Items:</h4>
    ${orderItems}

    <p><strong>Total Amount:</strong> $${orderData.totalAmount.toFixed(2)}</p>
    <p><strong>Payment Method:</strong> Cash on Delivery</p>
    ${webhookNotice}
  `;

  modal.classList.add('active');
}

// Hide the modal
function hideModal(): void {
  if (!modal) return;
  modal.classList.remove('active');
}
