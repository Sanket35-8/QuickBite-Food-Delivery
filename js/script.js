/**
 * ============================================================================
 * QuickBite - Food Delivery Web Application
 * Vanilla JavaScript Functionality (College Project)
 * ============================================================================
 * Features:
 * 1. Global Navigation & Cart Badge Counter
 * 2. Search (Restaurants & Dishes with "No results found" message)
 * 3. Restaurant Filtering & Sorting (Category, Cuisine, Veg/Non-Veg, Rating, Price)
 * 4. Add to Cart (from Home, Menu, and Dish cards with localStorage persistence)
 * 5. Dynamic Shopping Cart (Quantity increment/decrement, Remove item, Real-time bill calculations)
 * 6. Coupon Discount System
 * 7. Login & Registration Form Validation
 * 8. Checkout Validation & Order Confirmation Modal
 * 9. Toast Notification System
 * ============================================================================
 */

// Key used for saving cart data in browser LocalStorage
const CART_STORAGE_KEY = 'quickbite_cart';
const USER_STORAGE_KEY = 'quickbite_user';

// Default initial cart items (to provide a populated cart on initial load)
const DEFAULT_CART_ITEMS = [
  {
    id: 'dish-awadhi-biryani',
    name: 'Awadhi Dum Gosht Biryani',
    restaurant: 'Royal Awadh Biryani',
    price: 380,
    quantity: 1,
    isVeg: false,
    subtitle: 'Portion: Regular • Served with Mint Raita & Salan'
  },
  {
    id: 'dish-shahi-paneer',
    name: 'Shahi Paneer Butter Masala',
    restaurant: 'Punjab Spice Grill',
    price: 260,
    quantity: 1,
    isVeg: true,
    subtitle: 'Extra Butter • Mild Spicy'
  },
  {
    id: 'dish-garlic-naan',
    name: 'Butter Garlic Naan (2 Pcs)',
    restaurant: 'Royal Awadh Biryani',
    price: 100,
    quantity: 1,
    isVeg: true,
    subtitle: 'Clay Oven Roasted with Fresh Garlic'
  }
];

// Active coupon state
let activeCoupon = {
  code: 'QUICK50',
  discountPercent: 50,
  maxDiscount: 100,
  minOrder: 249,
  isApplied: true
};

// Selected Order Fulfillment State ('delivery' | 'pickup' | 'dinein')
// Faculty Demo: Interactive client-side fulfillment state with dynamic fee updates
let selectedFulfillment = 'delivery';

// ============================================================================
// 1. CART DATA MANAGEMENT (LocalStorage)
// ============================================================================

/**
 * Retrieve cart items from LocalStorage.
 * Initializes with default dummy items if visiting the cart for the very first time.
 */
function getCart() {
  const savedCart = localStorage.getItem(CART_STORAGE_KEY);
  if (savedCart !== null) {
    try {
      return JSON.parse(savedCart);
    } catch (e) {
      console.error('Error parsing cart from localStorage:', e);
      return [];
    }
  } else {
    // First time initializing: save default sample items
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(DEFAULT_CART_ITEMS));
    return [...DEFAULT_CART_ITEMS];
  }
}

/**
 * Save updated cart items array to LocalStorage.
 */
function saveCart(cartItems) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  updateCartBadges();
  updateFloatingCartBar();
}

/**
 * Get total quantity count of all items in cart.
 */
function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.quantity || 1), 0);
}

/**
 * Add a dish item to the cart or increment quantity if already present.
 */
function addToCart(item) {
  const cart = getCart();
  const existingItemIndex = cart.findIndex(cartItem => cartItem.name.toLowerCase() === item.name.toLowerCase());

  if (existingItemIndex > -1) {
    // Item already exists in cart, increment quantity
    cart[existingItemIndex].quantity += 1;
    showToast(`Increased quantity of "${item.name}" in cart! 🛒`);
  } else {
    // New item, append to cart
    cart.push({
      id: item.id || 'dish-' + Date.now(),
      name: item.name,
      restaurant: item.restaurant || 'QuickBite Kitchen',
      price: parseFloat(item.price) || 0,
      quantity: 1,
      isVeg: item.isVeg !== undefined ? item.isVeg : true,
      subtitle: item.subtitle || 'Freshly prepared authentic delicacy'
    });
    showToast(`"${item.name}" added to cart! 🍽️`);
  }

  saveCart(cart);

  // If on cart page, re-render cart table
  if (document.querySelector('.cart-items-table')) {
    renderCartPage();
  }
}

/**
 * Update the quantity of a specific cart item.
 */
function updateItemQuantity(itemId, change) {
  let cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === itemId || item.name === itemId);

  if (itemIndex > -1) {
    cart[itemIndex].quantity += change;

    if (cart[itemIndex].quantity <= 0) {
      const removedName = cart[itemIndex].name;
      cart.splice(itemIndex, 1);
      showToast(`Removed "${removedName}" from cart.`, 'info');
    }
  }

  saveCart(cart);

  if (document.querySelector('.cart-items-table')) {
    renderCartPage();
  }
}

/**
 * Remove an item completely from the cart.
 */
function removeFromCart(itemId) {
  let cart = getCart();
  const itemToRemove = cart.find(item => item.id === itemId || item.name === itemId);
  cart = cart.filter(item => item.id !== itemId && item.name !== itemId);
  
  saveCart(cart);
  if (itemToRemove) {
    showToast(`Removed "${itemToRemove.name}" from cart.`, 'info');
  }

  if (document.querySelector('.cart-items-table')) {
    renderCartPage();
  }
}

/**
 * Clear the entire cart (e.g. after checkout).
 */
function clearCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
  updateCartBadges();
  updateFloatingCartBar();
  if (document.querySelector('.cart-items-table')) {
    renderCartPage();
  }
}

/**
 * Update all cart badge counters in the navigation header across all pages.
 */
function updateCartBadges() {
  const count = getCartCount();
  const badgeElements = document.querySelectorAll('#nav-cart-count, .cart-count-badge');
  badgeElements.forEach(badge => {
    badge.textContent = count;
    // Add subtle bump animation if badge is updated
    badge.style.transform = 'scale(1.25)';
    setTimeout(() => {
      badge.style.transform = 'scale(1)';
      badge.style.transition = 'transform 0.2s ease';
    }, 200);
  });
}

/**
 * Update the floating mini-cart bar at the bottom of menu.html.
 */
function updateFloatingCartBar() {
  const floatingBar = document.querySelector('.floating-cart-bar');
  if (!floatingBar) return;

  const cart = getCart();
  const totalCount = getCartCount();
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const countElem = floatingBar.querySelector('.floating-cart-count span');
  const priceElem = floatingBar.querySelector('.floating-cart-price');

  if (totalCount === 0) {
    floatingBar.style.display = 'none';
  } else {
    floatingBar.style.display = 'block';
    if (countElem) {
      countElem.textContent = `🛒 ${totalCount} Item${totalCount > 1 ? 's' : ''} in Cart`;
    }
    if (priceElem) {
      priceElem.textContent = `Total: ₹${totalPrice.toFixed(2)}`;
    }
  }
}

// ============================================================================
// 2. SEARCH FUNCTIONALITY (Home & Restaurants Page)
// ============================================================================

/**
 * Initialize search inputs and quick tags on index.html and restaurants.html.
 */
function initSearch() {
  const heroSearchInput = document.getElementById('hero-search-input');
  const heroExploreBtn = document.getElementById('hero-explore-btn');
  const quickTags = document.querySelectorAll('.quick-tags .tag-pill');
  const categoryCards = document.querySelectorAll('.categories-grid .category-card');

  // 1. Home Page: Search input listener
  if (heroSearchInput) {
    heroSearchInput.addEventListener('input', function (e) {
      const query = e.target.value.trim().toLowerCase();
      filterHomePageCards(query);
    });

    heroSearchInput.addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = heroSearchInput.value.trim();
        if (query) {
          window.location.href = `restaurants.html?search=${encodeURIComponent(query)}`;
        }
      }
    });
  }

  // 2. Home Page: Explore Food button
  if (heroExploreBtn && heroSearchInput) {
    heroExploreBtn.addEventListener('click', function (e) {
      const query = heroSearchInput.value.trim();
      if (query) {
        e.preventDefault();
        window.location.href = `restaurants.html?search=${encodeURIComponent(query)}`;
      }
    });
  }

  // 3. Home Page: Quick search tags
  quickTags.forEach(tag => {
    tag.addEventListener('click', function (e) {
      e.preventDefault();
      const tagName = this.textContent.trim();
      window.location.href = `restaurants.html?search=${encodeURIComponent(tagName)}`;
    });
  });

  // 4. Home Page: Food category cards
  categoryCards.forEach(card => {
    card.addEventListener('click', function (e) {
      e.preventDefault();
      const catName = this.querySelector('.category-name')?.textContent.trim() || '';
      window.location.href = `restaurants.html?category=${encodeURIComponent(catName)}`;
    });
  });

  // 5. Restaurants Page: Check for URL query params (?search= or ?category=)
  handleUrlSearchParams();

  // 6. Restaurants Page: Add search bar if on restaurants.html
  initRestaurantsPageSearch();
}

/**
 * Filter dish cards and restaurant cards on the home page in real time.
 */
function filterHomePageCards(query) {
  const restaurantCards = document.querySelectorAll('.section-alt .restaurants-grid .restaurant-card');
  const dishCards = document.querySelectorAll('.dishes-grid .dish-card');
  const restaurantGrid = document.querySelector('.section-alt .restaurants-grid');
  const dishesGrid = document.querySelector('.dishes-grid');

  let matchingRestaurants = 0;
  let matchingDishes = 0;

  // Filter Restaurant cards on home page
  restaurantCards.forEach(card => {
    const name = card.querySelector('.restaurant-name')?.textContent.toLowerCase() || '';
    const cuisines = card.querySelector('.restaurant-cuisines')?.textContent.toLowerCase() || '';
    
    if (query === '' || name.includes(query) || cuisines.includes(query)) {
      card.style.display = 'block';
      matchingRestaurants++;
    } else {
      card.style.display = 'none';
    }
  });

  // Filter Dish cards on home page
  dishCards.forEach(card => {
    const title = card.querySelector('.dish-title')?.textContent.toLowerCase() || '';
    const restaurant = card.querySelector('.dish-restaurant-name')?.textContent.toLowerCase() || '';
    const desc = card.querySelector('p')?.textContent.toLowerCase() || '';

    if (query === '' || title.includes(query) || restaurant.includes(query) || desc.includes(query)) {
      card.style.display = 'block';
      matchingDishes++;
    } else {
      card.style.display = 'none';
    }
  });

  // Handle "No results found" for home page
  toggleNoResultsMessage(restaurantGrid, matchingRestaurants, query, 'restaurants');
  toggleNoResultsMessage(dishesGrid, matchingDishes, query, 'dishes');
}

/**
 * Add an interactive live search bar to restaurants.html if not already present.
 */
function initRestaurantsPageSearch() {
  const filterPillsRow = document.querySelector('.filter-pills-row');
  const restaurantsContent = document.querySelector('.restaurants-content');
  if (!restaurantsContent || !filterPillsRow) return;

  // Create search bar inside filter section if not existing
  let searchWrap = document.getElementById('restaurants-search-wrap');
  if (!searchWrap) {
    searchWrap = document.createElement('div');
    searchWrap.id = 'restaurants-search-wrap';
    searchWrap.style.cssText = 'margin-bottom: 1.5rem; display: flex; gap: 0.75rem; align-items: center;';
    searchWrap.innerHTML = `
      <div class="search-input-wrap" style="flex: 1; background: var(--white); border: 1.5px solid var(--gray-300); border-radius: var(--radius-md); padding: 0.6rem 1rem; display: flex; align-items: center; gap: 0.75rem; box-shadow: var(--shadow-xs);">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--gray-400); flex-shrink: 0;">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" id="restaurants-search-input" placeholder="Search restaurants or cuisines (e.g., Biryani, Dosa, Momos, Pizza)..." style="width: 100%; border: none; outline: none; font-size: 0.95rem; background: transparent; color: var(--dark-900);">
        <button id="restaurants-search-clear" style="border: none; background: transparent; color: var(--gray-400); cursor: pointer; font-size: 1.1rem; display: none;" title="Clear search">&times;</button>
      </div>
    `;
    filterPillsRow.parentNode.insertBefore(searchWrap, filterPillsRow.nextSibling);
  }

  const searchInput = document.getElementById('restaurants-search-input');
  const clearBtn = document.getElementById('restaurants-search-clear');

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const val = this.value.trim();
      if (clearBtn) clearBtn.style.display = val ? 'block' : 'none';
      applyRestaurantFilters();
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        searchInput.value = '';
        this.style.display = 'none';
        applyRestaurantFilters();
      });
    }
  }
}

/**
 * Handle URL query parameters on restaurants.html.
 */
function handleUrlSearchParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');
  const categoryQuery = urlParams.get('category');

  if (searchQuery) {
    setTimeout(() => {
      const searchInput = document.getElementById('restaurants-search-input') || document.getElementById('hero-search-input');
      if (searchInput) {
        searchInput.value = searchQuery;
        const clearBtn = document.getElementById('restaurants-search-clear');
        if (clearBtn) clearBtn.style.display = 'block';
      }
      applyRestaurantFilters();
      showToast(`Showing results for "${searchQuery}" 🔍`, 'info');
    }, 100);
  } else if (categoryQuery) {
    setTimeout(() => {
      const searchInput = document.getElementById('restaurants-search-input');
      if (searchInput) {
        searchInput.value = categoryQuery;
      }
      applyRestaurantFilters();
      showToast(`Filtering by category: "${categoryQuery}" 🍲`, 'info');
    }, 100);
  }
}

/**
 * Show/Hide a friendly "No results found" container with reset button.
 */
function toggleNoResultsMessage(container, matchCount, query, typeName) {
  if (!container) return;

  let msgBox = container.querySelector('.no-results-box');

  if (matchCount === 0 && query !== '') {
    if (!msgBox) {
      msgBox = document.createElement('div');
      msgBox.className = 'no-results-box';
      msgBox.style.cssText = `
        grid-column: 1 / -1;
        background: var(--white);
        border: 2px dashed var(--gray-300);
        border-radius: var(--radius-lg);
        padding: 3rem 2rem;
        text-align: center;
        margin: 1.5rem 0;
        box-shadow: var(--shadow-sm);
      `;
      container.appendChild(msgBox);
    }
    msgBox.innerHTML = `
      <div style="font-size: 3rem; margin-bottom: 0.75rem;">🔍</div>
      <h3 style="font-size: 1.3rem; color: var(--dark-900); margin-bottom: 0.5rem;">No ${typeName} found</h3>
      <p style="color: var(--gray-500); font-size: 0.95rem; margin-bottom: 1.25rem;">
        We couldn't find any matches for "<strong>${escapeHtml(query)}</strong>". Try checking for typos or explore other categories.
      </p>
      <button class="btn btn-primary btn-sm reset-search-action-btn">
        View All ${typeName.charAt(0).toUpperCase() + typeName.slice(1)}
      </button>
    `;
    msgBox.style.display = 'block';

    const resetBtn = msgBox.querySelector('.reset-search-action-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const heroInput = document.getElementById('hero-search-input');
        const restInput = document.getElementById('restaurants-search-input');
        if (heroInput) heroInput.value = '';
        if (restInput) restInput.value = '';
        filterHomePageCards('');
        applyRestaurantFilters();
      });
    }
  } else if (msgBox) {
    msgBox.style.display = 'none';
  }
}

// ============================================================================
// 3. RESTAURANT FILTERS & SORTING (restaurants.html)
// ============================================================================

/**
 * Initialize all filter pills, sidebar checkboxes, sort options, and reset buttons.
 */
function initRestaurantFilters() {
  const filterPills = document.querySelectorAll('.filter-pill-btn');
  const clearFilterBtn = document.querySelector('.clear-filter-btn');
  const sidebarInputs = document.querySelectorAll('.filter-sidebar input');

  // Quick Filter Pills Click Event
  filterPills.forEach(pill => {
    pill.addEventListener('click', function () {
      const text = this.textContent.trim().toLowerCase();

      // If clicking "All", deselect others
      if (text.includes('all')) {
        filterPills.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
      } else {
        // Toggle this pill
        document.querySelector('.filter-pill-btn:first-child')?.classList.remove('active');
        this.classList.toggle('active');

        // If no pills active, reactivate "All"
        const anyActive = Array.from(filterPills).some(p => p.classList.contains('active'));
        if (!anyActive) {
          document.querySelector('.filter-pill-btn:first-child')?.classList.add('active');
        }
      }

      applyRestaurantFilters();
    });
  });

  // Sidebar Checkboxes & Radios
  sidebarInputs.forEach(input => {
    input.addEventListener('change', () => {
      applyRestaurantFilters();
    });
  });

  // Reset All Button
  if (clearFilterBtn) {
    clearFilterBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetAllRestaurantFilters();
    });
  }
}

/**
 * Apply active filters (Pills + Sidebar + Search) to the restaurant cards list.
 */
function applyRestaurantFilters() {
  const restaurantCards = document.querySelectorAll('.restaurants-content .restaurant-card');
  const gridContainer = document.querySelector('.restaurants-content .restaurants-grid');
  if (!restaurantCards.length || !gridContainer) return;

  // 1. Get search query
  const searchInput = document.getElementById('restaurants-search-input');
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

  // 2. Get active quick pills
  const activePills = Array.from(document.querySelectorAll('.filter-pill-btn.active')).map(p => p.textContent.trim().toLowerCase());
  const isAllPill = activePills.some(p => p.includes('all'));
  const isVegPill = activePills.some(p => p.includes('veg'));
  const isRatingPill = activePills.some(p => p.includes('rating 4.0+'));
  const isFastDeliveryPill = activePills.some(p => p.includes('fast delivery'));
  const isGreatOffersPill = activePills.some(p => p.includes('offers'));
  const isBudgetPill = activePills.some(p => p.includes('less than ₹300'));

  // 3. Get Sidebar Dietary filters
  const vegCheckbox = document.querySelector('.filter-sidebar input[type="checkbox"]:nth-of-type(1)');
  const checkedCuisines = Array.from(document.querySelectorAll('.filter-group:nth-of-type(3) input[type="checkbox"]:checked'))
    .map(cb => cb.parentElement.textContent.toLowerCase());

  let visibleCount = 0;

  restaurantCards.forEach(card => {
    const name = card.querySelector('.restaurant-name')?.textContent.toLowerCase() || '';
    const cuisines = card.querySelector('.restaurant-cuisines')?.textContent.toLowerCase() || '';
    const ratingText = card.querySelector('.badge-rating')?.textContent.replace(/[^0-9.]/g, '') || '0';
    const rating = parseFloat(ratingText) || 0;
    
    // Parse delivery time
    const metaRow = card.querySelector('.restaurant-meta-row')?.textContent.toLowerCase() || '';
    const isFastDelivery = metaRow.includes('15-20') || metaRow.includes('18-22') || metaRow.includes('20-25') || metaRow.includes('25-30') || metaRow.includes('30 mins');
    
    // Parse Veg / Non-Veg
    const isPureVeg = metaRow.includes('pure veg') || card.querySelector('.food-type-icon.veg') !== null;

    // Parse Cost for two
    let cost = 400;
    const costMatch = metaRow.match(/₹(\d+)/);
    if (costMatch) {
      cost = parseInt(costMatch[1], 10);
    }

    // Has Offers / Promos
    const hasOffer = card.querySelector('.restaurant-promos .badge') !== null;

    // Check Match Conditions:
    let matches = true;

    // Search query match
    if (query && !name.includes(query) && !cuisines.includes(query)) {
      matches = false;
    }

    // Pill matches
    if (!isAllPill && activePills.length > 0) {
      if (isVegPill && !isPureVeg) matches = false;
      if (isRatingPill && rating < 4.0) matches = false;
      if (isFastDeliveryPill && !isFastDelivery) matches = false;
      if (isGreatOffersPill && !hasOffer) matches = false;
      if (isBudgetPill && cost > 300) matches = false;
    }

    // Sidebar Cuisine matches (if any selected)
    if (checkedCuisines.length > 0) {
      const matchesCuisine = checkedCuisines.some(c => {
        if (c.includes('biryani') && cuisines.includes('biryani')) return true;
        if (c.includes('north indian') && (cuisines.includes('butter chicken') || cuisines.includes('dal makhani') || cuisines.includes('naan') || cuisines.includes('tandoor'))) return true;
        if (c.includes('south indian') && (cuisines.includes('dosa') || cuisines.includes('idli') || cuisines.includes('coffee') || cuisines.includes('vada'))) return true;
        if (c.includes('street food') && (cuisines.includes('chaat') || cuisines.includes('chole') || cuisines.includes('gol gappe'))) return true;
        if (c.includes('chinese') && (cuisines.includes('momos') || cuisines.includes('roll') || cuisines.includes('asian'))) return true;
        if (c.includes('coastal') && (cuisines.includes('seafood') || cuisines.includes('fish') || cuisines.includes('curry'))) return true;
        if (c.includes('mithai') && (cuisines.includes('mithai') || cuisines.includes('dessert') || cuisines.includes('rasgulla') || cuisines.includes('katli'))) return true;
        return cuisines.includes(c);
      });
      if (!matchesCuisine) matches = false;
    }

    if (matches) {
      card.style.display = 'block';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Apply Sorting
  applyRestaurantSorting();

  // Update Section Subtitle with dynamic count
  const subtitle = document.querySelector('.section-subtitle');
  if (subtitle) {
    subtitle.textContent = `Showing ${visibleCount} delicious kitchen${visibleCount !== 1 ? 's' : ''} delivering fresh meals to your location.`;
  }

  // Show / Hide No Results
  toggleNoResultsMessage(gridContainer, visibleCount, query || 'selected filters', 'restaurants');
}

/**
 * Sort restaurant cards based on the selected Radio button in the sidebar.
 */
function applyRestaurantSorting() {
  const sortRadios = document.querySelectorAll('.filter-group:nth-of-type(1) input[type="radio"]');
  const gridContainer = document.querySelector('.restaurants-content .restaurants-grid');
  if (!gridContainer) return;

  let selectedSort = 'Relevance';
  sortRadios.forEach(radio => {
    if (radio.checked) {
      selectedSort = radio.parentElement.textContent.trim();
    }
  });

  const cardsArray = Array.from(gridContainer.querySelectorAll('.restaurant-card'));

  cardsArray.sort((a, b) => {
    const ratingA = parseFloat(a.querySelector('.badge-rating')?.textContent.replace(/[^0-9.]/g, '') || '0');
    const ratingB = parseFloat(b.querySelector('.badge-rating')?.textContent.replace(/[^0-9.]/g, '') || '0');

    const costA = parseInt(a.querySelector('.restaurant-meta-row')?.textContent.match(/₹(\d+)/)?.[1] || '400', 10);
    const costB = parseInt(b.querySelector('.restaurant-meta-row')?.textContent.match(/₹(\d+)/)?.[1] || '400', 10);

    if (selectedSort.includes('Rating: High to Low')) {
      return ratingB - ratingA;
    } else if (selectedSort.includes('Cost: Low to High')) {
      return costA - costB;
    } else if (selectedSort.includes('Cost: High to Low')) {
      return costB - costA;
    }
    return 0; // Default relevance
  });

  cardsArray.forEach(card => gridContainer.appendChild(card));
}

/**
 * Reset all filters on restaurants.html back to defaults.
 */
function resetAllRestaurantFilters() {
  // Reset search input
  const searchInput = document.getElementById('restaurants-search-input');
  if (searchInput) {
    searchInput.value = '';
    const clearBtn = document.getElementById('restaurants-search-clear');
    if (clearBtn) clearBtn.style.display = 'none';
  }

  // Reset pills to "All"
  const filterPills = document.querySelectorAll('.filter-pill-btn');
  filterPills.forEach((pill, idx) => {
    if (idx === 0) pill.classList.add('active');
    else pill.classList.remove('active');
  });

  // Reset sidebar checkboxes
  const checkboxes = document.querySelectorAll('.filter-sidebar input[type="checkbox"]');
  checkboxes.forEach(cb => {
    cb.checked = false;
  });

  // Reset sort radio to Relevance
  const firstSortRadio = document.querySelector('.filter-sidebar input[type="radio"]');
  if (firstSortRadio) firstSortRadio.checked = true;

  applyRestaurantFilters();
  showToast('Filters have been reset. 🔄', 'info');
}

// ============================================================================
// 4. ADD TO CART EVENT LISTENERS (Home & Menu Page)
// ============================================================================

/**
 * Attach click listeners to all "Add to Cart +" and "ADD +" buttons.
 */
function initAddToCartButtons() {
  // 1. Home Page Dish Cards
  const homeDishAddBtns = document.querySelectorAll('.dishes-grid .dish-card .dish-footer-row a, .dishes-grid .dish-card .dish-footer-row button');
  homeDishAddBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const card = this.closest('.dish-card');
      if (!card) return;

      const name = card.querySelector('.dish-title')?.textContent.trim() || 'Delicious Dish';
      const restaurant = card.querySelector('.dish-restaurant-name')?.textContent.replace('By ', '').trim() || 'QuickBite Kitchen';
      const priceText = card.querySelector('.dish-price')?.textContent.replace(/[^0-9.]/g, '') || '250';
      const price = parseFloat(priceText);
      const isVeg = card.querySelector('.food-type-icon.veg') !== null;
      const subtitle = card.querySelector('p')?.textContent.trim() || '';

      addToCart({
        name,
        restaurant,
        price,
        isVeg,
        subtitle
      });
    });
  });

  // 2. Restaurant Menu Page Cards
  const menuItemAddBtns = document.querySelectorAll('.menu-item-card .menu-item-add-btn');
  menuItemAddBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const card = this.closest('.menu-item-card');
      if (!card) return;

      const name = card.querySelector('.menu-item-name')?.textContent.trim() || 'Delicious Dish';
      const priceText = card.querySelector('.menu-item-price')?.textContent.replace(/[^0-9.]/g, '') || '200';
      const price = parseFloat(priceText);
      const isVeg = card.querySelector('.food-type-icon.veg') !== null;
      const subtitle = card.querySelector('.menu-item-desc')?.textContent.trim() || '';
      const restaurant = document.querySelector('.rest-title-area h1')?.textContent.trim() || 'Royal Awadh Biryani';

      addToCart({
        name,
        restaurant,
        price,
        isVeg,
        subtitle
      });
    });
  });
}

// ============================================================================
// 5. SHOPPING CART RENDERING & BILL CALCULATIONS (cart.html)
// ============================================================================

/**
 * Render the cart page items, calculation breakdown, delivery options, and coupons.
 */
function renderCartPage() {
  const cartTable = document.querySelector('.cart-items-table');
  const pageHeading = document.querySelector('.section-title-wrap .section-heading');
  const cartCountSummary = document.querySelector('.cart-card-header span');

  if (!cartTable) return;

  const cart = getCart();
  const totalCount = getCartCount();

  // Update Page Title
  if (pageHeading) {
    pageHeading.textContent = `Your Food Cart (${totalCount} Item${totalCount !== 1 ? 's' : ''})`;
  }
  if (cartCountSummary) {
    cartCountSummary.textContent = `${totalCount} dish${totalCount !== 1 ? 'es' : ''} selected`;
  }

  // Handle Empty Cart State
  if (cart.length === 0) {
    cartTable.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem;">
        <div style="font-size: 3.5rem; margin-bottom: 1rem;">🛒</div>
        <h3 style="font-size: 1.4rem; color: var(--dark-900); margin-bottom: 0.5rem;">Your Cart is Empty</h3>
        <p style="color: var(--gray-500); margin-bottom: 1.5rem; font-size: 0.95rem;">
          Looks like you haven't added any mouth-watering dishes yet.
        </p>
        <a href="restaurants.html" class="btn btn-primary">
          Explore Restaurants
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      </div>
    `;
    updateBillCalculations(0);
    return;
  }

  // Render Items Rows
  cartTable.innerHTML = '';
  let itemTotal = 0;

  cart.forEach(item => {
    const itemSubtotal = item.price * item.quantity;
    itemTotal += itemSubtotal;

    const row = document.createElement('div');
    row.className = 'cart-item-row';
    row.innerHTML = `
      <span class="food-type-icon ${item.isVeg ? 'veg' : 'non-veg'}"></span>
      <div style="flex: 1;">
        <h4 class="cart-item-title">${escapeHtml(item.name)}</h4>
        <div class="cart-item-subtitle">${escapeHtml(item.subtitle || '')}</div>
        <div style="font-size: 0.8rem; color: var(--primary); margin-top: 0.2rem; font-weight: 600;">₹${item.price.toFixed(2)} each</div>
      </div>
      <div class="cart-qty-counter">
        <button class="qty-btn btn-qty-decrease" data-id="${item.id}" aria-label="Decrease quantity">-</button>
        <span class="qty-display">${item.quantity}</span>
        <button class="qty-btn btn-qty-increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
      </div>
      <div class="cart-item-price">₹${itemSubtotal.toFixed(2)}</div>
    `;
    cartTable.appendChild(row);
  });

  // Attach Quantity Click Handlers
  cartTable.querySelectorAll('.btn-qty-decrease').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.getAttribute('data-id');
      updateItemQuantity(id, -1);
    });
  });

  cartTable.querySelectorAll('.btn-qty-increase').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.getAttribute('data-id');
      updateItemQuantity(id, 1);
    });
  });

  // Initialize Fulfillment Option Selection (Delivery, Self Pickup, Dine-in)
  initFulfillmentSelection();

  // Calculate & Update Bill Summary
  updateBillCalculations(itemTotal);

  // Address Selection
  initAddressSelection();

  // Tip Selection
  initTipSelection();

  // Coupon Form
  initCouponHandler();

  // Checkout Button
  initCheckoutHandler();
}

/**
 * Handle Order Fulfillment Options (Delivery / Self Pickup / Dine-in) selection on cart.html.
 * Updates visible panels and triggers immediate bill recalculation.
 */
function initFulfillmentSelection() {
  const fulfillmentCards = document.querySelectorAll('.fulfillment-card');
  const addressSection = document.getElementById('delivery-address-section');
  const pickupSection = document.getElementById('pickup-details-section');
  const dineinSection = document.getElementById('dinein-details-section');
  const tipSection = document.getElementById('rider-tip-section');
  const badgeElem = document.getElementById('active-fulfillment-badge');

  if (!fulfillmentCards || fulfillmentCards.length === 0) return;

  function setFulfillment(option) {
    selectedFulfillment = option;

    // 1. Update active styling on selectable cards
    fulfillmentCards.forEach(card => {
      const cardOption = card.getAttribute('data-fulfillment');
      if (cardOption === option) {
        card.classList.add('selected');
        card.setAttribute('aria-selected', 'true');
      } else {
        card.classList.remove('selected');
        card.setAttribute('aria-selected', 'false');
      }
    });

    // 2. Update badge label in the card header
    if (badgeElem) {
      if (option === 'delivery') {
        badgeElem.textContent = 'Delivery Selected';
      } else if (option === 'pickup') {
        badgeElem.textContent = 'Self Pickup Selected';
      } else if (option === 'dinein') {
        badgeElem.textContent = 'Dine-in Selected';
      }
    }

    // 3. Dynamic display of conditional sections:
    // (1) Delivery: Show delivery address + tip card
    // (2) Self Pickup: Show takeaway counter instructions (hide address & tip)
    // (3) Dine-in: Show restaurant table details (hide address & tip)
    if (addressSection) {
      addressSection.style.display = (option === 'delivery') ? 'block' : 'none';
    }
    if (pickupSection) {
      pickupSection.style.display = (option === 'pickup') ? 'block' : 'none';
    }
    if (dineinSection) {
      dineinSection.style.display = (option === 'dinein') ? 'block' : 'none';
    }
    if (tipSection) {
      tipSection.style.display = (option === 'delivery') ? 'block' : 'none';
    }

    // 4. Immediately update the bill calculations and grand total
    const cart = getCart();
    const currentItemTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    updateBillCalculations(currentItemTotal);
  }

  // Bind click & keyboard handlers to each fulfillment card
  fulfillmentCards.forEach(card => {
    card.onclick = function () {
      const option = this.getAttribute('data-fulfillment');
      setFulfillment(option);
    };
    card.onkeydown = function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const option = this.getAttribute('data-fulfillment');
        setFulfillment(option);
      }
    };
  });

  // Ensure current UI matches initial selected state
  setFulfillment(selectedFulfillment);
}

/**
 * Recalculate bill numbers and update right column in cart.html.
 * Applies fulfillment option delivery fee:
 * (1) Delivery by QuickBite -> ₹40 delivery fee
 * (2) Self Pickup / Takeaway -> ₹0 delivery fee
 * (3) Dine-in -> ₹0 delivery fee
 */
function updateBillCalculations(itemTotal) {
  const billRowsList = document.querySelector('.bill-rows-list');
  const billTotalRow = document.querySelector('.bill-row-total span:last-child');
  const placeOrderBtn = document.getElementById('cart-place-order-btn');

  if (!billRowsList) return;

  if (itemTotal === 0) {
    billRowsList.innerHTML = `
      <div class="bill-row"><span>Item Total</span><span>₹0.00</span></div>
      <div class="bill-row"><span>Delivery Fee</span><span>₹0.00</span></div>
      <div class="bill-row"><span>Taxes & GST</span><span>₹0.00</span></div>
    `;
    if (billTotalRow) billTotalRow.textContent = '₹0.00';
    if (placeOrderBtn) {
      placeOrderBtn.textContent = 'Cart is Empty';
      placeOrderBtn.style.opacity = '0.6';
      placeOrderBtn.style.pointerEvents = 'none';
    }
    return;
  }

  // Delivery partner fee based on selected fulfillment option:
  // - Delivery by QuickBite: ₹40.00
  // - Self Pickup / Takeaway: ₹0.00 (FREE)
  // - Dine-in: ₹0.00 (FREE)
  let deliveryFee = 0;
  let deliveryFeeLabel = 'Delivery Partner Fee';
  let deliveryFeeHtml = '';

  if (selectedFulfillment === 'delivery') {
    deliveryFee = 40.00;
    deliveryFeeLabel = 'Delivery Partner Fee (QuickBite)';
    deliveryFeeHtml = '<span>₹40.00</span>';
  } else if (selectedFulfillment === 'pickup') {
    deliveryFee = 0.00;
    deliveryFeeLabel = 'Delivery Partner Fee (Self Pickup)';
    deliveryFeeHtml = '<div><span style="text-decoration: line-through; color: var(--gray-400); margin-right: 0.3rem;">₹40.00</span><span style="color: var(--veg-color); font-weight: bold;">₹0.00 FREE</span></div>';
  } else if (selectedFulfillment === 'dinein') {
    deliveryFee = 0.00;
    deliveryFeeLabel = 'Delivery Partner Fee (Dine-in)';
    deliveryFeeHtml = '<div><span style="text-decoration: line-through; color: var(--gray-400); margin-right: 0.3rem;">₹40.00</span><span style="color: var(--veg-color); font-weight: bold;">₹0.00 FREE</span></div>';
  }

  // Restaurant Packaging
  const packagingFee = 25.00;

  // Taxes & GST: 5% of item total
  const taxes = +(itemTotal * 0.05).toFixed(2);

  // Platform Fee
  const platformFee = 5.00;

  // Coupon discount calculation
  let discountAmount = 0;
  if (activeCoupon.isApplied && itemTotal >= activeCoupon.minOrder) {
    discountAmount = Math.min((itemTotal * (activeCoupon.discountPercent / 100)), activeCoupon.maxDiscount);
  }

  // Selected Tip: only applies to Delivery by QuickBite
  let tipAmount = 0;
  if (selectedFulfillment === 'delivery') {
    const activeTipElem = document.querySelector('.delivery-chips-row .delivery-chip.active-tip');
    if (activeTipElem) {
      const tipMatch = activeTipElem.textContent.match(/₹(\d+)/);
      if (tipMatch) tipAmount = parseInt(tipMatch[1], 10);
    }
  }

  // Grand Total Calculation
  const grandTotal = Math.max(0, itemTotal + deliveryFee + packagingFee + taxes + platformFee + tipAmount - discountAmount);

  // Render Bill Table Rows
  billRowsList.innerHTML = `
    <div class="bill-row">
      <span>Item Total</span>
      <span>₹${itemTotal.toFixed(2)}</span>
    </div>
    <div class="bill-row">
      <span>${deliveryFeeLabel}</span>
      ${deliveryFeeHtml}
    </div>
    <div class="bill-row">
      <span>Restaurant Packaging Charges</span>
      <span>₹${packagingFee.toFixed(2)}</span>
    </div>
    <div class="bill-row">
      <span>Taxes & GST (5%)</span>
      <span>₹${taxes.toFixed(2)}</span>
    </div>
    ${discountAmount > 0 ? `
      <div class="bill-row discount-row">
        <span>Coupon Discount (${activeCoupon.code})</span>
        <span>- ₹${discountAmount.toFixed(2)}</span>
      </div>
    ` : ''}
    ${tipAmount > 0 ? `
      <div class="bill-row" style="color: var(--primary); font-weight: 600;">
        <span>Delivery Partner Tip</span>
        <span>+ ₹${tipAmount.toFixed(2)}</span>
      </div>
    ` : ''}
    <div class="bill-row">
      <span>Platform Fee</span>
      <span>₹${platformFee.toFixed(2)}</span>
    </div>
  `;

  // Update Grand Total and Pay Button Text
  if (billTotalRow) {
    billTotalRow.textContent = `₹${grandTotal.toFixed(2)}`;
  }
  if (placeOrderBtn) {
    placeOrderBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
      Proceed to Pay ₹${grandTotal.toFixed(2)}
    `;
    placeOrderBtn.style.opacity = '1';
    placeOrderBtn.style.pointerEvents = 'auto';
  }
}

/**
 * Handle delivery address card selection on cart.html.
 */
function initAddressSelection() {
  const addressCards = document.querySelectorAll('.address-option-card');
  addressCards.forEach(card => {
    card.addEventListener('click', function () {
      addressCards.forEach(c => {
        c.classList.remove('selected');
        const badge = c.querySelector('.badge');
        if (badge) badge.remove();
      });

      this.classList.add('selected');
      const typeSpan = this.querySelector('.address-type');
      if (typeSpan && !typeSpan.querySelector('.badge')) {
        const badge = document.createElement('span');
        badge.className = 'badge badge-secondary';
        badge.style.cssText = 'margin-left: auto; font-size: 0.7rem;';
        badge.textContent = 'Selected';
        typeSpan.appendChild(badge);
      }
    });
  });
}

/**
 * Handle Rider Tip chip selections.
 */
function initTipSelection() {
  const tipChips = document.querySelectorAll('.cart-left-col .delivery-chips-row .delivery-chip');
  tipChips.forEach(chip => {
    chip.addEventListener('click', function () {
      if (this.classList.contains('active-tip')) {
        this.classList.remove('active-tip');
        this.style.borderColor = 'var(--gray-200)';
        this.style.background = 'var(--gray-100)';
        this.style.color = 'var(--gray-700)';
      } else {
        tipChips.forEach(c => {
          c.classList.remove('active-tip');
          c.style.borderColor = 'var(--gray-200)';
          c.style.background = 'var(--gray-100)';
          c.style.color = 'var(--gray-700)';
        });
        this.classList.add('active-tip');
        this.style.borderColor = 'var(--primary)';
        this.style.background = 'var(--primary-light)';
        this.style.color = 'var(--primary)';
      }

      const cart = getCart();
      const itemTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      updateBillCalculations(itemTotal);
    });
  });
}

/**
 * Handle coupon application on cart.html.
 */
function initCouponHandler() {
  const couponInputWrap = document.querySelector('.coupon-input-wrap');
  if (!couponInputWrap) return;

  const couponInput = couponInputWrap.querySelector('.coupon-input');
  const applyBtn = couponInputWrap.querySelector('button');
  const alertBox = document.querySelector('.coupon-applied-alert');

  if (applyBtn && couponInput) {
    applyBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const code = couponInput.value.trim().toUpperCase();

      if (!code) {
        showToast('Please enter a valid coupon code.', 'error');
        return;
      }

      if (code === 'QUICK50') {
        activeCoupon = { code: 'QUICK50', discountPercent: 50, maxDiscount: 100, minOrder: 249, isApplied: true };
        if (alertBox) {
          alertBox.style.display = 'flex';
          alertBox.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Coupon <strong>'QUICK50'</strong> applied! You saved up to ₹100.00</span>`;
        }
        showToast('Coupon "QUICK50" applied successfully! 🎉');
      } else if (code === 'ROYAL50') {
        activeCoupon = { code: 'ROYAL50', discountPercent: 50, maxDiscount: 120, minOrder: 199, isApplied: true };
        if (alertBox) {
          alertBox.style.display = 'flex';
          alertBox.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Coupon <strong>'ROYAL50'</strong> applied! Flat 50% discount unlocked.</span>`;
        }
        showToast('Coupon "ROYAL50" applied successfully! 🎉');
      } else if (code === 'FLAT75') {
        activeCoupon = { code: 'FLAT75', discountPercent: 100, maxDiscount: 75, minOrder: 150, isApplied: true };
        if (alertBox) {
          alertBox.style.display = 'flex';
          alertBox.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Coupon <strong>'FLAT75'</strong> applied! Flat ₹75 discount unlocked.</span>`;
        }
        showToast('Coupon "FLAT75" applied successfully! 🎉');
      } else {
        showToast(`Coupon code "${code}" is invalid or expired. Try "QUICK50".`, 'error');
        return;
      }

      const cart = getCart();
      const itemTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      updateBillCalculations(itemTotal);
    });
  }
}

// ============================================================================
// 6. CHECKOUT & ORDER CONFIRMATION MODAL (cart.html)
// ============================================================================

/**
 * Handle "Proceed to Pay" button click with validation and confirmation modal.
 * Transmits the chosen order fulfillment option and calculates final summary.
 */
function initCheckoutHandler() {
  const placeOrderBtn = document.getElementById('cart-place-order-btn');
  if (!placeOrderBtn) return;

  placeOrderBtn.addEventListener('click', function (e) {
    e.preventDefault();

    const cart = getCart();
    if (!cart || cart.length === 0) {
      showToast('Your cart is empty. Add food items before checkout.', 'error');
      return;
    }

    // Get selected payment method
    const selectedPayment = document.querySelector('input[name="payment_method"]:checked')?.parentElement.textContent.trim() || 'Instant UPI';

    // Generate random order ID
    const orderId = 'QB-' + Math.floor(100000 + Math.random() * 900000);
    const grandTotal = document.querySelector('.bill-row-total span:last-child')?.textContent || '₹0.00';

    // Format fulfillment details based on chosen option
    let fulfillmentTitle = 'Delivery by QuickBite';
    let fulfillmentLocation = '';
    let fulfillmentEstimate = '⚡ 25-30 Minutes (Doorstep Delivery)';
    let deliveryFeeCharged = '₹40.00';

    if (selectedFulfillment === 'delivery') {
      fulfillmentTitle = 'Delivery by QuickBite';
      const selectedAddrCard = document.querySelector('.address-option-card.selected');
      const addrType = selectedAddrCard?.querySelector('.address-type span')?.textContent || 'Home (Primary)';
      const addrText = selectedAddrCard?.querySelector('.address-text')?.textContent.trim() || 'Flat 402, Royal Residency, Connaught Place, New Delhi';
      fulfillmentLocation = `${addrType}: ${addrText}`;
      fulfillmentEstimate = '⚡ 25-30 Minutes (Doorstep Delivery)';
      deliveryFeeCharged = '₹40.00';
    } else if (selectedFulfillment === 'pickup') {
      fulfillmentTitle = 'Self Pickup / Takeaway';
      fulfillmentLocation = 'Royal Awadh Biryani, Shop 14-15, Inner Circle, Connaught Place, New Delhi';
      fulfillmentEstimate = '⚡ Ready in 15-20 Minutes (Counter Pickup)';
      deliveryFeeCharged = '₹0.00 (FREE)';
    } else if (selectedFulfillment === 'dinein') {
      fulfillmentTitle = 'Dine-in (Restaurant Table Service)';
      fulfillmentLocation = 'Royal Awadh Biryani, Connaught Place, New Delhi (Table Allocated on Arrival)';
      fulfillmentEstimate = '🍽️ Dine-in Service (Fresh from Kitchen)';
      deliveryFeeCharged = '₹0.00 (FREE)';
    }

    showOrderSuccessModal({
      orderId,
      grandTotal,
      fulfillmentTitle,
      fulfillmentLocation,
      fulfillmentEstimate,
      deliveryFeeCharged,
      selectedPayment,
      itemCount: getCartCount()
    });

    // Clear cart upon successful order
    clearCart();
  });
}

/**
 * Render and display a modal with order confirmation details.
 * Reflects fulfillment option, fee breakdown, and explicit Faculty Viva Demo confirmation.
 */
function showOrderSuccessModal(details) {
  // Remove existing modal if any
  const existingModal = document.getElementById('order-success-modal');
  if (existingModal) existingModal.remove();

  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'order-success-modal';
  modalOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(15, 23, 42, 0.75);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    padding: 1.5rem;
    animation: fadeIn 0.3s ease;
  `;

  modalOverlay.innerHTML = `
    <div style="background: var(--white); border-radius: var(--radius-xl); max-width: 540px; width: 100%; padding: 2.5rem; text-align: center; box-shadow: var(--shadow-xl); border: 1px solid var(--gray-200); position: relative; animation: slideUp 0.35s ease;">
      <div style="width: 72px; height: 72px; background: var(--veg-bg); color: var(--veg-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; font-size: 2.2rem; box-shadow: 0 8px 20px rgba(22, 163, 74, 0.2);">
        ✓
      </div>
      <h2 style="font-size: 1.8rem; color: var(--dark-900); margin-bottom: 0.5rem; font-family: var(--font-heading);">Order Placed Successfully!</h2>
      <p style="color: var(--gray-600); font-size: 0.95rem; margin-bottom: 1.5rem;">
        Thank you for ordering with QuickBite. Your order has been scheduled with the restaurant.
      </p>

      <div style="background: var(--gray-50); border: 1px solid var(--gray-200); border-radius: var(--radius-md); padding: 1.25rem; text-align: left; margin-bottom: 1.25rem; font-size: 0.9rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: var(--gray-500);">Order ID:</span>
          <strong style="color: var(--dark-900); font-family: var(--font-heading);">${details.orderId}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: var(--gray-500);">Fulfillment Type:</span>
          <strong style="color: var(--primary);">${escapeHtml(details.fulfillmentTitle)}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: var(--gray-500);">Delivery Fee:</span>
          <span style="font-weight: 700; color: ${details.deliveryFeeCharged.includes('FREE') ? 'var(--veg-color)' : 'var(--dark-900)'};">${details.deliveryFeeCharged}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: var(--gray-500);">Items:</span>
          <span>${details.itemCount} item(s)</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: var(--gray-500);">Amount Paid:</span>
          <strong style="color: var(--primary); font-size: 1.15rem;">${details.grandTotal}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: var(--gray-500);">Payment Method:</span>
          <span>${details.selectedPayment}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
          <span style="color: var(--gray-500);">Location:</span>
          <span style="text-align: right; max-width: 60%; font-size: 0.85rem; font-weight: 500;">${escapeHtml(details.fulfillmentLocation)}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--gray-500);">Estimated Time:</span>
          <span style="color: var(--veg-color); font-weight: 700;">${details.fulfillmentEstimate}</span>
        </div>
      </div>

      <div style="padding: 0.75rem 1rem; background: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: var(--radius-md); font-size: 0.8rem; color: #1E40AF; text-align: left; line-height: 1.45; margin-bottom: 1.5rem;">
        🎓 <strong>Faculty Viva Demo Notice:</strong> Order state evaluated and completed in interactive client-side demonstration mode. Delivery fee (₹40 / ₹0) verified dynamically. (Spring Boot REST backend serves Restaurants & Foods catalog; demo orders are not stored in MySQL).
      </div>

      <div style="display: flex; gap: 1rem; justify-content: center;">
        <a href="index.html" class="btn btn-secondary" style="flex: 1;">Back to Home</a>
        <a href="restaurants.html" class="btn btn-primary" style="flex: 1;">Order More Food</a>
      </div>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  // Close on overlay click outside
  modalOverlay.addEventListener('click', function (e) {
    if (e.target === modalOverlay) {
      modalOverlay.remove();
      window.location.href = 'index.html';
    }
  });
}

// ============================================================================
// 7. LOGIN & REGISTRATION FORM VALIDATION (login.html)
// ============================================================================

/**
 * Initialize form validation on login.html for Sign In and Sign Up panes.
 */
function initAuthValidation() {
  const signinForm = document.querySelector('.form-pane-signin form');
  const signupForm = document.querySelector('.form-pane-signup form');

  // 1. Sign In Form Submission
  if (signinForm) {
    signinForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const emailInput = document.getElementById('signin-email');
      const passwordInput = document.getElementById('signin-password');

      const emailVal = emailInput ? emailInput.value.trim() : '';
      const passVal = passwordInput ? passwordInput.value.trim() : '';

      // Validate email/phone
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
      const isPhoneValid = /^[6-9]\d{9}$/.test(emailVal.replace(/\D/g, ''));

      if (!emailVal) {
        showFormAlert(signinForm, 'Please enter your email address or 10-digit mobile number.', 'error');
        if (emailInput) emailInput.focus();
        return;
      }

      if (!isEmailValid && !isPhoneValid) {
        showFormAlert(signinForm, 'Please enter a valid email address (e.g. rahul@example.com) or 10-digit mobile number.', 'error');
        if (emailInput) emailInput.focus();
        return;
      }

      // Validate password
      if (!passVal) {
        showFormAlert(signinForm, 'Please enter your password.', 'error');
        if (passwordInput) passwordInput.focus();
        return;
      }

      if (passVal.length < 6) {
        showFormAlert(signinForm, 'Password must be at least 6 characters long.', 'error');
        if (passwordInput) passwordInput.focus();
        return;
      }

      // Success
      const userName = emailVal.includes('@') ? emailVal.split('@')[0] : 'User';
      const capitalizedUser = userName.charAt(0).toUpperCase() + userName.slice(1);
      
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({
        name: capitalizedUser,
        email: emailVal,
        isLoggedIn: true
      }));

      showFormAlert(signinForm, `🎉 Welcome back, ${capitalizedUser}! Signing you in...`, 'success');
      showToast(`Signed in successfully as ${capitalizedUser}! 👋`);

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1200);
    });
  }

  // 2. Sign Up Form Submission
  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('signup-name');
      const emailInput = document.getElementById('signup-email');
      const phoneInput = document.getElementById('signup-phone');
      const passInput = document.getElementById('signup-pass');

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const phoneVal = phoneInput ? phoneInput.value.trim().replace(/\D/g, '') : '';
      const passVal = passInput ? passInput.value.trim() : '';

      if (!nameVal || nameVal.length < 2) {
        showFormAlert(signupForm, 'Please enter your full name (minimum 2 characters).', 'error');
        if (nameInput) nameInput.focus();
        return;
      }

      if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        showFormAlert(signupForm, 'Please enter a valid email address (e.g. priya@example.com).', 'error');
        if (emailInput) emailInput.focus();
        return;
      }

      if (!phoneVal || phoneVal.length < 10) {
        showFormAlert(signupForm, 'Please enter a valid 10-digit mobile number.', 'error');
        if (phoneInput) phoneInput.focus();
        return;
      }

      if (!passVal || passVal.length < 8) {
        showFormAlert(signupForm, 'Please choose a stronger password with at least 8 characters.', 'error');
        if (passInput) passInput.focus();
        return;
      }

      // Success
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({
        name: nameVal,
        email: emailVal,
        phone: phoneVal,
        isLoggedIn: true
      }));

      showFormAlert(signupForm, `🎉 Account created successfully! Welcome to QuickBite, ${nameVal}!`, 'success');
      showToast(`Account created for ${nameVal}! 🚀`);

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1200);
    });
  }

  // Update header sign in button if user is already logged in
  updateUserHeaderState();
}

/**
 * Display an inline alert message inside a form pane.
 */
function showFormAlert(form, message, type = 'error') {
  let alertElem = form.querySelector('.form-inline-alert');
  if (!alertElem) {
    alertElem = document.createElement('div');
    alertElem.className = 'form-inline-alert';
    form.insertBefore(alertElem, form.firstChild);
  }

  const isSuccess = type === 'success';
  alertElem.style.cssText = `
    padding: 0.85rem 1rem;
    border-radius: var(--radius-md);
    margin-bottom: 1.25rem;
    font-size: 0.9rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    background: ${isSuccess ? 'var(--veg-bg)' : '#FEE2E2'};
    color: ${isSuccess ? 'var(--veg-color)' : '#DC2626'};
    border: 1px solid ${isSuccess ? 'rgba(22, 163, 74, 0.3)' : 'rgba(220, 38, 38, 0.3)'};
    animation: fadeIn 0.25s ease;
  `;

  alertElem.innerHTML = `
    <span>${isSuccess ? '✓' : '⚠️'}</span>
    <span>${escapeHtml(message)}</span>
  `;
}

/**
 * Update the navigation Sign In button if a user profile exists in localStorage.
 */
function updateUserHeaderState() {
  const userJson = localStorage.getItem(USER_STORAGE_KEY);
  if (!userJson) return;

  try {
    const user = JSON.parse(userJson);
    if (user && user.isLoggedIn) {
      const loginNavBtns = document.querySelectorAll('#nav-btn-login');
      loginNavBtns.forEach(btn => {
        btn.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 16px; height: 16px;">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          Hi, ${escapeHtml(user.name.split(' ')[0])}
        `;
        btn.title = 'Click to Logout';
        btn.addEventListener('click', function (e) {
          if (confirm(`Do you want to log out, ${user.name}?`)) {
            e.preventDefault();
            localStorage.removeItem(USER_STORAGE_KEY);
            showToast('Logged out successfully.');
            setTimeout(() => window.location.reload(), 500);
          }
        });
      });
    }
  } catch (e) {
    console.error('Error reading user from localStorage:', e);
  }
}

// ============================================================================
// 8. TOAST NOTIFICATION POPUP SYSTEM
// ============================================================================

/**
 * Show a sleek floating toast notification at bottom right.
 */
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('quickbite-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'quickbite-toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 999999;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const isError = type === 'error';
  const isInfo = type === 'info';

  toast.style.cssText = `
    background: ${isError ? '#1E293B' : isInfo ? '#0F172A' : '#0B0F17'};
    color: #FFFFFF;
    padding: 0.85rem 1.35rem;
    border-radius: 12px;
    font-size: 0.92rem;
    font-weight: 600;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
    border: 1px solid ${isError ? '#EF4444' : isInfo ? '#38BDF8' : '#FF5722'};
    display: flex;
    align-items: center;
    gap: 0.6rem;
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: auto;
    max-width: 380px;
  `;

  toast.innerHTML = `<span>${message}</span>`;
  toastContainer.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  });

  // Auto remove after 3.2 seconds
  setTimeout(() => {
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/**
 * Helper to prevent XSS in dynamic HTML injections.
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================================
// 9. APP INITIALIZATION ON DOM READY
// ============================================================================

document.addEventListener('DOMContentLoaded', function () {
  console.log('⚡ QuickBite App Loaded: Initializing JavaScript modules...');

  // 1. Update Cart Counter Badges & User Header State
  updateCartBadges();
  updateUserHeaderState();

  // 2. Initialize Search
  initSearch();

  // 3. Initialize Restaurant Filters (on restaurants.html)
  initRestaurantFilters();

  // 4. Initialize Add-to-Cart click events (Home, Menu)
  initAddToCartButtons();

  // 5. Initialize Cart Page rendering (if on cart.html)
  if (document.querySelector('.cart-items-table')) {
    renderCartPage();
  }

  // 6. Update Floating mini cart bar (if on menu.html)
  updateFloatingCartBar();

  // 7. Initialize Auth Validation (if on login.html)
  initAuthValidation();
});
