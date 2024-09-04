// IntroductionAboutUs.js
import React from 'react';
import './IntroductionAboutUs.css'; // Import the CSS file

const IntroductionAboutUs = () => {
    return (
        <section className="info-text"> {/* Use className instead of inline styles */}
            <p>
                À propos de nous 
            </p>
            <p>
                Bienvenue sur notre site Web! Nous sommes heureux de vous accueillir.
            </p>
        </section>
    );
};

export default IntroductionAboutUs;
