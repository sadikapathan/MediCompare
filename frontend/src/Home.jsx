
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const API = 'http://192.168.1.10:8080/api';
const features = [
  {
    icon: '₹',
    title: 'Compare Treatment Prices',
    description:
      'Compare listed prices for the same treatment across hospitals.',
    link: '/compare',
    action: 'Compare prices',
  },
  {
    icon: '✚',
    title: 'Explore Hospitals',
    description:
      'Discover hospitals and review their available location information.',
    link: '/hospitals',
    action: 'Explore hospitals',
  },
  {
    icon: '✓',
    title: 'Make Informed Choices',
    description:
      'Use available pricing information to help plan your healthcare.',
    link: '/compare',
    action: 'Get started',
  },
];

export default function Home() {
  const [treatments, setTreatments] = useState([]);
  const [treatmentPrices, setTreatmentPrices] = useState({});
  const [hospitalCount, setHospitalCount] = useState(0);
  const [priceListingCount, setPriceListingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    let active = true;

    async function loadHomeData() {
      setLoading(true);
      setError('');

      try {
        const [hospitalResponse, treatmentResponse] = await Promise.all([
          fetch(`${API}/hospitals`),
          fetch(`${API}/treatments`),
        ]);

        if (!hospitalResponse.ok || !treatmentResponse.ok) {
          throw new Error('Could not load MediCompare data.');
        }

        const [hospitalData, treatmentData] = await Promise.all([
          hospitalResponse.json(),
          treatmentResponse.json(),
        ]);

        if (!active) return;

        setHospitalCount(hospitalData.length);
        setPriceListingCount(treatmentData.length);

        const uniqueTreatments = [
          ...new Map(
            treatmentData
              .filter(
                (item) =>
                  typeof item.name === 'string' && item.name.trim()
              )
              .map((item) => {
                const name = item.name.trim();

                return [
                  name.toLowerCase(),
                  {
                    name,
                    icon: '✚',
                    description: 'Compare hospital prices',
                  },
                ];
              })
          ).values(),
        ];

        setTreatments(uniqueTreatments);

        const priceEntries = await Promise.all(
          uniqueTreatments.map(async (treatment) => {
            try {
              const response = await fetch(
                `${API}/treatments/compare?name=${encodeURIComponent(
                  treatment.name
                )}`
              );

              if (!response.ok) {
                return [treatment.name.toLowerCase(), null];
              }

              const result = await response.json();

              const prices = (result.treatments || [])
                .map((item) => Number(item.price))
                .filter(
                  (price) => Number.isFinite(price) && price >= 0
                );

              return [
                treatment.name.toLowerCase(),
                prices.length ? Math.min(...prices) : null,
              ];
            } catch {
              return [treatment.name.toLowerCase(), null];
            }
          })
        );

        if (active) {
          setTreatmentPrices(Object.fromEntries(priceEntries));
        }
      } catch (err) {
        console.error('Home data load failed:', err);

        if (active) {
          setError(
            'Data load zale nahi. Backend running aahe ka te check kara.'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadHomeData();

    return () => {
      active = false;
    };
  }, []);

  const filteredTreatments = treatments.filter((treatment) =>
    treatment.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <main className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">
            YOUR HEALTHCARE, YOUR CHOICE
          </span>

          <h1>
            Better healthcare
            <br />
            decisions start with
            <br />
            <span>price transparency.</span>
          </h1>

          <p>
            Compare listed treatment prices across hospitals,
            explore your options and make more informed healthcare
            decisions.
          </p>

          <div className="hero-actions">
            <Link className="home-compare-button" to="/compare">
              Compare Prices <span aria-hidden="true">→</span>
            </Link>

            <Link className="home-secondary-button" to="/hospitals">
              Explore Hospitals
            </Link>
          </div>

          <div className="hero-highlights">
            <span><b>✓</b> Simple price comparison</span>
            <span><b>✓</b> Hospital information</span>
            <span><b>✓</b> Easy to use</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Healthcare price comparison">
          <div className="hero-visual-top">
            <span className="hero-visual-icon">✚</span>
            <div>
              <strong>MediCompare</strong>
              <span>Smarter healthcare choices</span>
            </div>
            <span className="hero-status-dot" />
          </div>

          <div className="hero-visual-main">
            <span className="hero-visual-label">TREATMENT COMPARISON</span>
            <h3>Compare. Choose. Save.</h3>
            <p>Find listed prices for your treatment.</p>

            <div className="hero-price-row">
              <span className="hero-price-icon">✚</span>
              <div>
                <strong>Compare hospitals</strong>
                <span>Review available prices</span>
              </div>
              <span className="hero-price-arrow">→</span>
            </div>

            <div className="hero-price-row">
              <span className="hero-price-icon">₹</span>
              <div>
                <strong>Know your options</strong>
                <span>Check listed treatment rates</span>
              </div>
              <span className="hero-price-arrow">→</span>
            </div>
          </div>

          <div className="hero-visual-footer">
            <span className="hero-footer-check">✓</span>
            <span>Clear information. Better preparation.</span>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="home-stats" aria-label="MediCompare statistics">
        <article className="stat-card">
          <span className="stat-icon">✚</span>
          <div>
            <strong>{loading ? '—' : hospitalCount}</strong>
            <p>Hospitals Listed</p>
          </div>
        </article>

        <article className="stat-card">
          <span className="stat-icon">♡</span>
          <div>
            <strong>{loading ? '—' : treatments.length}</strong>
            <p>Unique Treatments</p>
          </div>
        </article>

        <article className="stat-card">
          <span className="stat-icon">₹</span>
          <div>
            <strong>{loading ? '—' : priceListingCount}</strong>
            <p>Price Listings</p>
          </div>
        </article>
      </section>

      {/* Features */}
      <section className="home-section">
        <div className="section-heading">
          <span className="eyebrow">WHY MEDICOMPARE</span>
          <h2>Healthcare prices, made simpler.</h2>
          <p>
            Everything you need to explore listed treatment prices,
            all in one place.
          </p>
        </div>

        <div className="home-features">
          {features.map((feature, index) => (
            <article className="feature-card" key={feature.title}>
              <span className="feature-number">
                0{index + 1}
              </span>

              <span className="feature-icon">{feature.icon}</span>

              <h3>{feature.title}</h3>
              <p>{feature.description}</p>

              <Link to={feature.link}>
                {feature.action} <span aria-hidden="true">→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Treatments */}
      <section className="home-section treatments-section">
        <div className="section-heading treatment-section-heading">
          <span className="eyebrow">EXPLORE YOUR OPTIONS</span>
          <h2>Find your treatment.</h2>
          <p>
            Search available treatments and compare their listed
            prices across hospitals.
          </p>
        </div>

        <form
          className="home-treatment-search"
          onSubmit={(event) => event.preventDefault()}
        >
          <span aria-hidden="true">⌕</span>

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search X-Ray, Blood Test, MRI Scan..."
            aria-label="Search treatments"
          />

          {query && (
            <button type="button" onClick={() => setQuery('')}>
              Clear
            </button>
          )}
        </form>

        {loading && (
          <p className="home-note">Loading treatments...</p>
        )}

        {error && (
          <p className="message error">{error}</p>
        )}

        {!loading && !error && (
          <>
            <div className="treatment-grid">
              {filteredTreatments.map((treatment) => {
                const price =
                  treatmentPrices[treatment.name.toLowerCase()];

                return (
                  <Link
                    className="treatment-card"
                    to={`/compare?name=${encodeURIComponent(
                      treatment.name
                    )}`}
                    key={treatment.name.toLowerCase()}
                  >
                    <div className="treatment-card-top">
                      <span className="treatment-card-icon">
                        {treatment.icon}
                      </span>
                      <span className="treatment-card-arrow">↗</span>
                    </div>

                    <h3>{treatment.name}</h3>
                    <p>Compare prices across hospitals</p>

                    <div className="treatment-lowest-price">
                      <span>Lowest listed price</span>
                      <strong>
                        {price != null
                          ? `₹${price.toLocaleString('en-IN')}`
                          : 'Check prices'}
                      </strong>
                    </div>

                    <span className="treatment-card-link">
                      Compare treatment <span aria-hidden="true">→</span>
                    </span>
                  </Link>
                );
              })}
            </div>

            {filteredTreatments.length === 0 && (
              <div className="home-note">
                {treatments.length === 0
                  ? 'No treatments available in the database yet.'
                  : 'No matching treatments found. Try another search.'}
              </div>
            )}
          </>
        )}

        {!loading && treatments.length > 0 && (
          <div className="treatments-footer">
            <Link className="home-secondary-button" to="/compare">
              View Price Comparison <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="home-section how-section">
        <div className="section-heading">
          <span className="eyebrow">HOW IT WORKS</span>
          <h2>Three steps to compare.</h2>
          <p>Get started with MediCompare in a few simple steps.</p>
        </div>

        <div className="steps-grid">
          <article className="step-card">
            <span>01</span>
            <h3>Choose a treatment</h3>
            <p>Search for the test or treatment you want to explore.</p>
          </article>

          <article className="step-card">
            <span>02</span>
            <h3>Compare hospitals</h3>
            <p>Review the listed prices from available hospitals.</p>
          </article>

          <article className="step-card">
            <span>03</span>
            <h3>Confirm the details</h3>
            <p>Contact the hospital to verify current prices and inclusions.</p>
          </article>
        </div>

        <div className="home-cta">
          <span className="eyebrow">START EXPLORING</span>
          <h2>Make your next healthcare decision more informed.</h2>
          <p>
            Explore available treatment prices and hospital information
            on MediCompare.
          </p>

          <Link className="home-compare-button" to="/compare">
            Start Comparing <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <p className="home-note home-disclaimer">
        
      </p>
    </main>
  );
}
