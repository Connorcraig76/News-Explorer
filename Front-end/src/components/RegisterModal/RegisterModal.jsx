import { useState, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm.jsx";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RegisterModal({ isOpen, onClose, onLoginClick, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", name: "" });
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setName("");
      setErrors({ email: "", password: "", name: "" });
      setSubmitError("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    setErrors((prev) => ({
      ...prev,
      email: !val
        ? "Email required"
        : !EMAIL_PATTERN.test(val)
          ? "Invalid email format"
          : "",
    }));
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setErrors((prev) => ({
      ...prev,
      password: !val
        ? "Password required"
        : val.length < 6
          ? "Password must be at least 6 characters"
          : "",
    }));
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    setErrors((prev) => ({
      ...prev,
      name: !val.trim() ? "Username required" : "",
    }));
  };

  const isValid =
    email &&
    password &&
    name &&
    !errors.email &&
    !errors.password &&
    !errors.name;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValid) return;

    setSubmitError("");
    setIsSubmitting(true);

    onRegister({ email, password, name })
      .catch((err) => {
        setSubmitError(err.message || "Registration failed. Try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <ModalWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="Sign up"
      name="register"
      buttonText={isSubmitting ? "Signing up..." : "Sign up"}
      alternateText="Sign in"
      onAlternateClick={onLoginClick}
      isSubmitDisabled={!isValid || isSubmitting}
    >
      <label className="modal__label" htmlFor="register-email">
        Email
        <input
          className="modal__input"
          id="register-email"
          name="email"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <span className="modal__input-error">{errors.email}</span>
      </label>
      <label className="modal__label" htmlFor="register-password">
        Password
        <input
          className="modal__input"
          id="register-password"
          name="password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <span className="modal__input-error">{errors.password}</span>
      </label>
      <label className="modal__label" htmlFor="register-name">
        Username
        <input
          className="modal__input"
          id="register-name"
          name="name"
          type="text"
          placeholder="Enter your username"
          value={name}
          onChange={handleNameChange}
          required
        />
        <span className="modal__input-error">{errors.name}</span>
      </label>
      {submitError && (
        <span className="modal__server-error" role="alert">
          {submitError}
        </span>
      )}
    </ModalWithForm>
  );
}

export default RegisterModal;
