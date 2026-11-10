# QuickBite React - College Elective Project

A modern, component-based **Food Delivery Web Application** built with **React (Vite)**, **React Router**, and **CSS3**.

---

## 🚀 How to Run the Project

1. **Navigate to the React application directory**:
   ```bash
   cd react-app
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Visit [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
FoodDelivery/
│
├── index.html, restaurants.html, menu.html, cart.html, login.html
├── css/style.css
├── js/script.js
│
└── react-app/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx          # Brand logo, page links, cart count badge, dynamic auth state
    │   │   ├── Footer.jsx          # 4-column footer with contact, cuisines, navigation & credit
    │   │   ├── RestaurantCard.jsx  # Card with rating, cuisines, delivery time, veg tag, view menu button
    │   │   ├── FoodCard.jsx        # Food item card with price, rating, veg/non-veg indicator & "ADD +" button
    │   │   ├── CartItem.jsx        # Row with quantity increment/decrement, remove, subtotal
    │   │   ├── OrderModal.jsx      # Order confirmation receipt modal with Order ID & delivery time
    │   │   └── Toast.jsx           # Animated floating notification feedback banner
    │   │
    │   ├── pages/
    │   │   ├── Home.jsx            # Hero search, categories, featured dishes, top restaurants, offers
    │   │   ├── Restaurants.jsx     # Multi-criteria filtering (Pills, Sidebar sort, Dietary, Cuisines, Price)
    │   │   ├── Menu.jsx            # Restaurant hero header, sticky category sidebar, dish cards, floating mini-cart
    │   │   ├── Cart.jsx            # Dynamic cart table, address selector, rider tip chips, coupon discount, checkout
    │   │   └── Login.jsx           # Sign In / Sign Up tabbed form with validation & localStorage persistence
    │   │
    │   ├── data/
    │   │   └── mockData.js         # Centralized JavaScript arrays (ready for Spring Boot REST API integration)
    │   │
    │   ├── App.jsx                 # Main component with routing, global cart & auth state, localStorage sync
    │   ├── App.css                 # Complete responsive design system (tokens, cards, buttons, media queries)
    │   └── main.jsx                # React root entry point with BrowserRouter
    │
    ├── package.json
    ├── vite.config.js
    └── index.html
```

---

## 🎓 Core React Concepts Demonstrated (Viva Preparation)

### 1. Functional Components & JSX
All UI elements are broken down into reusable functional components (`Navbar`, `Footer`, `RestaurantCard`, `FoodCard`, `CartItem`, etc.) utilizing JSX syntax that combines HTML structure with JavaScript expressions.

### 2. State Management (`useState`)
- **Cart State**: Array of items in the cart with `{ id, name, price, quantity, isVeg, subtitle }`.
- **Search & Filters State**: `searchTerm`, `activePill`, `sortBy`, `vegOnly`, `selectedCuisines`, `priceRange`.
- **Auth State**: `currentUser` storing login credentials and session status.
- **Form State**: Controlled inputs for email, password, name, phone, coupon code.

### 3. Lifecycle & Side Effects (`useEffect`)
- **LocalStorage Sync**: Automatically updates `localStorage.setItem('quickbite_cart', JSON.stringify(cart))` whenever the cart state changes.
- **URL Parameter Sync**: Reads `?search=` and `?category=` query parameters when navigating from Home to Restaurants.
- **Scroll Restoration**: Automatically scrolls to the top of the window on page route changes.

### 4. Client-Side Routing (`react-router-dom`)
- `BrowserRouter`, `Routes`, `Route`: Defines declarative navigation paths (`/`, `/restaurants`, `/menu`, `/cart`, `/login`).
- `Link`, `NavLink`: Enables client-side navigation without full browser reloads.
- `useNavigate`, `useSearchParams`: Programmatic navigation and URL search query handling.

### 5. LocalStorage Persistence
- Cart items and user authentication persist across page reloads using browser `localStorage` (`quickbite_cart` and `quickbite_user`).

---

## 🔌 Connecting to Java Spring Boot Backend (Future Step)

In `src/data/mockData.js`, data is structured in JSON-friendly arrays. To connect with Spring Boot:
1. Replace static imports with `useEffect` and `fetch()` or `axios`:
   ```javascript
   useEffect(() => {
     fetch('http://localhost:8080/api/restaurants')
       .then(res => res.json())
       .then(data => setRestaurants(data));
   }, []);
   ```
2. Replace `handleCheckoutSuccess` with a `POST /api/orders` call.
