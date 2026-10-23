
import { useState } from 'react';

const API = 'http://192.168.1.10:8080/api';

export default function Admin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [busy, setBusy] = useState(false);

  const [treatments, setTreatments] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [hospitalId, setHospitalId] = useState('1');
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('');

  function authHeaders(json = false) {
    const headers = {
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
    };

    if (json) headers['Content-Type'] = 'application/json';
    return headers;
  }

  function showMessage(text, type = 'info') {
    setMessage(text);
    setMessageType(type);
  }

  async function loadData() {
    const [treatmentResponse, hospitalResponse] = await Promise.all([
      fetch(`${API}/treatments`),
      fetch(`${API}/hospitals`),
    ]);

    if (!treatmentResponse.ok || !hospitalResponse.ok) {
      throw new Error('Data load failed');
    }

    const treatmentData = await treatmentResponse.json();
    const hospitalData = await hospitalResponse.json();

    setTreatments(treatmentData);
    setHospitals(hospitalData);

    if (hospitalData.length > 0) {
      setHospitalId((current) =>
        hospitalData.some((hospital) => String(hospital.id) === current)
          ? current
          : String(hospitalData[0].id)
      );
    }
  }

  async function login(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    try {
      const response = await fetch(`${API}/admin/check`, {
        headers: authHeaders(),
      });

      if (!response.ok) {
        showMessage('Login failed. Username/password check kara.', 'error');
        return;
      }

      await loadData();
      setLoggedIn(true);
      showMessage('Login successful!', 'success');
    } catch {
      showMessage('Backend connection failed. Backend check kara.', 'error');
    } finally {
      setBusy(false);
    }
  }

  function resetForm() {
    setName('');
    setPrice('');
    setEditingId(null);
  }

  function startEdit(item) {
    setEditingId(item.id);
    setName(item.name ?? '');
    setPrice(String(item.price ?? ''));
    setHospitalId(String(item.hospital?.id ?? hospitals[0]?.id ?? ''));
    showMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function saveTreatment(event) {
    event.preventDefault();

    if (!name.trim() || !price || Number(price) <= 0 || !hospitalId) {
      showMessage('Treatment name, valid price ani hospital select kara.', 'error');
      return;
    }

    setBusy(true);
    setMessage('');

    try {
      const editing = editingId !== null;

      const response = await fetch(
        editing
          ? `${API}/treatments/${editingId}`
          : `${API}/treatments`,
        {
          method: editing ? 'PUT' : 'POST',
          headers: authHeaders(true),
          body: JSON.stringify({
            name: name.trim(),
            price: Number(price),
            hospital: { id: Number(hospitalId) },
          }),
        }
      );

      if (response.status === 401 || response.status === 403) {
        setLoggedIn(false);
        setPassword('');
        showMessage('Access denied. Please login again.', 'error');
        return;
      }

      if (!response.ok) throw new Error('Save failed');

      resetForm();
      await loadData();
      showMessage(
        editing ? 'Treatment updated successfully!' : 'Treatment added successfully!',
        'success'
      );
    } catch {
      showMessage('Save failed. Backend ani treatment details check kara.', 'error');
    } finally {
      setBusy(false);
    }
  }

  async function deleteTreatment(item) {
    const confirmed = window.confirm(
      `Delete "${item.name}" from ${item.hospital?.name ?? 'this hospital'}?`
    );

    if (!confirmed) return;

    setBusy(true);
    setMessage('');

    try {
      const response = await fetch(`${API}/treatments/${item.id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      if (response.status === 401 || response.status === 403) {
        setLoggedIn(false);
        setPassword('');
        showMessage('Access denied. Please login again.', 'error');
        return;
      }

      if (!response.ok) throw new Error('Delete failed');

      if (editingId === item.id) resetForm();
      await loadData();
      showMessage('Treatment deleted successfully!', 'success');
    } catch {
      showMessage('Delete failed. Please check backend.', 'error');
    } finally {
      setBusy(false);
    }
  }

  const filteredTreatments = treatments.filter((item) => {
    const query = filter.trim().toLowerCase();

    return (
      !query ||
      item.name?.toLowerCase().includes(query) ||
      item.hospital?.name?.toLowerCase().includes(query)
    );
  });

  const uniqueTreatmentCount = new Set(
    treatments.map((item) => item.name?.toLowerCase()).filter(Boolean)
  ).size;

  return (
    <main className="admin-page">
      <section className="admin-hero">
        <div>
          <span className="eyebrow">MEDICOMPARE MANAGEMENT</span>
          <h1>Admin Dashboard</h1>
          <p>Manage hospital treatment prices from one place.</p>
        </div>
        <div className="admin-hero-icon" aria-hidden="true">✚</div>
      </section>

      {!loggedIn ? (
        <section className="admin-login-card">
          <div className="admin-section-icon">♙</div>
          <span className="eyebrow">ADMIN ACCESS</span>
          <h2>Welcome back</h2>
          <p>Login to manage hospital treatments and prices.</p>

          <form className="admin-form" onSubmit={login}>
            <label htmlFor="admin-username">Username</label>
            <input
              id="admin-username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              required
            />

            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              required
            />

            <button className="admin-primary-btn" type="submit" disabled={busy}>
              {busy ? 'Checking...' : 'Login to Dashboard →'}
            </button>
          </form>
        </section>
      ) : (
        <>
          <section className="admin-stats">
            <article className="admin-stat-card">
              <span className="admin-stat-icon">✚</span>
              <div>
                <span>Registered Hospitals</span>
                <strong>{hospitals.length}</strong>
              </div>
            </article>

            <article className="admin-stat-card">
              <span className="admin-stat-icon">▤</span>
              <div>
                <span>Treatment Records</span>
                <strong>{treatments.length}</strong>
              </div>
            </article>

            <article className="admin-stat-card">
              <span className="admin-stat-icon">⌕</span>
              <div>
                <span>Unique Treatments</span>
                <strong>{uniqueTreatmentCount}</strong>
              </div>
            </article>
          </section>

          <section className="admin-panel-card" id="treatment-form">
            <div className="admin-panel-heading">
              <div>
                <span className="eyebrow">
                  {editingId !== null ? 'UPDATE RECORD' : 'ADD NEW RECORD'}
                </span>
                <h2>{editingId !== null ? 'Edit Treatment' : 'Add a Treatment'}</h2>
                <p>Enter the treatment details and hospital price.</p>
              </div>
              <span className="admin-panel-icon">＋</span>
            </div>

            <form className="admin-form admin-treatment-form" onSubmit={saveTreatment}>
              <div className="admin-field">
                <label htmlFor="treatment-name">Treatment Name</label>
                <input
                  id="treatment-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Blood Test"
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor="treatment-price">Price (₹)</label>
                <input
                  id="treatment-price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="e.g. 500"
                  required
                />
              </div>

              <div className="admin-field">
                <label htmlFor="treatment-hospital">Hospital</label>
                <select
                  id="treatment-hospital"
                  value={hospitalId}
                  onChange={(event) => setHospitalId(event.target.value)}
                  required
                  disabled={hospitals.length === 0}
                >
                  {hospitals.length === 0 && (
                    <option value="">No hospitals available</option>
                  )}
                  {hospitals.map((hospital) => (
                    <option key={hospital.id} value={String(hospital.id)}>
                      {hospital.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-actions">
                <button
                  className="admin-primary-btn"
                  type="submit"
                  disabled={busy || hospitals.length === 0}
                >
                  {busy
                    ? 'Please wait...'
                    : editingId !== null
                      ? '✓ Save Changes'
                      : '+ Add Treatment'}
                </button>

                {editingId !== null && (
                  <button
                    className="admin-secondary-btn"
                    type="button"
                    onClick={resetForm}
                    disabled={busy}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="admin-panel-card admin-records-panel">
            <div className="admin-panel-heading">
              <div>
                <span className="eyebrow">DATABASE RECORDS</span>
                <h2>All Treatments</h2>
                <p>Review and manage the prices stored in your database.</p>
              </div>
              <span className="admin-record-count">{treatments.length} records</span>
            </div>

            <div className="admin-record-search">
              <span aria-hidden="true">⌕</span>
              <input
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                placeholder="Search treatment or hospital..."
                aria-label="Search treatment records"
              />
            </div>

            {filteredTreatments.length === 0 ? (
              <div className="admin-empty">
                <span aria-hidden="true">▤</span>
                <h3>No treatments found</h3>
                <p>Try another search or add a new treatment above.</p>
              </div>
            ) : (
              <div className="admin-treatment-list">
                {filteredTreatments.map((item) => (
                  <article className="admin-treatment-row" key={item.id}>
                    <div className="admin-record-icon">▤</div>

                    <div className="admin-record-info">
                      <h3>{item.name}</h3>
                      <p>{item.hospital?.name ?? 'Hospital not assigned'}</p>
                    </div>

                    <strong className="admin-record-price">
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </strong>

                    <div className="admin-record-actions">
                      <button
                        className="treatment-action-btn edit-btn"
                        type="button"
                        onClick={() => startEdit(item)}
                        disabled={busy}
                        title="Edit treatment"
                      >
                        <span aria-hidden="true">✏️</span>
                        <span>Edit</span>
                      </button>

                      <button
                        className="treatment-action-btn delete-btn"
                        type="button"
                        onClick={() => deleteTreatment(item)}
                        disabled={busy}
                        title="Delete treatment"
                      >
                        <span aria-hidden="true">🗑️</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <div className="admin-logout-row">
            <button
              className="admin-secondary-btn"
              type="button"
              onClick={() => {
                setLoggedIn(false);
                setPassword('');
                resetForm();
                setFilter('');
                showMessage('');
              }}
              disabled={busy}
            >
              Log out
            </button>
          </div>
        </>
      )}

      {message && (
        <p className={`admin-message ${messageType}`} role="status">
          {message}
        </p>
      )}
    </main>
  );
}
