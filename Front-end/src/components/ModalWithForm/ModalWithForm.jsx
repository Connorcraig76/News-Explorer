import { useEffect } from "react";
import "./ModalWithForm.css";

function ModalWithForm({
  isOpen,
  onClose,
  onSubmit,
  title,
  name,
  buttonText,
  alternateText,
  onAlternateClick,
  children,
  isSubmitDisabled = false,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropMouseDown = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal" onMouseDown={handleBackdropMouseDown}>
      <div
        className="modal__container"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${name}-modal-title`}
      >
        <button
          className="modal__close"
          type="button"
          aria-label={`Close ${title} dialog`}
          onClick={onClose}
        />
        <h2 className="modal__title" id={`${name}-modal-title`}>
          {title}
        </h2>
        <form
          className="modal__form"
          name={name}
          onSubmit={onSubmit}
          noValidate
        >
          {children}
          <button
            className="modal__submit"
            type="submit"
            disabled={isSubmitDisabled}
          >
            {buttonText}
          </button>
        </form>
        {alternateText && (
          <p className="modal__alternate">
            or{" "}
            <button
              className="modal__alternate-button"
              type="button"
              onClick={onAlternateClick}
            >
              {alternateText}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default ModalWithForm;
