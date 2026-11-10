package com.quickbite.fooddelivery.controller;

import com.quickbite.fooddelivery.entity.FoodItem;
import com.quickbite.fooddelivery.service.FoodService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST Controller for managing FoodItem endpoints.
 * Keeps business logic strictly in the FoodService layer.
 */
@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins = "*") // Allows calls from frontend (HTML/JS/React) without CORS issues
public class FoodItemController {

    private final FoodService foodService;

    public FoodItemController(FoodService foodService) {
        this.foodService = foodService;
    }

    /**
     * GET /api/foods
     * Fetches all food items, with optional ?availableOnly=true filter parameter.
     */
    @GetMapping
    public ResponseEntity<List<FoodItem>> getAllFoods(
            @RequestParam(required = false, defaultValue = "false") boolean availableOnly) {
        if (availableOnly) {
            return ResponseEntity.ok(foodService.getAvailableFoodItems());
        }
        return ResponseEntity.ok(foodService.getAllFoodItems());
    }

    /**
     * GET /api/foods/available
     * Dedicated endpoint returning ONLY currently available food items (Business Rule 2).
     */
    @GetMapping("/available")
    public ResponseEntity<List<FoodItem>> getAvailableFoods() {
        return ResponseEntity.ok(foodService.getAvailableFoodItems());
    }

    /**
     * GET /api/foods/{id}
     * Fetches a specific food item by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<FoodItem> getFoodById(@PathVariable Long id) {
        FoodItem foodItem = foodService.getFoodItemById(id);
        return ResponseEntity.ok(foodItem);
    }

    /**
     * POST /api/foods
     * Adds a new food item.
     * Price validation is handled by FoodService (Business Rule 1).
     * Returns HTTP 201 Created on success.
     */
    @PostMapping
    public ResponseEntity<FoodItem> addFood(@RequestBody FoodItem foodItem) {
        FoodItem createdItem = foodService.addFoodItem(foodItem);
        return new ResponseEntity<>(createdItem, HttpStatus.CREATED);
    }
}
