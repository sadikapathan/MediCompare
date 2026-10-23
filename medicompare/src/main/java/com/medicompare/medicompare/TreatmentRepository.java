
package com.medicompare.medicompare;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TreatmentRepository extends JpaRepository<Treatment, Long> {

    List<Treatment> findByNameContainingIgnoreCase(String name);
}
