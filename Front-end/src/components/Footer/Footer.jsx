import { Link } from "react-router-dom";
import "./Footer.css";
import githubIcon from "../../assets/github.png";
import linkedinIcon from "../../assets/LinkedIn.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <p className="footer__copyright">
          © {new Date().getFullYear()} NewsExplorer, Powered by News API
        </p>
        <nav className="footer__navigation" aria-label="Footer navigation">
          <div className="footer__links">
            <Link className="footer__link" to="/">
              Home
            </Link>
            <a
              className="footer__link"
              href="https://tripleten.com/"
              target="_blank"
              rel="noreferrer"
            >
              TripleTen
            </a>
          </div>
          <div className="footer__socials">
            <a
              className="footer__social-link"
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
            >
              <img className="footer__social-icon" src={githubIcon} alt="" />
            </a>
            <a
              className="footer__social-link"
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
            >
              <img className="footer__social-icon" src={linkedinIcon} alt="" />
            </a>
          </div>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
