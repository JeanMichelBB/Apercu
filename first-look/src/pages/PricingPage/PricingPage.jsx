// PricingPage.jsx
import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Pricing from '../../components/Princing/Pricing';
import './PricingPage.css';

function PricingPage() {
    return (
        <div>
            <Header />
            <h1>Pricing Plans</h1>
            <div className="pricing-intro">
                <p>Choose the right plan for your needs. We offer flexible pricing for all types of applications, from small projects to large-scale enterprise solutions.</p>
            </div>
            <Pricing />
            <Footer />
        </div>
    );
}

export default PricingPage;