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
            <div className="pricing-intro">
                
                <h2>Custom Plans</h2>
                <p>Need a custom plan? <a href="/contact">Contact us</a> to discuss your project requirements.</p>
                <p>Our team will work with you to create a custom plan that fits your budget and timeline.</p>
                <p>Custom plans include:</p>
                <ul>
                    <li>Custom pricing based on your project requirements</li>
                    <li>Flexible contract terms</li>
                    <li>Priority support and maintenance</li>
                    <li>Custom features and integrations</li>
                </ul>
                <p>Get in touch with us today to get started on your custom plan.</p>
            </div>


            <Footer />
        </div>
    );
}

export default PricingPage;