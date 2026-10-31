import { useEffect } from "react";
import "./RegistrationSuccessModal.css";

function RegistrationSuccessModal({ isOpen, onClose, onSignInClick }) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropMouseDown = (event) => {
    if (event.target === event.currentTarget) onClose();
  };

  return (
    <div className="modal" onMouseDown={handleBackdropMouseDown}>
      <section
        className="modal__container registration-success"
        role="dialog"
        aria-modal="true"
        aria-labelledby="registration-success-title"
      >
        <button
          className="modal__close"
          type="button"
          aria-label="Close registration confirmation"
          onClick={onClose}
        />
        <h2
          className="modal__title registration-success__title"
          id="registration-success-title"
        >
          Registration successfully completed!
        </h2>
        <button
          className="registration-success__link"
          type="button"
          onClick={() => {
            onClose();
            onSignInClick();
          }}
        >
          Sign in
        </button>
      </section>
    </div>
  );
}

export default RegistrationSuccessModal;
