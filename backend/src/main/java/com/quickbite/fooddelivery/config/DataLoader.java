package com.quickbite.fooddelivery.config;

import com.quickbite.fooddelivery.entity.FoodItem;
import com.quickbite.fooddelivery.entity.Restaurant;
import com.quickbite.fooddelivery.repository.FoodItemRepository;
import com.quickbite.fooddelivery.repository.RestaurantRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * Seeds initial sample data into the H2 in-memory database on application startup.
 * Ensures GET endpoints return realistic data right away for viva demonstrations.
 */
@Component
public class DataLoader implements CommandLineRunner {

    private final RestaurantRepository restaurantRepository;
    private final FoodItemRepository foodItemRepository;

    public DataLoader(RestaurantRepository restaurantRepository, FoodItemRepository foodItemRepository) {
        this.restaurantRepository = restaurantRepository;
        this.foodItemRepository = foodItemRepository;
    }

    @Override
    public void run(String... args) {
        // Seed Restaurants
        Restaurant r1 = new Restaurant("The Pizza Palace", "Italian", 4.7);
        Restaurant r2 = new Restaurant("Royal Biryani House", "Indian", 4.5);
        Restaurant r3 = new Restaurant("Burger Bistro", "American", 4.3);
        Restaurant r4 = new Restaurant("Wok & Roll", "Asian", 4.6);

        restaurantRepository.saveAll(Arrays.asList(r1, r2, r3, r4));

        // Seed Food Items (Notice item 5 is unavailable to demonstrate Business Rule 2)
        FoodItem f1 = new FoodItem(
                "Margherita Pizza",
                "Classic tomato sauce, fresh mozzarella, and aromatic basil",
                12.99,
                "Pizza",
                true
        );

        FoodItem f2 = new FoodItem(
                "Hyderabadi Chicken Biryani",
                "Aromatic basmati rice cooked with tender spiced chicken and saffron",
                14.50,
                "Biryani",
                true
        );

        FoodItem f3 = new FoodItem(
                "Cheeseburger Deluxe",
                "Grilled beef patty with melted cheddar, crisp lettuce, and special sauce",
                9.99,
                "Burger",
                true
        );

        FoodItem f4 = new FoodItem(
                "Crispy French Fries",
                "Golden salted crispy potato fries served with dip",
                4.50,
                "Sides",
                true
        );

        FoodItem f5 = new FoodItem(
                "Chocolate Lava Cake",
                "Warm chocolate cake with a molten center (Currently Out of Stock)",
                6.50,
                "Dessert",
                false // Unavailable item to demonstrate filtering
        );

        FoodItem f6 = new FoodItem(
                "Mango Lassi",
                "Refreshing sweet yogurt smoothie blended with ripe Alphonso mangoes",
                3.99,
                "Beverages",
                true
        );

        foodItemRepository.saveAll(Arrays.asList(f1, f2, f3, f4, f5, f6));

        System.out.println(">>> Sample data seeded successfully into H2 Database!");
        System.out.println(">>> Seeded " + restaurantRepository.count() + " restaurants and " + foodItemRepository.count() + " food items.");
    }
}
