import "./About.css";
import authorPhoto from "../../assets/author.jpg";

function About() {
  return (
    <section className="about" aria-labelledby="about-title">
      <div className="about__content">
        <img
          className="about__image"
          src={authorPhoto}
          alt="Portrait of the author"
        />
        <div className="about__description">
          <h2 className="about__title" id="about-title">
            About the author
          </h2>
          <p className="about__paragraph">
            Hello, my name is Connor Craig, and I developed News Explorer. I am
            a graduate of TripleTen&apos;s software engineering program. I
            transitioned into tech from landscaping, where I realized I wanted a
            career that protects my long-term health while offering intellectual
            growth and financial stability. I look forward to making a
            meaningful impact with a company that values building a better and
            brighter tomorrow, today.
          </p>
          <p className="about__paragraph">
            This project is a comprehensive demonstration of the full-stack
            engineering skills I mastered at TripleTen. This includes building a
            responsive, pixel-perfect React frontend with protected routing and
            context-based state management, architecting a secure RESTful API
            with Node.js and Express, and handling data persistence with MongoDB
            and Mongoose. Furthermore, it highlights my ability to implement
            secure JWT-based user authentication, integrate third-party services
            like the NewsAPI, and apply production-ready security practices such
            as request validation, rate limiting, helmet protection, and
            centralized error handling.
          </p>
        </div>
      </div>
    </section>
  );
}

export default About;
