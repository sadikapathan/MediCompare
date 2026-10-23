
import { Routes, Route, Link } from 'react-router-dom';
import Home from './Home.jsx';
import Compare from './Compare.jsx';
import Hospitals from './Hospitals.jsx';
import Admin from './Admin.jsx';
import './App.css';

export default function App() {
  return (
    <>
      <header className="navbar">
        <Link className="brand" to="/">
          <span className="brand-icon">✚</span>
          <span>MediCompare</span>
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/compare">Compare Prices</Link>
          <Link to="/hospitals">Hospitals</Link>
          <Link className="admin-link" to="/admin">
            Admin Login
          </Link>
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

 
<footer className="site-footer">
  <div className="footer-main">
    <Link className="footer-brand" to="/">
      <span className="footer-logo">✚</span>
      <span>MediCompare</span>
    </Link>

    <p className="footer-tagline">
      Healthcare price comparison platform
    </p>

    <nav className="footer-links">
      <Link to="/">Home</Link>
      <span>•</span>
      <Link to="/compare">Compare Prices</Link>
      <span>•</span>
      <Link to="/hospitals">Hospitals</Link>
      <span>•</span>
      <Link to="/admin">Admin Login</Link>
    </nav>

    <div className="footer-contact">
      <div className="footer-contact-item">
        <span className="contact-icon">☎</span>
        <a href="mailto:MediCompare@gmail.com">
          MediCompare@gmail.com
        </a>
      </div>

      <div className="footer-contact-item">
        <span className="contact-icon">⌖</span>
        <span>Pune, Maharashtra, India</span>
      </div>
    </div>
  </div>

  <div className="footer-bottom">
    <p>© 2026 MediCompare. All rights reserved.</p>

    <div className="footer-socials">
      <a href="https://x.com/" target="_blank" rel="noreferrer" aria-label="X">𝕏</a>
      <a href="https://facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">f</a>
      <a href="https://instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">◎</a>
      <a href="https://pinterest.com/" target="_blank" rel="noreferrer" aria-label="Pinterest">p</a>
      <a href="mailto:MediCompare@gmail.com" aria-label="Email">✉</a>
      <a href="https://wa.me/" target="_blank" rel="noreferrer" aria-label="WhatsApp">◉</a>
    </div>
  </div>
</footer>

</>
);
}
