// src/components/Advanced/Advanced.jsx
import React from 'react';
import './Advanced.css';
import advanced from '../../advanced.png'; // Path to your image
import advanced2 from '../../advanced2.png'; // Path to your image

const Advanced = () => {
    return (
        <div className="advanced-container">
            <h2>Advanced</h2>
            <div className="content-wrapper">
                <p className="intro-text">
                    The Basic Plan is designed for individuals or small projects needing fundamental features.
                    It provides essential tools to get you started with a streamlined approach.
                </p>
                <img src={advanced} alt="Basic Plan" className="basic-image-1" />
            </div>
            <div className="content-wrapper">
                <img src={advanced2} alt="Basic Plan" className="basic-image-2" />
                <p className="intro-text">
                    The Basic Plan is designed for individuals or small projects needing fundamental features.
                    It provides essential tools to get you started with a streamlined approach.
                </p>
            </div>
            <div className="features">
                <h3>Key Features:</h3>
                <ul>
                    <li><strong>Feature 1:</strong> Comprehensive feature description that explains the benefit and usage.</li>
                    <li><strong>Feature 2:</strong> Another important feature with its details and how it adds value.</li>
                    <li><strong>Feature 3:</strong> An additional feature that supports your basic needs with examples.</li>
                </ul>
            </div>
            <p className="additional-info">
                This plan is ideal for those starting out or for small-scale needs. Upgrade options are available
                as your requirements grow. For detailed information or assistance, feel free to reach out.
            </p>
        </div>
    );
}

export default Advanced;
