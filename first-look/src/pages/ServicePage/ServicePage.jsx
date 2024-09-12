// ServicePage.jsx
import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Service from '../../components/Service/Service';
import './ServicePage.css';

function ServicePage() {
    return (
        <div>
            <Header />
            <h1>Our Services</h1>
            <p className="service-intro">
                Welcome to our service page! We offer a range of solutions to help you build and maintain your digital presence. Whether you need a basic website or a full-scale enterprise application, our team is ready to assist you at every step.
            </p>
            <Service />
            <div className="service-intro">
                Need a custom solution? <a href="/contact">Contact us</a> to discuss your project requirements. Our team will work with you to create a custom plan that fits your budget and timeline.
                <h2>Custom Solutions</h2>
                <p>Our custom solutions are tailored to your specific needs. We offer:</p>
                <ul>
                    <li>Custom pricing based on your project requirements</li>
                    <li>Flexible contract terms</li>
                    <li>Priority support and maintenance</li>
                    <li>Custom features and integrations</li>
                </ul>
                <p>Get in touch with us today to get started on your custom solution.</p>
            </div>

            <Footer />
        </div>
    );
}

export default ServicePage;