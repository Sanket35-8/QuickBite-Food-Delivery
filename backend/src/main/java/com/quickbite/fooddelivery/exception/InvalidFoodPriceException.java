package com.quickbite.fooddelivery.exception;

/**
 * Custom runtime exception thrown when a food item's price is zero or negative.
 */
public class InvalidFoodPriceException extends RuntimeException {

    public InvalidFoodPriceException(String message) {
        super(message);
    }
}
