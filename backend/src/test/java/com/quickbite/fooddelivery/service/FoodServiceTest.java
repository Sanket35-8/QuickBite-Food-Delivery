package com.quickbite.fooddelivery.service;

import com.quickbite.fooddelivery.entity.FoodItem;
import com.quickbite.fooddelivery.exception.InvalidFoodPriceException;
import com.quickbite.fooddelivery.exception.ResourceNotFoundException;
import com.quickbite.fooddelivery.repository.FoodItemRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Unit tests for FoodService business logic using JUnit 5 and Mockito.
 */
@ExtendWith(MockitoExtension.class)
public class FoodServiceTest {

    @Mock
    private FoodItemRepository foodItemRepository;

    @InjectMocks
    private FoodService foodService;

    // =========================================================================
    // BUSINESS RULE 1: Price must be strictly greater than zero (> 0)
    // =========================================================================

    @Test
    @DisplayName("Reject adding food item when price is zero")
    void addFoodItem_withZeroPrice_shouldThrowInvalidFoodPriceException() {
        FoodItem invalidItem = new FoodItem("Free Fries", "Promotional side item", 0.0, "Sides", true);

        InvalidFoodPriceException exception = assertThrows(
                InvalidFoodPriceException.class,
                () -> foodService.addFoodItem(invalidItem),
                "Should throw InvalidFoodPriceException when price is zero"
        );

        assertTrue(exception.getMessage().contains("Food price must be greater than zero"));
        // Ensure repository was never called to persist invalid data
        verify(foodItemRepository, never()).save(any(FoodItem.class));
    }

    @Test
    @DisplayName("Reject adding food item when price is negative")
    void addFoodItem_withNegativePrice_shouldThrowInvalidFoodPriceException() {
        FoodItem invalidItem = new FoodItem("Discount Drink", "Invalid negative price", -2.50, "Beverages", true);

        InvalidFoodPriceException exception = assertThrows(
                InvalidFoodPriceException.class,
                () -> foodService.addFoodItem(invalidItem),
                "Should throw InvalidFoodPriceException when price is negative"
        );

        assertTrue(exception.getMessage().contains("Food price must be greater than zero"));
        verify(foodItemRepository, never()).save(any(FoodItem.class));
    }

    @Test
    @DisplayName("Reject adding food item when price is null")
    void addFoodItem_withNullPrice_shouldThrowInvalidFoodPriceException() {
        FoodItem invalidItem = new FoodItem("Mystery Snack", "Price not provided", null, "Snacks", true);

        assertThrows(
                InvalidFoodPriceException.class,
                () -> foodService.addFoodItem(invalidItem)
        );

        verify(foodItemRepository, never()).save(any(FoodItem.class));
    }

    @Test
    @DisplayName("Successfully save food item when price is positive")
    void addFoodItem_withValidPrice_shouldSaveAndReturnFoodItem() {
        FoodItem validItem = new FoodItem("Classic Burger", "Juicy grilled burger", 8.99, "Burger", true);
        FoodItem savedItem = new FoodItem(1L, "Classic Burger", "Juicy grilled burger", 8.99, "Burger", true);

        when(foodItemRepository.save(any(FoodItem.class))).thenReturn(savedItem);

        FoodItem result = foodService.addFoodItem(validItem);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Classic Burger", result.getName());
        assertEquals(8.99, result.getPrice());
        verify(foodItemRepository, times(1)).save(validItem);
    }

    // =========================================================================
    // BUSINESS RULE 2: Only available food items should be returned
    // =========================================================================

    @Test
    @DisplayName("Return only available food items")
    void getAvailableFoodItems_shouldReturnOnlyAvailableItems() {
        FoodItem item1 = new FoodItem(1L, "Pizza", "Tasty pizza", 12.0, "Pizza", true);
        FoodItem item2 = new FoodItem(2L, "Pasta", "Creamy pasta", 10.0, "Pasta", true);

        when(foodItemRepository.findByAvailableTrue()).thenReturn(Arrays.asList(item1, item2));

        List<FoodItem> availableItems = foodService.getAvailableFoodItems();

        assertNotNull(availableItems);
        assertEquals(2, availableItems.size());
        assertTrue(availableItems.stream().allMatch(FoodItem::getAvailable));
        verify(foodItemRepository, times(1)).findByAvailableTrue();
    }

    // =========================================================================
    // EXCEPTION HANDLING: Missing food item ID
    // =========================================================================

    @Test
    @DisplayName("Throw ResourceNotFoundException when food item ID does not exist")
    void getFoodItemById_withNonExistentId_shouldThrowResourceNotFoundException() {
        Long nonExistentId = 999L;
        when(foodItemRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> foodService.getFoodItemById(nonExistentId)
        );

        assertTrue(exception.getMessage().contains("Food item not found with ID: 999"));
        verify(foodItemRepository, times(1)).findById(nonExistentId);
    }
}
