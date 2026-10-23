import "./Preloader.css";

function Preloader() {
  return (
    <section className="preloader" role="status" aria-live="polite">
      <div className="circle-preloader" aria-hidden="true" />
      <p className="preloader__text">Searching for news...</p>
    </section>
  );
}

export default Preloader;
