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
            <Footer />
        </div>
    );
}

export default ServicePage;