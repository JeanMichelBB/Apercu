import React, { useState } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import AboutPage from './pages/AboutPage/AboutPage';
import ContactPage from './pages/ContactPage/ContactPage';
import NoPage from './pages/NoPage/NoPage';
import Admin from './pages/Admin/Admin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminEvents from './pages/Admin/AdminEvents';
import AdminSpeakers from './pages/Admin/AdminSpeakers';
import AdminPosts from './pages/Admin/AdminPosts';
import AdminContacts from './pages/Admin/AdminContacts';
import AdminUsers from './pages/Admin/AdminUsers';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ForgetPasswordPage from './pages/ForgetPasswordPage/ForgetPasswordPage';
import HostPage from './pages/HostPage/HostPage';
import ResetCodePage from './pages/ResetCodePage/ResetCodePage';
import ResetPasswordPage from './pages/ResetPasswordPage/ResetPasswordPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage/MyRegistrationsPage';
import Organizer from './pages/Organizer/Organizer';
import OrganizerEvents from './pages/Organizer/OrganizerEvents';
import OrganizerCreateEvent from './pages/Organizer/OrganizerCreateEvent';
import OrganizerSpeakers from './pages/Organizer/OrganizerSpeakers';
import OrganizerPosts from './pages/Organizer/OrganizerPosts';
import OrganizerCreatePost from './pages/Organizer/OrganizerCreatePost';
import EventsPage from './pages/EventsPage/EventsPage';
import EventDetailPage from './pages/EventDetailPage/EventDetailPage';
import SpeakersPage from './pages/SpeakersPage/SpeakersPage';
import SpeakerDetailPage from './pages/SpeakerDetailPage/SpeakerDetailPage';
import BlogPage from './pages/BlogPage/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage/BlogDetailPage';
import CookieBanner from './components/CookieBanner/CookieBanner';
import './global.css';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');

  return (
    <div>
      <BrowserRouter>
        <CookieBanner />
        <Routes>
          <Route path="*" element={<NoPage />} />
          <Route index element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/forget-password" element={<ForgetPasswordPage />} />
          <Route path="/host" element={<HostPage />} />
          <Route path="/reset-code" element={<ResetCodePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/login" element={<LoginPage setToken={setToken} />} />
          <Route path="/register" element={<RegisterPage setToken={setToken} />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/my-registrations" element={<MyRegistrationsPage />} />
          <Route path="/organizer" element={<Organizer />}>
            <Route index element={<OrganizerEvents />} />
            <Route path="create" element={<OrganizerCreateEvent />} />
            <Route path="edit/:id" element={<OrganizerCreateEvent />} />
            <Route path="speakers" element={<OrganizerSpeakers />} />
            <Route path="posts" element={<OrganizerPosts />} />
            <Route path="posts/create" element={<OrganizerCreatePost />} />
            <Route path="posts/edit/:id" element={<OrganizerCreatePost />} />
          </Route>
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/speakers" element={<SpeakersPage />} />
          <Route path="/speakers/:id" element={<SpeakerDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          <Route path="/admin" element={<Admin token={token} />}>
            <Route index element={<AdminDashboard />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="speakers" element={<AdminSpeakers />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="contacts" element={<AdminContacts token={token} />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}
