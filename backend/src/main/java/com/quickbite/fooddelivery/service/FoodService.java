package com.quickbite.fooddelivery.service;

import com.quickbite.fooddelivery.entity.FoodItem;
import com.quickbite.fooddelivery.exception.InvalidFoodPriceException;
import com.quickbite.fooddelivery.exception.ResourceNotFoundException;
import com.quickbite.fooddelivery.repository.FoodItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for FoodItem business logic.
 * Encapsulates core business rules for the QuickBite Food Delivery System.
 */
@Service
public class FoodService {

    private final FoodItemRepository foodItemRepository;

    // Constructor injection for dependency injection
    public FoodService(FoodItemRepository foodItemRepository) {
        this.foodItemRepository = foodItemRepository;
    }

    /**
     * Retrieve all food items regardless of availability status.
     */
    public List<FoodItem> getAllFoodItems() {
        return foodItemRepository.findAll();
    }

    /**
     * BUSINESS RULE 2:
     * Only available food items should be returned by this method.
     * Items marked with available=false are excluded from customer ordering.
     */
    public List<FoodItem> getAvailableFoodItems() {
        return foodItemRepository.findByAvailableTrue();
    }

    /**
     * Retrieve a single food item by its ID.
     * Throws ResourceNotFoundException if no item matches the ID.
     */
    public FoodItem getFoodItemById(Long id) {
        return foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item not found with ID: " + id));
    }

    /**
     * BUSINESS RULE 1:
     * Food price must be strictly greater than zero.
     * If the price is null, zero, or negative, an InvalidFoodPriceException is thrown.
     */
    public FoodItem addFoodItem(FoodItem foodItem) {
        if (foodItem == null || foodItem.getPrice() == null || foodItem.getPrice() <= 0.0) {
            String priceValue = (foodItem != null && foodItem.getPrice() != null)
                    ? String.valueOf(foodItem.getPrice())
                    : "null";
            throw new InvalidFoodPriceException("Food price must be greater than zero. Provided price: " + priceValue);
        }

        // If availability is not explicitly specified, default it to true
        if (foodItem.getAvailable() == null) {
            foodItem.setAvailable(true);
        }

        return foodItemRepository.save(foodItem);
    }
}
