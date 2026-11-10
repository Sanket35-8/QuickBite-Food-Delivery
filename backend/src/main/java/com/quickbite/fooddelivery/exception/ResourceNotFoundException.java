package com.quickbite.fooddelivery.exception;

/**
 * Custom runtime exception thrown when a requested resource (e.g., FoodItem, Restaurant) is not found.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
