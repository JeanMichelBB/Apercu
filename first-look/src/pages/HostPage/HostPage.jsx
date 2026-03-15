import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './HostPage.css';

const steps = [
  {
    number: '01',
    title: 'Create an Organizer Account',
    description:
      'Sign up and choose the Organizer role. Your account gives you access to a personal dashboard where you manage all your events.',
    detail: 'Free to create. No credit card required.',
  },
  {
    number: '02',
    title: 'Submit Your Event',
    description:
      'Fill in the event details — title, description, date, location, and capacity. Submit it for review when you are ready.',
    detail: 'You can save as a draft and come back to it at any time.',
  },
  {
    number: '03',
    title: 'Get Approved',
    description:
      'Our team reviews every submission to ensure quality for attendees. Most events are reviewed within 24 hours.',
    detail: 'You will be notified once your event is approved or if changes are needed.',
  },
  {
    number: '04',
    title: 'Go Live',
    description:
      'Once approved, your event is published and visible to all users on the platform. Attendees can discover and register immediately.',
    detail: 'Your event appears on the Events page and is searchable.',
  },
  {
    number: '05',
    title: 'Manage Registrations',
    description:
      'Track who is attending from your organizer dashboard. View the full list of registered attendees in real time.',
    detail: 'Edit event details or cancel at any time before the event date.',
  },
];

function HostPage() {
  return (
    <div className="host-page">
      <Header />

      <div className="host-hero">
        <h1 className="host-hero-title">Host an Event on Aperçu</h1>
        <p className="host-hero-sub">
          Reach a wider audience, manage registrations, and run your event — all in one place.
        </p>
        <Link to="/register" className="host-cta">Create Organizer Account</Link>
      </div>

      <div className="host-steps-section">
        <h2 className="host-steps-title">How to get started</h2>
        <div className="host-steps">
          {steps.map((step) => (
            <div className="host-step" key={step.number}>
              <div className="host-step-left">
                <span className="host-step-number">{step.number}</span>
              </div>
              <div className="host-step-right">
                <h3 className="host-step-title">{step.title}</h3>
                <p className="host-step-desc">{step.description}</p>
                <p className="host-step-detail">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="host-faq">
        <h2 className="host-faq-title">Common questions</h2>
        <div className="host-faq-list">
          <div className="host-faq-item">
            <h3>Is it free to host an event?</h3>
            <p>Yes. Creating an organizer account and publishing events on Aperçu is completely free.</p>
          </div>
          <div className="host-faq-item">
            <h3>How long does approval take?</h3>
            <p>Most events are reviewed within 24 hours. You will be notified by email once a decision is made.</p>
          </div>
          <div className="host-faq-item">
            <h3>Can I edit my event after it is published?</h3>
            <p>Yes. You can update the title, description, date, location, and capacity from your organizer dashboard at any time.</p>
          </div>
          <div className="host-faq-item">
            <h3>What happens if I need to cancel?</h3>
            <p>You can cancel your event from the dashboard. Registered attendees will be able to see the updated status.</p>
          </div>
        </div>
      </div>

      <div className="host-bottom-cta">
        <h2>Ready to get started?</h2>
        <p>Create your organizer account in under a minute.</p>
        <Link to="/register" className="host-cta">Get Started</Link>
      </div>

      <Footer />
    </div>
  );
}

export default HostPage;
