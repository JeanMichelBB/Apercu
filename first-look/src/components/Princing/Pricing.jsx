import React from 'react';
import './Pricing.css';

const Pricing = () => {
    return (
        <div className="pricing-container">
            <h1>Our Pricing Plans</h1>
            <div className="pricing-wrapper">
                <div className="pricing-grid">
                    {/* Basic Plan */}
                    <div className="pricing-card">
                        <h2>Basic</h2>
                        <div className="pricing-contract">
                            <p className="price">$500 - $1000/project</p>
                            <p className="contract-duration">1-month contract</p>
                        </div>
                        <button className="pricing-btn">Get Started</button>
                        <ul>
                            <li>Small scale projects</li>
                            <li>Essential features and functionality</li>
                            <li>Email support</li>
                            <li>Up to 2 revisions</li>
                        </ul>
                        <div className="support-details">
                            <h4>Support:</h4>
                            <p>Email support during business hours, 1-month post-launch maintenance.</p>
                        </div>
                    </div>

                    {/* Intermediate Plan */}
                    <div className="pricing-card">
                        <h2>Intermediate</h2>
                        <div className="pricing-contract">
                            <p className="price">$1000 - $3000/project</p>
                            <p className="contract-duration">2-3 month contract</p>
                        </div>
                        <button className="pricing-btn">Get Started</button>
                        <ul>
                            <li>Medium scale projects</li>
                            <li>Advanced features and integrations</li>
                            <li>Priority email and chat support</li>
                            <li>Up to 5 revisions</li>
                        </ul>
                        <div className="support-details">
                            <h4>Support:</h4>
                            <p>Priority support during business hours, 3-month post-launch maintenance.</p>
                        </div>
                    </div>

                    {/* Advanced Plan */}
                    <div className="pricing-card">
                        <h2>Advanced</h2>
                        <div className="pricing-contract">
                            <p className="price">$3000 - $5000/project</p>
                            <p className="contract-duration">3-6 month contract</p>
                        </div>
                        <button className="pricing-btn">Get Started</button>
                        <ul>
                            <li>Large scale projects</li>
                            <li>Custom features, integrations, and design</li>
                            <li>Dedicated support team</li>
                            <li>Up to 10 revisions</li>
                        </ul>
                        <div className="support-details">
                            <h4>Support:</h4>
                            <p>Full support during business hours, 6-month post-launch maintenance.</p>
                        </div>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="pricing-card">
                        <h2>Enterprise</h2>
                        <div className="pricing-contract">
                            <p className="price">Custom pricing</p>
                            <p className="contract-duration">Custom contract duration</p>
                        </div>
                        <button className="pricing-btn">Get Started</button>
                        <ul>
                            <li>Enterprise-level projects</li>
                            <li>Full-stack development and consulting</li>
                            <li>Ongoing dedicated support</li>
                            <li>Unlimited revisions</li>
                        </ul>
                        <div className="support-details">
                            <h4>Support:</h4>
                            <p>24/7 support and full post-launch maintenance for the entire contract duration.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Pricing;