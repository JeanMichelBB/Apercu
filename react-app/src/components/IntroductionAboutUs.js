// IntroductionAboutUs.js
import React from 'react';

const IntroductionAboutUs = () => {
    return (
        <section style={introductionStyle}>
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

// Styles
const introductionStyle = {
    padding: '2rem 15rem',
    textAlign: 'center',
    fontSize: '1.2rem',
};

export default IntroductionAboutUs;
