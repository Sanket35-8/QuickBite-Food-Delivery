# QuickBite Food Delivery System - Faculty Demonstration & Viva Guide 🎓

> **A Complete 5-Minute Presentation Guide for College Faculty & Viva Voce Evaluation**  
> *Keep this file open during your project presentation.*

---

## 📑 Quick Reference: Files to Open in IntelliJ IDEA

Before the evaluation begins, open these key files as tabs in IntelliJ IDEA:

| Layer | File Path to Open | What to Highlight to the Evaluator |
| :--- | :--- | :--- |
| **Entity** | `backend/src/main/java/.../entity/FoodItem.java` | JPA annotations: `@Entity`, `@Table(name = "food_items")`, `@Id`, `@GeneratedValue(strategy = GenerationType.IDENTITY)`. |
| **Entity** | `backend/src/main/java/.../entity/Restaurant.java` | Domain attributes: `name`, `cuisine`, `rating`. |
| **Repository** | `backend/src/main/java/.../repository/FoodItemRepository.java` | Extends `JpaRepository<FoodItem, Long>`. Highlight custom query method: `findByAvailableTrue()`. |
| **Service** | `backend/src/main/java/.../service/FoodService.java` | **Business Logic Layer**: Enforces **Rule 1** (rejects `price <= 0`) and **Rule 2** (filters only available dishes). |
| **Controller** | `backend/src/main/java/.../controller/FoodItemController.java` | `@RestController`, `@RequestMapping("/api/foods")`, `@CrossOrigin`, `@GetMapping`, `@PostMapping` returning `ResponseEntity`. |
| **Exception** | `backend/src/main/java/.../exception/GlobalExceptionHandler.java` | `@RestControllerAdvice`, centralized error handling for `InvalidFoodPriceException` and `ResourceNotFoundException`. |
| **JUnit Tests** | `backend/src/test/java/.../service/FoodServiceTest.java` | Unit tests with JUnit 5 & Mockito (`@ExtendWith(MockitoExtension.class)`, `@Mock`, `@InjectMocks`). |
| **Frontend Engine** | `js/script.js` & `cart.html` | Client-side fulfillment option engine (`initFulfillmentSelection()`, `updateBillCalculations()`). |

---

## ⏱️ 5-Minute Timed Presentation Script

```
Timeline:
[0:00 - 1:00]  Project Overview & 3-Tier Architecture
[1:00 - 2:15]  Backend Code Tour in IntelliJ IDEA (Entity -> Repo -> Service -> Controller)
[2:15 - 2:45]  Running Automated JUnit 5 Unit Tests
[2:45 - 4:15]  Live Frontend Demo: Order Fulfillment (Delivery ₹40 vs Pickup ₹0 vs Dine-in ₹0)
[4:15 - 5:00]  Conclusion & Viva Q&A Defense
```

---

### Minute 0:00 – 1:00: Introduction & Architecture

**What to Say:**
> *"Respected Professors, good morning/afternoon. Today I am presenting **QuickBite**, a full-stack food ordering platform designed with enterprise software development standards.*  
> *The system follows a strict **3-Layer Architecture**:*  
> 1. *The **Controller Layer** receives HTTP REST requests and returns standard JSON.*  
> 2. *The **Service Layer** encapsulates business logic and validation rules.*  
> 3. *The **Repository Layer** uses Spring Data JPA and Hibernate to communicate with the database.*  
> *To guarantee high availability and clean separation, the backend provides RESTful APIs, while the frontend provides an interactive, reactive checkout flow."*

**What to Show on Screen:**
- Show the architecture diagram from [`README.md`](README.md).

---

### Minute 1:00 – 2:15: Backend Code Tour in IntelliJ IDEA

**1. Show the Entity (`FoodItem.java`):**
> *"Here in `FoodItem.java`, we define the JPA entity mapped to the `food_items` table in MySQL with automatic primary key generation."*

**2. Show the Repository (`FoodItemRepository.java`):**
> *"By extending `JpaRepository`, Spring Data JPA automatically provides standard CRUD operations. Notice the method `findByAvailableTrue()`, which Spring implements dynamically using method name parsing without boilerplate SQL."*

**3. Show the Service Layer (`FoodService.java`) — HIGHLIGHT BUSINESS RULES:**
> *"The Service layer contains two core business rules:*  
> - ***Business Rule 1: Price Validation***. *If an item has a price less than or equal to zero, we reject it by throwing an `InvalidFoodPriceException`.*  
> - ***Business Rule 2: Availability Filtering***. *The method `getAvailableFoodItems()` ensures out-of-stock items are omitted from customers."*

**4. Show the Controller & Exception Handler (`FoodItemController.java` & `GlobalExceptionHandler.java`):**
> *"The Controller delegates all logic to the service and returns proper HTTP status codes like `200 OK` and `201 Created`. If an invalid request arrives, our `@RestControllerAdvice` in `GlobalExceptionHandler` intercepts it and returns a consistent JSON error response."*

---

### Minute 2:15 – 2:45: Automated JUnit Tests

**What to Do in IntelliJ IDEA:**
1. Open `FoodServiceTest.java`.
2. Right-click the class name and click **Run 'FoodServiceTest'** (or run `.\mvnw.cmd test` in terminal).
3. Point out that all tests pass with green checkmarks.

**What to Say:**
> *"Here in `FoodServiceTest.java`, we use JUnit 5 and Mockito to test our business logic in complete isolation from the database. When we test price validation, Mockito verifies that invalid items never reach the database and throw the expected exceptions. All 7 tests pass cleanly."*

---

### Minute 2:45 – 4:15: Live Checkout & 3 Fulfillment Options Demo

**What to Do in the Browser:**
1. Open `cart.html` in Chrome/Edge.
2. Scroll to the **"Choose Order Fulfillment Option"** section.

**Step 1: Demonstrate "Delivery by QuickBite" (Default)**
- Point out the active **Delivery by QuickBite** card.
- Show that the **Delivery Address card** and **Rider Tip card** are visible.
- Point to the Bill Details on the right:
  - *Delivery Partner Fee (QuickBite)*: **₹40.00**
  - *Grand Total*: **₹747.00** (with default items & QUICK50 coupon).

**What to Say:**
> *"QuickBite provides three dynamic order fulfillment modes. First, 'Delivery by QuickBite'. Here, the delivery address selection is displayed, and a ₹40 delivery fee is applied to the bill."*

---

**Step 2: Demonstrate "Self Pickup / Takeaway"**
- Click the **"Self Pickup / Takeaway"** card.
- Observe:
  1. The card immediately becomes highlighted with active styling.
  2. The delivery address cards and rider tip card are **instantly hidden**.
  3. The **Takeaway Station card** appears with restaurant pickup counter address and operating hours.
  4. In Bill Details, Delivery Fee immediately changes to **₹0.00 (FREE)**.
  5. The Grand Total and "Proceed to Pay" button drop by **₹40 instantly** (to **₹707.00**).

**What to Say:**
> *"When a customer chooses 'Self Pickup', they collect their meal from the restaurant counter. Notice how the delivery address is replaced by the restaurant pickup station, and the delivery fee drops to ₹0, immediately saving the customer ₹40 on their grand total."*

---

**Step 3: Demonstrate "Dine-in"**
- Click the **"Dine-in"** card.
- Observe:
  1. The card is selected.
  2. The **Dine-in Table Service Details** card appears, showing table allocation on arrival and fine-dining seating.
  3. Delivery Fee remains **₹0.00 (FREE)**.
  4. Bill total stays at **₹707.00**.

---

**Step 4: Place Order & Show Receipt Modal**
- Click **"Proceed to Pay ₹707.00"**.
- The Order Confirmation Modal pops up.
- Highlight the fields:
  - Order ID: `QB-XXXXXX`
  - Fulfillment Type: `Dine-in` / `Self Pickup`
  - Delivery Fee: `₹0.00 (FREE)`
  - Faculty Viva Demo Notice.

**What to Say:**
> *"Clicking proceed generates a unique order reference, validates the fulfillment option, and presents a complete breakdown. Because this is an academic demonstration, an explicit banner confirms that the order calculation is evaluated client-side, while restaurant and food data come from the Spring Boot backend."*

---

### Minute 4:15 – 5:00: Summary & Conclusion

**What to Say:**
> *"In summary, QuickBite demonstrates clean software engineering principles: strict 3-tier modularity, externalized environment configuration to protect database secrets, automated unit testing with Mockito, and a responsive frontend with multi-mode fulfillment calculations. Thank you, professors! I am ready for any questions."*

---

## ❓ Frequently Asked Viva Questions & Model Answers

### Q1: Why did you separate Controller, Service, and Repository layers?
> **Answer:**  
> *"Separation of concerns. The Controller handles HTTP transport and protocol validation; the Service encapsulates reusable business logic and validation; and the Repository abstracts database queries via Spring Data JPA. This makes the code modular, maintainable, and easily testable using Mockito without launching a real database."*

### Q2: How does Spring Data JPA execute queries without SQL code?
> **Answer:**  
> *"Spring Data JPA uses method name parsing and proxy classes at runtime. For example, when it sees `findByAvailableTrue()`, it automatically parses the method name and generates `SELECT * FROM food_items WHERE available = true` through Hibernate ORM."*

### Q3: What is the purpose of `@RestControllerAdvice`?
> **Answer:**  
> *"It provides centralized, cross-cutting exception handling for all `@RestController` classes. Instead of writing try-catch blocks in every endpoint, exceptions like `InvalidFoodPriceException` bubble up to `GlobalExceptionHandler`, which formats a standardized JSON error response with the correct HTTP status code."*

### Q4: How are database credentials protected?
> **Answer:**  
> *"In `application.properties`, we use Spring property expressions like `spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:}` and an optional local import `application-local.properties`. Both `.env` and `application-local.properties` are listed in `.gitignore` so passwords are never committed to GitHub."*

### Q5: How do the fulfillment options calculate totals immediately?
> **Answer:**  
> *"In vanilla JavaScript, clicking any fulfillment card triggers `setFulfillment()`, which updates the active state, toggles the relevant DOM container (`display: block/none`), and immediately invokes `updateBillCalculations()`. In the React version, `fulfillmentOption` is managed via React `useState`, triggering an instant re-render of the itemized bill and grand total."*

