# QuickBite Food Delivery System 🍔🚀

> **A Modern Full-Stack Food Ordering & Delivery Web Application**  
> Developed for Academic Evaluation & Industry-Standard Demonstration.

[![Java](https://img.shields.io/badge/Java-17%2B-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Executive Summary

**QuickBite** is a responsive, feature-rich full-stack food delivery and restaurant management system. The application offers customers a seamless food discovery and checkout experience, backed by an enterprise-grade **Spring Boot 3 REST API** architecture with **MySQL** database persistence and clean **3-layer separation of concerns**.

The system provides two frontend clients:
1. **Vanilla Web Client** (`HTML5`, `CSS3`, `JavaScript ES6+`) with zero external runtime dependencies for instant evaluation.
2. **React Single Page Application (SPA)** (`React 18`, `Vite`, `React Router DOM`) for modern reactive state management and component-driven architecture.

---

## 🏛️ System Architecture

QuickBite strictly adheres to the standard **3-Tier Enterprise Architecture**:

```
 ┌─────────────────────────────────────────────────────────────┐
 │                       Client Layer                          │
 │  ┌─────────────────────────┐   ┌─────────────────────────┐  │
 │  │ Vanilla Client (HTML/JS)│   │ React 18 SPA (Vite/DOM) │  │
 │  └────────────┬────────────┘   └────────────┬────────────┘  │
 └───────────────┼─────────────────────────────┼───────────────┘
                 │       REST API (JSON)       │
                 ▼                             ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                Controller Layer (@RestController)           │
 │  • RestaurantController.java     • FoodItemController.java  │
 │  • GlobalExceptionHandler.java   • ErrorResponse.java       │
 └──────────────────────────────┬──────────────────────────────┘
                                │ Calls Java Services
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                 Service Layer (@Service)                    │
 │  • RestaurantService.java        • FoodService.java         │
 │  • Enforces Business Rule 1 (Price > 0 Validation)          │
 │  • Enforces Business Rule 2 (Food Item Availability Filter) │
 └──────────────────────────────┬──────────────────────────────┘
                                │ Calls JPA Repositories
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │             Repository Layer (Spring Data JPA)              │
 │  • RestaurantRepository.java     • FoodItemRepository.java  │
 └──────────────────────────────┬──────────────────────────────┘
                                │ Hibernate ORM / JDBC
                                ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                       Database Layer                        │
 │  • MySQL 8.0 (Production / Dev: jdbc:mysql://localhost:3306)│
 │  • H2 In-Memory DB (Testing & CI/CD: jdbc:h2:mem:quickbitedb│
 └─────────────────────────────────────────────────────────────┘
```

---

## ✨ Core Features

### 1. 🛵 Multi-Mode Order Fulfillment Engine
QuickBite features 3 distinct fulfillment options on the checkout page with instant, real-time recalculation of bill items, fees, and grand total:
- **Delivery by QuickBite**: Doorstep delivery by verified riders. Dynamically displays user address selection and adds a **₹40.00** delivery fee.
- **Self Pickup / Takeaway**: Customer collects freshly prepared food directly from the restaurant counter. Hides delivery address cards and sets delivery fee to **₹0.00 (FREE)**.
- **Dine-in**: Customer eats at the restaurant with table allocation on arrival. Sets delivery fee to **₹0.00 (FREE)**.

### 2. 🛒 Real-Time Cart & Bill Calculation Engine
- Live quantity increments/decrements with subtotal calculation.
- Coupon engine supporting codes (`QUICK50` for flat 50% discount up to ₹100, `ROYAL50`, `FLAT75`).
- Automatic itemized breakdown: Item Total, Delivery Fee, Packaging Charges (₹25), Taxes & GST (5%), Coupon Discount, Optional Rider Tip, and Platform Fee (₹5).
- LocalStorage persistence preserving cart items across page refreshes.

### 3. 🔍 Smart Search & Categorized Exploration
- Real-time search across restaurants and dishes with auto-suggestions.
- Multi-criteria filter options (Veg only, Non-Veg, Top Rated 4.0+, Quick Delivery, Budget).
- Floating mini-cart notification bar on menu pages.

### 4. 🛡️ Robust Spring Boot REST Backend
- Standardized REST APIs for restaurants and food catalog.
- Business rule enforcement:
  - **Rule 1 (Price Validation)**: Reject negative or zero prices with `400 Bad Request` and custom `InvalidFoodPriceException`.
  - **Rule 2 (Availability Filter)**: Exclude out-of-stock items via `/api/foods/available`.
- Global exception handling returning unified JSON error payloads (`timestamp`, `status`, `error`, `message`, `path`).

---

## 🛠️ Technology Stack

| Layer | Technologies / Frameworks |
| :--- | :--- |
| **Backend Framework** | Java 17+, Spring Boot 3.3.4 (Web, Data JPA) |
| **ORM / Persistence** | Hibernate 6, Spring Data JPA |
| **Databases** | MySQL 8.0 (Development), H2 In-Memory (Automated Tests) |
| **Build & Dependency Tool** | Apache Maven 3.9+ via Maven Wrapper (`./mvnw`) |
| **Testing Frameworks** | JUnit 5 (Jupiter), Mockito, Spring Boot Test |
| **Frontend Clients** | Vanilla HTML5 / CSS3 / JavaScript ES6+ & React 18 / Vite / React Router |
| **Styling & Design System** | Custom CSS Design System with CSS Variables, Flexbox, CSS Grid |

---

## 📋 REST API Endpoints

### 🍽️ Food Items Endpoints (`/api/foods`)
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/foods` | Fetch all food items (supports `?availableOnly=true`) | `200 OK` |
| `GET` | `/api/foods/available` | Fetch only currently available food items | `200 OK` |
| `GET` | `/api/foods/{id}` | Fetch a specific food item by primary key | `200 OK` / `404 Not Found` |
| `POST` | `/api/foods` | Add new food item (validates `price > 0`) | `201 Created` / `400 Bad Request` |

### 🏬 Restaurant Endpoints (`/api/restaurants`)
| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/restaurants` | Retrieve all registered restaurants | `200 OK` |
| `GET` | `/api/restaurants/{id}` | Retrieve specific restaurant details | `200 OK` / `404 Not Found` |
| `POST` | `/api/restaurants` | Register a new restaurant | `201 Created` / `400 Bad Request` |

---

## 🚀 Setup & Installation Guide

### Prerequisites
- **Java JDK 17** or higher installed (`java -version`)
- **Node.js 18+** & npm (`node -v`, `npm -v`)
- **MySQL 8.0** server running locally (`localhost:3306`)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/<your-username>/QuickBite-Food-Delivery.git
cd QuickBite-Food-Delivery
```

---

### Step 2: Configure Backend Database Credentials
Database secrets are externalized and kept out of version control:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Copy the template configuration file:
   ```bash
   cp application-local.properties.example application-local.properties
   ```
3. Edit `application-local.properties` with your local MySQL credentials:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```
   *(Alternatively, set the environment variable: `SPRING_DATASOURCE_PASSWORD=your_mysql_password`)*

---

### Step 3: Run Backend Server
```bash
# On Windows PowerShell / Command Prompt:
.\mvnw.cmd spring-boot:run

# On Linux / macOS:
./mvnw spring-boot:run
```
The server will start on `http://localhost:8080`.  
Initial seed data for restaurants and food items is automatically loaded upon startup.

---

### Step 4: Run Automated Tests
```bash
# Run unit & integration tests with H2 in-memory DB:
.\mvnw.cmd test
```
All 7 unit and integration tests will execute and pass without requiring an active MySQL connection.

---

### Step 5: Launch Frontend

#### Option A: Vanilla Web Application (No build required)
Simply double-click or open `index.html` in any modern web browser, or serve it via Live Server:
```bash
# Optional: using Python simple HTTP server
python -m http.server 3000
```
Visit `http://localhost:3000` or open `index.html` directly.

#### Option B: React 18 Application
```bash
cd react-app
npm install
npm run dev
```
Visit `http://localhost:5173` to explore the React version of QuickBite.

To create an optimized production build:
```bash
npm run build
```

---

## 📁 Repository Directory Structure

```
QuickBite-Food-Delivery/
├── backend/                                  # Spring Boot REST API
│   ├── .mvn/wrapper/                         # Maven Wrapper files
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/quickbite/fooddelivery/
│   │   │   │   ├── config/DataLoader.java    # Seeds initial sample data
│   │   │   │   ├── controller/               # REST Controllers (Food, Restaurant)
│   │   │   │   ├── entity/                   # JPA Entities (@Entity)
│   │   │   │   ├── exception/                # Global Exception Handler
│   │   │   │   ├── repository/               # Spring Data JPA Repositories
│   │   │   │   ├── service/                  # Business Logic & Validation Rules
│   │   │   │   └── QuickBiteApplication.java # Spring Boot entry point
│   │   │   └── resources/
│   │   │       └── application.properties    # Externalized configuration
│   │   └── test/
│   │       ├── java/com/quickbite/fooddelivery/
│   │       │   ├── service/FoodServiceTest.java
│   │       │   └── QuickBiteApplicationTests.java
│   │       └── resources/application.properties # Isolated H2 DB for tests
│   ├── pom.xml                               # Maven project dependencies
│   ├── application-local.properties.example  # Safe configuration template
│   └── .env.example                          # Sample environment variables
│
├── react-app/                                # React 18 SPA (Vite)
│   ├── src/
│   │   ├── components/                       # Navbar, Footer, FoodCard, OrderModal
│   │   ├── data/mockData.js                  # Central restaurant & menu dataset
│   │   ├── pages/                            # Home, Restaurants, Menu, Cart, Login
│   │   ├── App.jsx                           # Application routes & central state
│   │   ├── App.css                           # Design system styles
│   │   └── main.jsx                          # React DOM entry point
│   ├── package.json                          # React project dependencies
│   └── vite.config.js                        # Vite build configuration
│
├── css/
│   └── style.css                             # Unified vanilla stylesheet
├── js/
│   └── script.js                             # Vanilla JS cart & fulfillment engine
├── index.html                                # Landing page
├── restaurants.html                          # Restaurant directory page
├── menu.html                                 # Restaurant menu page
├── cart.html                                 # Cart & fulfillment checkout page
├── login.html                                # Authentication & profile page
├── .gitignore                                # Comprehensive Git ignore rules
├── FACULTY_DEMO.md                           # 5-minute Viva & Code Demonstration Guide
└── README.md                                 # Complete project documentation
```

---

## 🎓 Faculty Viva & Project Defense Guide

For academic review, viva voce, and faculty demonstrations, refer to [`FACULTY_DEMO.md`](FACULTY_DEMO.md) for:
- Specific Java files to open in IntelliJ IDEA.
- 5-Minute structured presentation script.
- Explanation of Business Rule 1 (Price validation) & Business Rule 2 (Availability filter).
- Interactive demonstration of the three fulfillment options (Delivery ₹40 vs Pickup ₹0 vs Dine-in ₹0).

---

## 🔒 Security Best Practices Implemented

- **No Hardcoded Credentials in Version Control**: Database passwords are excluded from tracked repository files via `.gitignore`.
- **Environment Variable Overrides**: Supports `SPRING_DATASOURCE_PASSWORD` and `application-local.properties`.
- **Safe Fallbacks for Testing**: Integration tests run exclusively on an ephemeral H2 in-memory database to prevent test pollution.
- **Input Validation**: Backend strictly validates prices and incoming payloads to prevent negative values or malformed states.

---

## 👥 Authors & Academic Credits

- **Developer**: Sanket Gapat
- **Project**: QuickBite Food Delivery Web Application
- **Course**: Full-Stack Web Development / Academic Capstone Project
- **Academic Year**: 2026

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

