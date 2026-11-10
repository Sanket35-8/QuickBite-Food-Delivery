package com.quickbite.fooddelivery;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Basic integration test to verify that the Spring ApplicationContext loads without any errors.
 */
@SpringBootTest
class QuickBiteApplicationTests {

    @Test
    @DisplayName("Verify Spring Boot application context loads successfully")
    void contextLoads() {
        // Test passes if application context successfully initializes
    }
}
