
package com.medicompare.medicompare;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/treatments")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5174"
})
public class TreatmentController {

    private final TreatmentRepository treatmentRepository;
    private final HospitalRepository hospitalRepository;

    public TreatmentController(
            TreatmentRepository treatmentRepository,
            HospitalRepository hospitalRepository) {
        this.treatmentRepository = treatmentRepository;
        this.hospitalRepository = hospitalRepository;
    }

    @GetMapping
    public List<Treatment> getTreatments(
            @RequestParam(required = false) String name) {
        if (name != null && !name.isBlank()) {
            return treatmentRepository
                    .findByNameContainingIgnoreCase(name);
        }
        return treatmentRepository.findAll();
    }

    @GetMapping("/compare")
    public PriceComparison compareTreatments(
            @RequestParam String name) {

        List<Treatment> treatments = treatmentRepository
                .findByNameContainingIgnoreCase(name)
                .stream()
                .filter(t -> t.getHospital() != null)
                .filter(t -> t.getPrice() != null)
                .toList();

        if (treatments.isEmpty()) {
            throw new RuntimeException(
                    "No treatments with hospital prices found");
        }

        BigDecimal minPrice = treatments.stream()
                .map(Treatment::getPrice)
                .min(BigDecimal::compareTo)
                .orElseThrow();

        BigDecimal maxPrice = treatments.stream()
                .map(Treatment::getPrice)
                .max(BigDecimal::compareTo)
                .orElseThrow();

        String cheapestHospital = treatments.stream()
                .min(Comparator.comparing(Treatment::getPrice))
                .map(t -> t.getHospital().getName())
                .orElse("Unknown");

        BigDecimal difference = maxPrice.subtract(minPrice);

        return new PriceComparison(
                treatments, difference, cheapestHospital);
    }

    @PostMapping
    public Treatment addTreatment(
            @Valid @RequestBody Treatment treatment) {

        if (treatment.getHospital() != null
                && treatment.getHospital().getId() != null) {
            Hospital hospital = hospitalRepository
                    .findById(treatment.getHospital().getId())
                    .orElseThrow(() ->
                            new RuntimeException("Hospital not found"));
            treatment.setHospital(hospital);
        }

        return treatmentRepository.save(treatment);
    }

    @PutMapping("/{id}")
    public Treatment updateTreatment(
            @PathVariable Long id,
            @Valid @RequestBody Treatment updatedTreatment) {

        Treatment existing = treatmentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Treatment not found"));

        if (updatedTreatment.getHospital() == null
                || updatedTreatment.getHospital().getId() == null) {
            throw new IllegalArgumentException("Hospital is required");
        }

        Hospital hospital = hospitalRepository
                .findById(updatedTreatment.getHospital().getId())
                .orElseThrow(() ->
                        new RuntimeException("Hospital not found"));

        existing.setName(updatedTreatment.getName().trim());
        existing.setPrice(updatedTreatment.getPrice());
        existing.setHospital(hospital);

        return treatmentRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public void deleteTreatment(@PathVariable Long id) {
        Treatment existing = treatmentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Treatment not found"));

        treatmentRepository.delete(existing);
    }
}
