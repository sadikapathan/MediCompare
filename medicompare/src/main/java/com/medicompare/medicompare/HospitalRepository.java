
package com.medicompare.medicompare;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    List<Hospital> findByCityIgnoreCase(String city);
}
