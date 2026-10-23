import { useContext } from "react";
import { NavLink } from "react-router-dom";
import "./Navigation.css";
import CurrentUserContext from "../../contexts/CurrentUserContext.js";

function Navigation({
  theme = "dark",
  isOpen = false,
  isLoggedIn,
  onNavigate,
  onSignInClick,
  onLogout,
}) {
  const currentUser = useContext(CurrentUserContext);

  const getLinkClassName = ({ isActive }) =>
    `navigation__link navigation__link_theme_${theme} ${isActive ? "navigation__link_active" : ""}`;

  return (
    <nav
      className={`navigation navigation_theme_${theme} ${isOpen ? "navigation_open" : ""}`}
    >
      <NavLink className={getLinkClassName} to="/" end onClick={onNavigate}>
        Home
      </NavLink>
      {isLoggedIn && (
        <NavLink
          className={getLinkClassName}
          to="/saved-news"
          onClick={onNavigate}
        >
          Saved articles
        </NavLink>
      )}
      <button
        className={`navigation__button navigation__button_theme_${theme} ${isLoggedIn ? "navigation__button_type_user" : ""}`}
        type="button"
        onClick={isLoggedIn ? onLogout : onSignInClick}
      >
        <span>{isLoggedIn ? currentUser?.name || "User" : "Sign in"}</span>
        {isLoggedIn && (
          <svg
            className="navigation__logout-icon"
            width="18"
            height="16"
            viewBox="0 0 18 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 14H2V2H6V0H2C0.89543 0 0 0.89543 0 2V14C0 15.1046 0.89543 16 2 16H6V14ZM13.2929 4.70711L11.8787 6.12132L13.7574 8H6V10H13.7574L11.8787 11.8787L13.2929 13.2929L17.5858 9L13.2929 4.70711Z"
              fill="currentColor"
            />
          </svg>
        )}
      </button>
    </nav>
  );
}

export default Navigation;
