# QuickBite Food Delivery System - Spring Boot Backend

A clean, beginner-friendly RESTful backend for the **QuickBite Food Delivery System** college project built with **Java 17+**, **Spring Boot 3**, **Spring Data JPA**, **H2 In-Memory Database**, and **JUnit 5 / Mockito**.

---

## 📑 Table of Contents
1. [Architecture & Request Flow](#-architecture--request-flow)
2. [Project Package Structure](#-project-package-structure)
3. [Domain Entities](#-domain-entities)
4. [Business Rules Implemented](#-business-rules-implemented)
5. [REST API Endpoints](#-rest-api-endpoints)
6. [H2 In-Memory Database Console](#-h2-in-memory-database-console)
7. [How to Run the Application](#-how-to-run-the-application)
8. [How to Run Automated Tests](#-how-to-run-automated-tests)
9. [Manual Test Cases & Verification](#-manual-test-cases--verification)
10. [Viva & Project Defense Guide (Q&A)](#-viva--project-defense-guide-qa)

---

## 🏛️ Architecture & Request Flow

The backend follows the industry-standard **3-Layer Architecture**:

```
Client (Postman / Browser / Frontend)
                 │
                 ▼  [HTTP Request: JSON]
    ┌─────────────────────────┐
    │     Controller Layer    │  @RestController
    │ (Receives REST requests)│  - Maps URLs (@GetMapping, @PostMapping)
    └────────────┬────────────┘  - Validates request format, returns HTTP status
                 │
                 ▼  [Calls Java methods]
    ┌─────────────────────────┐
    │      Service Layer      │  @Service
    │ (Contains Business Logic│  - Enforces rules (price > 0, availability check)
    └────────────┬────────────┘  - Orchestrates business workflows
                 │
                 ▼  [Calls Repository methods]
    ┌─────────────────────────┐
    │     Repository Layer    │  @Repository (Spring Data JPA)
    │ (Accesses Database Data)│  - Executes queries (save, findById, findAll)
    └────────────┬────────────┘
                 │
                 ▼  [SQL / JDBC]
    ┌─────────────────────────┐
    │  H2 In-Memory Database  │  jdbc:h2:mem:quickbitedb
    │      (Tables:           │  - tables: restaurants, food_items
    │ restaurants, food_items)│
    └─────────────────────────┘
```

### Step-by-Step Flow Example (Adding a Food Item):
1. **Client** sends `POST /api/foods` with JSON body: `{"name":"Burger","price":8.99,...}`.
2. **`FoodItemController`** receives the request and delegates execution to `foodService.addFoodItem(...)`.
3. **`FoodService`** executes **Business Rule 1**: checks if `price > 0`. If `price <= 0`, it rejects the request by throwing `InvalidFoodPriceException`.
4. If valid, **`FoodService`** calls `foodItemRepository.save(foodItem)`.
5. **`FoodItemRepository`** generates the SQL `INSERT INTO food_items ...` and executes it in the **H2 database**.
6. The saved entity (with generated ID) flows back through Service to Controller.
7. **Controller** returns `201 Created` with the saved entity JSON back to the Client.
8. If an exception occurred, **`GlobalExceptionHandler`** catches it and returns a clean error JSON with HTTP status code `400 Bad Request` or `404 Not Found`.

---

## 📁 Project Package Structure

```
backend/
├── pom.xml                                   # Maven dependencies & build configuration
├── mvnw / mvnw.cmd                          # Maven Wrapper scripts (run without installing Maven)
├── .mvn/wrapper/                             # Maven wrapper configuration
├── README.md                                 # Complete documentation & viva guide
└── src/
    ├── main/
    │   ├── java/com/quickbite/fooddelivery/
    │   │   ├── QuickBiteApplication.java    # Spring Boot Main Entry Point
    │   │   ├── config/
    │   │   │   └── DataLoader.java          # Seeds initial sample restaurants & foods
    │   │   ├── controller/
    │   │   │   ├── RestaurantController.java# REST endpoints for /api/restaurants
    │   │   │   └── FoodItemController.java  # REST endpoints for /api/foods
    │   │   ├── entity/
    │   │   │   ├── Restaurant.java          # JPA entity for restaurants table
    │   │   │   └── FoodItem.java            # JPA entity for food_items table
    │   │   ├── exception/
    │   │   │   ├── InvalidFoodPriceException.java # Thrown when price <= 0
    │   │   │   ├── ResourceNotFoundException.java # Thrown when ID not found
    │   │   │   ├── ErrorResponse.java       # Standard error response payload
    │   │   │   └── GlobalExceptionHandler.java    # @RestControllerAdvice
    │   │   ├── repository/
    │   │   │   ├── RestaurantRepository.java# Spring Data JPA for Restaurant
    │   │   │   └── FoodItemRepository.java  # Spring Data JPA for FoodItem
    │   │   └── service/
    │   │       ├── RestaurantService.java   # Business logic for restaurants
    │   │       └── FoodService.java         # Business rules for food items
    │   └── resources/
    │       └── application.properties       # H2 DB, server port (8080), JPA config
    └── test/
        └── java/com/quickbite/fooddelivery/
            ├── QuickBiteApplicationTests.java # Context loading test
            └── service/
                └── FoodServiceTest.java     # Automated unit tests for business rules
```

---

## 📦 Domain Entities

### 1. `Restaurant`
- `id` (Long, Primary Key, Auto-Generated)
- `name` (String, Restaurant Name)
- `cuisine` (String, Cuisine type: e.g. "Italian", "Indian", "American")
- `rating` (Double, Rating: e.g. 4.7)

### 2. `FoodItem`
- `id` (Long, Primary Key, Auto-Generated)
- `name` (String, Food name: e.g. "Margherita Pizza")
- `description` (String, Details of ingredients/dish)
- `price` (Double, Price in standard currency)
- `category` (String, Food category: e.g. "Pizza", "Biryani", "Burger")
- `available` (Boolean, Availability status for ordering: `true` / `false`)

---

## ⚖️ Business Rules Implemented

| Rule | Location | Description | Exception / Behavior |
|---|---|---|---|
| **Rule 1: Price Validation** | `FoodService.java` | Food price must be strictly greater than zero (`price > 0`). Zero, negative, or null prices are rejected. | Throws `InvalidFoodPriceException` -> HTTP 400 Bad Request |
| **Rule 2: Availability Filtering** | `FoodService.java` & `FoodItemRepository.java` | Only food items with `available = true` are returned by available food endpoints. | Filters out out-of-stock items (e.g. `available = false`) |
| **Rule 3: Resource Lookup** | `FoodService.java` & `RestaurantService.java` | If a requested ID does not exist in the database, a clean error is returned. | Throws `ResourceNotFoundException` -> HTTP 404 Not Found |

---

## 🌐 REST API Endpoints

| HTTP Method | Endpoint | Description | Sample Response Status |
|---|---|---|---|
| `GET` | `/api/restaurants` | List all restaurants | `200 OK` |
| `GET` | `/api/restaurants/{id}` | Get restaurant by ID | `200 OK` or `404 Not Found` |
| `GET` | `/api/foods` | List all food items (including out-of-stock) | `200 OK` |
| `GET` | `/api/foods/available` | List **only available** food items (Business Rule 2) | `200 OK` |
| `GET` | `/api/foods/{id}` | Get food item by ID | `200 OK` or `404 Not Found` |
| `POST` | `/api/foods` | Add a new food item (Business Rule 1: price > 0) | `201 Created` or `400 Bad Request` |

---

## 🗄️ H2 In-Memory Database Console

Spring Boot starts an in-memory H2 database on port 8080 with a web console:
- **URL**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- **JDBC URL**: `jdbc:h2:mem:quickbitedb`
- **User Name**: `sa`
- **Password**: *(leave blank)*

You can query the database directly in the console using standard SQL:
```sql
SELECT * FROM RESTAURANTS;
SELECT * FROM FOOD_ITEMS;
```

---

## 🚀 How to Run the Application

Navigate to the `backend` directory in your terminal or command prompt:

### Using Maven Wrapper (Recommended - No global Maven install needed):
**On Windows (PowerShell / Command Prompt):**
```powershell
cd "c:\Users\Sanket Gapat\FoodDelivery\backend"
.\mvnw.cmd spring-boot:run
```

**On Linux / macOS:**
```bash
cd backend
./mvnw spring-boot:run
```

### Using Global Maven (if `mvn` is on your PATH):
```bash
mvn spring-boot:run
```

Once started, the server will output:
```
Tomcat started on port 8080 (http) with context path '/'
>>> Sample data seeded successfully into H2 Database!
>>> Seeded 4 restaurants and 6 food items.
```

---

## 🧪 How to Run Automated Tests

The automated test suite tests all business rules, invalid price rejections, and context initialization using JUnit 5 and Mockito.

**On Windows:**
```powershell
cd "c:\Users\Sanket Gapat\FoodDelivery\backend"
.\mvnw.cmd test
```

**Test Execution Summary:**
- Total tests run: **7**
- Failures: **0**
- Errors: **0**
- Skipped: **0**
- Status: **BUILD SUCCESS**

---

## 📋 Manual Test Cases & Verification

The following test cases were executed directly against the live Spring Boot server:

### Test Case 1: Fetch Available Foods Only (Business Rule 2)
- **Endpoint**: `GET http://localhost:8080/api/foods/available`
- **Input**: None (HTTP GET)
- **Expected Output**: HTTP 200 with exactly 5 food items, all having `"available": true`. Item ID 5 ("Chocolate Lava Cake", `available: false`) must be excluded.
- **Actual Output**:
```json
[
  {"id": 1, "name": "Margherita Pizza", "price": 12.99, "available": true},
  {"id": 2, "name": "Hyderabadi Chicken Biryani", "price": 14.50, "available": true},
  {"id": 3, "name": "Cheeseburger Deluxe", "price": 9.99, "available": true},
  {"id": 4, "name": "Crispy French Fries", "price": 4.50, "available": true},
  {"id": 6, "name": "Mango Lassi", "price": 3.99, "available": true}
]
```
- **Result**: **PASS** (Chocolate Lava Cake excluded, 5 items returned).

---

### Test Case 2: Reject Food Item with Zero or Negative Price (Business Rule 1)
- **Endpoint**: `POST http://localhost:8080/api/foods`
- **Input Body**:
```json
{
  "name": "Free Soda",
  "description": "Zero price promo item",
  "price": 0.0,
  "category": "Beverages",
  "available": true
}
```
- **Expected Output**: HTTP 400 Bad Request with error message stating price must be greater than zero.
- **Actual Output**:
```json
{
  "timestamp": "2026-10-15T11:35:15.9745839",
  "status": 400,
  "error": "Bad Request - Invalid Food Price",
  "message": "Food price must be greater than zero. Provided price: 0.0"
}
```
- **Result**: **PASS** (Zero price rejected with HTTP 400).

---

### Test Case 3: Missing Food Item ID (Exception Handling)
- **Endpoint**: `GET http://localhost:8080/api/foods/999`
- **Input**: ID `999` (non-existent ID)
- **Expected Output**: HTTP 404 Not Found with error message indicating food item was not found.
- **Actual Output**:
```json
{
  "timestamp": "2026-10-15T11:35:05.003618",
  "status": 404,
  "error": "Not Found",
  "message": "Food item not found with ID: 999"
}
```
- **Result**: **PASS** (HTTP 404 with clean JSON).

---

### Test Case 4: Add Valid Food Item (POST /api/foods)
- **Endpoint**: `POST http://localhost:8080/api/foods`
- **Input Body**:
```json
{
  "name": "Paneer Butter Masala",
  "description": "Rich and creamy cottage cheese curry cooked with aromatic spices",
  "price": 11.99,
  "category": "Main Course",
  "available": true
}
```
- **Expected Output**: HTTP 201 Created with auto-generated ID `7`.
- **Actual Output**:
```json
{
  "id": 7,
  "name": "Paneer Butter Masala",
  "description": "Rich and creamy cottage cheese curry cooked with aromatic spices",
  "price": 11.99,
  "category": "Main Course",
  "available": true
}
```
- **Result**: **PASS** (Item saved successfully and returned with generated ID 7).

---

## 🎓 Viva & Project Defense Guide (Q&A)

### Q1: What is Spring Boot and why did you use it?
**Answer**: Spring Boot is an extension of the Spring framework that eliminates boilerplate configuration. It provides auto-configuration, an embedded Tomcat server (no external server installation required), and "Starter" dependencies to quickly build production-ready REST APIs.

### Q2: What is the 3-Layer Architecture?
**Answer**:
1. **Controller Layer**: Handles incoming HTTP requests, extracts parameters/JSON bodies, delegates to the Service layer, and returns HTTP response codes.
2. **Service Layer**: Contains all core business logic (e.g. price > 0, filtering only available foods). Controllers should NEVER contain business logic.
3. **Repository Layer**: Interfaces with the database via Spring Data JPA to perform CRUD operations without writing raw SQL.

### Q3: Why use Constructor Injection instead of `@Autowired` on fields?
**Answer**: Constructor injection is the official recommended best practice by the Spring team. It makes classes immutable (`final` fields), prevents `NullPointerException` during testing without Spring context, and allows easy mocking using Mockito.

### Q4: How does Spring Data JPA work without writing SQL?
**Answer**: By extending `JpaRepository<FoodItem, Long>`, Spring Data JPA automatically provides implementations for `save()`, `findAll()`, `findById()`, and `delete()`. For custom queries like `findByAvailableTrue()`, Spring generates the SQL query at runtime by parsing the method name according to JPA conventions.

### Q5: How is exception handling done?
**Answer**: We use `@RestControllerAdvice` in `GlobalExceptionHandler.java`. Whenever a Controller or Service throws `InvalidFoodPriceException` or `ResourceNotFoundException`, the handler catches it and returns a clean, structured `ErrorResponse` object with an appropriate HTTP status code (400 or 404) instead of a messy stack trace.
