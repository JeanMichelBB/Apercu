// IntroductionAboutUs.js
import React from 'react';
import './IntroductionAboutUs.css'; // Import the CSS file

const IntroductionAboutUs = () => {
    return (
        <section className="info-text"> {/* Use className instead of inline styles */}
            <p>
                Dans notre cabinet d'avocats, nous sommes dévoués à fournir des services juridiques exceptionnels adaptés
                aux besoins uniques de nos clients. Notre mission est de respecter les normes les plus élevées
                de professionnalisme, d'intégrité et de satisfaction du client.
            </p>
            <p>
                Notre équipe d'avocats expérimentés s'engage à fournir des solutions efficaces
                et à guider les clients à travers les défis juridiques avec expertise et compassion.
            </p>
        </section>
    );
};

export default IntroductionAboutUs;
