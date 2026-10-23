import { useState } from "react";
import "./SearchForm.css";
import background from "../../assets/header_photo.jpg";

function SearchForm({ onSearch }) {
  const [query, setQuery] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (validationMessage) {
      setValidationMessage("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      setValidationMessage("Please enter a keyword");
      return;
    }

    setValidationMessage("");
    onSearch(trimmed);
  };

  return (
    <section
      className="search-form"
      aria-labelledby="search-title"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="search-form__container">
        <h1 className="search-form__title" id="search-title">
          What&apos;s going on in the world?
        </h1>
        <p className="search-form__subtitle">
          Find the latest news on any topic and save them in your personal
          account.
        </p>
        <form className="search-form__form" onSubmit={handleSubmit} noValidate>
          <div className="search-form__input-group">
            <input
              className="search-form__input"
              type="text"
              placeholder="Enter topic"
              value={query}
              onChange={handleInputChange}
            />
            <button className="search-form__button" type="submit">
              Search
            </button>
          </div>
          {validationMessage && (
            <span className="search-form__error" role="alert">
              {validationMessage}
            </span>
          )}
        </form>
      </div>
    </section>
  );
}

export default SearchForm;
