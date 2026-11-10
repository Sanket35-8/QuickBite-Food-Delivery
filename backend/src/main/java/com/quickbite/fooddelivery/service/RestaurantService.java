package com.quickbite.fooddelivery.service;

import com.quickbite.fooddelivery.entity.Restaurant;
import com.quickbite.fooddelivery.exception.ResourceNotFoundException;
import com.quickbite.fooddelivery.repository.RestaurantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for Restaurant business logic.
 * Sits between Controller and Repository.
 */
@Service
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    // Constructor injection (recommended best practice in Spring)
    public RestaurantService(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    /**
     * Retrieve all restaurants.
     */
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    /**
     * Retrieve a specific restaurant by its ID.
     */
    public Restaurant getRestaurantById(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with ID: " + id));
    }

    /**
     * Save a new restaurant.
     */
    public Restaurant addRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }
}
