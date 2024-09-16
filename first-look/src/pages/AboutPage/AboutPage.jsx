// AboutPage.js
import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about-page-container">
      <Header />

      <main className="about-main-content">
        <section className="about-section">
          <h2>About Me</h2>
          <p>
            Hi, I'm Jean-Michel Bérubé, a bilingual full-stack developer based in Montreal, Quebec. 
            I specialize in custom software solutions with expertise in DevOps, Docker, networking, 
            AI tools, and monitoring. With an AEC in Programmer Analyst from LaSalle College, I have 
            developed a strong foundation in software development.
          </p>
          <p>
            My experience spans across multiple industries, from IT management to creative work in photography 
            and short films. I'm passionate about problem-solving, innovation, and leveraging AI tools like OpenAI 
            and Copilot to create unique and effective solutions. As a self-employed software developer, 
            I am always looking for new challenges and ways to improve my skills.
          </p>
        </section>

        <section className="contact-section">
          <h3>Contact</h3>
          <ul>
            <li>
              <a href="https://github.com/jeanmichelbb" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/jeanmichelbb" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="https://jeanmichelbb.github.io/" target="_blank" rel="noopener noreferrer">
                My Portfolio
              </a>
            </li>
          </ul>
        </section>

        <section className="values-section">
          <h3>My Values</h3>
          <p>
            I am committed to integrity, innovation, and delivering high-quality software solutions. 
            I believe in continuous learning, collaboration, and fostering creativity in my projects. 
            These values guide me in providing the best possible service to clients and stakeholders.
          </p>
        </section>

        <section className="skills-section">
          <h3>Skills</h3>
          <p>
            Over the years, I’ve honed my skills in various technologies, including:
          </p>
          <ul>
            <li>React, JavaScript, Python, SQL (MS SQL, PL/SQL, MySQL)</li>
            <li>DevOps & Cloud (Docker, Networking, Prometheus, Grafana)</li>
            <li>AI Tools & Integrations (OpenAI, Copilot)</li>
            <li>Git, GitHub, MySQL, Firebase, FastAPI</li>
          </ul>
        </section>

        <section className="location-section">
          <h3>Location</h3>
          <p>
            Based in Montreal, Quebec, I'm open to both remote and local opportunities. Feel free to reach out for collaboration 
            or to discuss new projects!
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AboutPage;