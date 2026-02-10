import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer__inner">
          <div className="brand">
            <img
              className="footer__logo"
              src="/assets/obsidian-logo-red.png"
              alt="Obsidian Labs"
            />
            <div className="brand__text">
              <div className="brand__name">OBSIDIAN</div>
              <div className="brand__sub">LABS</div>
            </div>
          </div>

          <div className="footer__links">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="dot">•</span>
            <Link to="/terms">Terms of Service</Link>
          </div>

          <div className="footer__social">
            <a className="social" href="#">
              F
            </a>
            <a className="social" href="#">
              X
            </a>
            <a className="social" href="#">
              I
            </a>
          </div>
        </div>
        <div className="footer__bottom">
          © {new Date().getFullYear()} Obsidian Labs. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
