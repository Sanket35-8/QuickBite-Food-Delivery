package com.quickbite.fooddelivery.repository;

import com.quickbite.fooddelivery.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for Restaurant entity.
 * Provides standard CRUD database operations out of the box through Spring Data JPA.
 */
@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
}
