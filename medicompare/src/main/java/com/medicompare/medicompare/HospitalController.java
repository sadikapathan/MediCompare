
package com.medicompare.medicompare;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174"
})public class HospitalController {

    private final HospitalRepository hospitalRepository;

    public HospitalController(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
    }

    // Get all hospitals or search by city
    @GetMapping
    public List<Hospital> getHospitals(
            @RequestParam(required = false) String city) {

        if (city != null && !city.isBlank()) {
            return hospitalRepository.findByCityIgnoreCase(city);
        }

        return hospitalRepository.findAll();
    }

    // Add a new hospital
    @PostMapping
    public Hospital addHospital(@RequestBody Hospital hospital) {
        return hospitalRepository.save(hospital);
    }
}
