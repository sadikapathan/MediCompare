
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function Compare() {
  const [search, setSearch] = useState('X-Ray');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();

  async function comparePrices(event, treatmentName = search) {
    event?.preventDefault();

    const name = treatmentName.trim();
    if (!name) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const url =
        'http://192.168.1.10:8080/api/treatments/compare?name=' +
        encodeURIComponent(name);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Prices could not be loaded.');
      }

      const data = await response.json();
      setResults(data.treatments || []);
      setSearch(name);
    } catch {
      setError('Prices load zale nahit. Backend check kara.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const treatmentName = searchParams.get('name');
    comparePrices(null, treatmentName || 'X-Ray');
  }, [searchParams]);

  const sortedResults = [...results].sort(
    (a, b) => Number(a.price) - Number(b.price)
  );

  const prices = results
    .map((item) => Number(item.price))
    .filter((price) => Number.isFinite(price));

  const cheapest = prices.length ? Math.min(...prices) : null;
  const highest = prices.length ? Math.max(...prices) : null;
  const savings =
    cheapest !== null && highest !== null ? highest - cheapest : 0;

  return (
    <main className="compare-page">
      <section className="compare-hero">
        <span className="eyebrow">SMART HEALTHCARE COMPARISON</span>

        <h1>
          Compare Hospital Prices,
          <br />
          <span>Choose Smarter.</span>
        </h1>

        <p>
          Find treatment prices across hospitals and compare your options
          before making a decision.
        </p>

        <form className="compare-search" onSubmit={comparePrices}>
          <span className="search-icon" aria-hidden="true">⌕</span>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search X-Ray, Blood Test, MRI Scan..."
            aria-label="Treatment name"
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Compare Prices →'}
          </button>
        </form>

        <div className="compare-trust">
          <span>✓ Easy comparison</span>
          <span>✓ Hospital-wise prices</span>
          <span>✓ Clear pricing</span>
        </div>
      </section>

      <section className="compare-results">
        {error && <p className="message error">{error}</p>}

        {loading && (
          <div className="compare-status">
            <span className="loading-dot" />
            Comparing treatment prices...
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <div className="comparison-heading">
              <div>
                <span className="eyebrow">YOUR SEARCH RESULTS</span>
                <h2>{search}</h2>
                <p>{results.length} hospital price options found</p>
              </div>

              {savings > 0 && (
                <div className="savings-card">
                  <span>Potential price difference</span>
                  <strong>₹{savings.toLocaleString('en-IN')}</strong>
                </div>
              )}
            </div>

            <div className="comparison-summary">
              <div className="summary-icon">₹</div>
              <div>
                <span>Lowest listed price</span>
                <strong>₹{cheapest.toLocaleString('en-IN')}</strong>
              </div>
              <p>Compare the listed rates below.</p>
            </div>

            <div className="hospital-list">
              {sortedResults.map((item, index) => {
                const isCheapest = Number(item.price) === cheapest;

                return (
                  <article
                    className={`hospital-card ${isCheapest ? 'cheapest-card' : ''}`}
                    key={item.id}
                  >
                    <div className="hospital-symbol" aria-hidden="true">
                      ✚
                    </div>

                    <div className="hospital-info">
                      <div className="hospital-title-row">
                        <h3>{item.hospital?.name || 'Hospital not linked'}</h3>
                        {isCheapest && (
                          <span className="best-price">BEST PRICE</span>
                        )}
                      </div>

                      <p>
                        {item.hospital?.address ||
                          item.hospital?.city ||
                          'Location unavailable'}
                      </p>

                      <span className="treatment-name">{item.name}</span>
                    </div>

                    <div className="price-info">
                      <span className="price-caption">Listed price</span>
                      <strong>
                        ₹{Number(item.price).toLocaleString('en-IN')}
                      </strong>
                      <span className="option-number">
                        Option {index + 1}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>

            <p className="disclaimer">
              Demo prices only. Confirm actual rates, availability and
              inclusions directly with the hospital.
            </p>
          </>
        )}

        {!loading && !results.length && !error && (
          <div className="compare-empty">
            <div aria-hidden="true">⌕</div>
            <h2>No prices found</h2>
            <p>Try another treatment name, such as X-Ray or Blood Test.</p>
          </div>
        )}
      </section>
    </main>
  );
}
