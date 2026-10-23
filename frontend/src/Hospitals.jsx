
import { useEffect, useState } from 'react';

const API = 'http://192.168.1.10:8080/api/hospitals';

export default function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;

    async function fetchHospitals() {
      try {
        const response = await fetch(API);

        if (!response.ok) {
          throw new Error('Hospitals could not be loaded.');
        }

        const data = await response.json();

        if (active) {
          setHospitals(Array.isArray(data) ? data : []);
        }
      } catch {
        if (active) {
          setError('Hospitals load zale nahit. Backend check kara.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchHospitals();

    return () => {
      active = false;
    };
  }, []);

  const filteredHospitals = hospitals.filter((hospital) => {
    const query = search.trim().toLowerCase();

    if (!query) return true;

    return [
      hospital.name,
      hospital.address,
      hospital.city,
    ].some((value) => value?.toLowerCase().includes(query));
  });

  return (
    <main className="hospitals-page">
      <section className="hospitals-hero">
        <span className="eyebrow">OUR HOSPITAL NETWORK</span>

        <h1>
          Find hospitals.
          <br />
          <span>Explore your options.</span>
        </h1>

        <p>
          Explore hospital information available on MediCompare
          and compare listed treatment prices before making a decision.
        </p>

        <div className="hospitals-hero-meta">
          <span className="hospital-meta-icon">✚</span>
          <div>
            <strong>
              {loading ? 'Loading hospitals...' : `${hospitals.length} hospitals listed`}
            </strong>
            <span>Hospital information from our database</span>
          </div>
        </div>
      </section>

      <section className="hospitals-directory">
        <div className="hospitals-heading">
          <div>
            <span className="eyebrow">HOSPITAL DIRECTORY</span>
            <h2>Explore hospitals</h2>
            <p>Search by hospital name or available location.</p>
          </div>

          {!loading && (
            <span className="hospital-count-badge">
              {filteredHospitals.length} results
            </span>
          )}
        </div>

        <div className="hospital-search">
          <span aria-hidden="true">⌕</span>

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search hospital or location..."
            aria-label="Search hospitals"
          />

          {search && (
            <button type="button" onClick={() => setSearch('')}>
              Clear
            </button>
          )}
        </div>

        {loading && (
          <p className="hospitals-status">Loading hospitals...</p>
        )}

        {error && (
          <p className="message error">{error}</p>
        )}

        {!loading && !error && filteredHospitals.length > 0 && (
          <div className="hospitals-grid">
            {filteredHospitals.map((hospital, index) => {
              const location =
                hospital.address || hospital.city || 'Location unavailable';

              return (
                <article className="directory-card" key={hospital.id}>
                  <div className="directory-card-top">
                    <span className="directory-hospital-icon">✚</span>
                    <span className="directory-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <span className="directory-label">HOSPITAL</span>

                  <h3>{hospital.name || 'Unnamed hospital'}</h3>

                  <div className="directory-location">
                    <span aria-hidden="true">⌖</span>
                    <span>{location}</span>
                  </div>

                  {hospital.city && (
                    <span className="directory-city">
                      {hospital.city}
                    </span>
                  )}

                  <div className="directory-card-footer">
                    <span>View treatment prices</span>

                    <a
                      href={`/compare`}
                      aria-label={`Compare treatment prices for ${hospital.name || 'hospital'}`}
                    >
                      →
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && !error && filteredHospitals.length === 0 && (
          <div className="hospitals-empty">
            <span aria-hidden="true">⌕</span>
            <h3>No hospitals found</h3>
            <p>
              {hospitals.length
                ? 'Try another hospital name or location.'
                : 'There are no hospitals in the database yet.'}
            </p>

            {search && (
              <button type="button" onClick={() => setSearch('')}>
                Clear search
              </button>
            )}
          </div>
        )}
      </section>

      <p className="hospitals-disclaimer">
        Hospital information is based on the available demo database.
        Confirm details and treatment prices directly with each hospital.
      </p>
    </main>
  );
}
