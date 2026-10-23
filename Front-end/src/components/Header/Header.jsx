import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import Navigation from "../Navigation/Navigation.jsx";
import logoutIcon from "../../assets/logout.png";

function Header({ theme = "dark", isLoggedIn, onSignInClick, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleNavigationClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`header header_theme_${theme} ${isMenuOpen ? "header_menu_open" : ""}`}
    >
      <div className="header__content">
        <Link className="header__logo" to="/">
          NewsExplorer
        </Link>
        <button
          className="header__menu-button"
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          onClick={handleMenuToggle}
        >
          <span className="header__menu-line" />
          <span className="header__menu-line" />
        </button>
        <Navigation
          theme={theme}
          isOpen={isMenuOpen}
          isLoggedIn={isLoggedIn}
          onNavigate={handleNavigationClose}
          onSignInClick={onSignInClick}
          onLogout={onLogout}
          logoutIcon={logoutIcon}
        />
      </div>
    </header>
  );
}

export default Header;
