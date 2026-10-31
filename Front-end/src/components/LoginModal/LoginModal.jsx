import { useState, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm.jsx";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginModal({ isOpen, onClose, onRegisterClick, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setErrors({ email: "", password: "" });
      setSubmitError("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const validateEmail = (value) => {
    if (!value.trim()) return "Email is required";
    if (!EMAIL_PATTERN.test(value)) return "Invalid email address";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    return "";
  };

  const handleEmailChange = (event) => {
    const val = event.target.value;
    setEmail(val);
    setErrors((prev) => ({ ...prev, email: validateEmail(val) }));
  };

  const handlePasswordChange = (event) => {
    const val = event.target.value;
    setPassword(val);
    setErrors((prev) => ({ ...prev, password: validatePassword(val) }));
  };

  const isValid = email && password && !errors.email && !errors.password;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValid) return;

    setSubmitError("");
    setIsSubmitting(true);

    onLogin({ email, password })
      .catch((err) => {
        setSubmitError(
          err.message || "Login failed. Please check your credentials.",
        );
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
      title="Sign in"
      name="login"
      buttonText={isSubmitting ? "Signing in..." : "Sign in"}
      alternateText="Sign up"
      onAlternateClick={onRegisterClick}
      isSubmitDisabled={!isValid || isSubmitting}
    >
      <label className="modal__label" htmlFor="login-email">
        Email
        <input
          className="modal__input"
          id="login-email"
          name="email"
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <span className="modal__input-error">{errors.email}</span>
      </label>
      <label className="modal__label" htmlFor="login-password">
        Password
        <input
          className="modal__input"
          id="login-password"
          name="password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <span className="modal__input-error">{errors.password}</span>
      </label>
      {submitError && (
        <span className="modal__server-error" role="alert">
          {submitError}
        </span>
      )}
    </ModalWithForm>
  );
}

export default LoginModal;
