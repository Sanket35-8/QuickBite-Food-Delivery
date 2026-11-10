package com.quickbite.fooddelivery.repository;

import com.quickbite.fooddelivery.entity.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for FoodItem entity.
 * Provides standard CRUD database operations and custom finder methods.
 */
@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {

    /**
     * Query method to find only items where available is true.
     * Spring Data JPA generates the SQL query automatically based on method name convention.
     */
    List<FoodItem> findByAvailableTrue();
}
