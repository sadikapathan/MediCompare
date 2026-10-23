
package com.medicompare.medicompare;

import java.math.BigDecimal;
import java.util.List;

public class PriceComparison {

    private List<Treatment> treatments;
    private BigDecimal priceDifference;
    private String cheapestHospital;

    public PriceComparison() {
    }

    public PriceComparison(
            List<Treatment> treatments,
            BigDecimal priceDifference,
            String cheapestHospital) {
        this.treatments = treatments;
        this.priceDifference = priceDifference;
        this.cheapestHospital = cheapestHospital;
    }

    public List<Treatment> getTreatments() {
        return treatments;
    }

    public BigDecimal getPriceDifference() {
        return priceDifference;
    }

    public String getCheapestHospital() {
        return cheapestHospital;
    }
}
