
package com.medicompare.medicompare;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.Map;

import org.junit.jupiter.api.Test;

class MedicompareApplicationTests {

    @Test
    void healthCheckReturnsCorrectStatus() {
        HealthController controller = new HealthController();

        Map<String, String> response = controller.healthCheck();

        assertNotNull(response);
        assertEquals("UP", response.get("status"));
        assertEquals("MediCompare", response.get("application"));
        assertEquals(
            "MediCompare API is running successfully!",
            response.get("message")
        );
    }
}
