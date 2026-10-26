
package com.medicompare.medicompare;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public Map<String, String> healthCheck() {
        return Map.of(
            "status", "UP",
            "application", "MediCompare",
            "message", "MediCompare API is running successfully!"
        );
    }
}
