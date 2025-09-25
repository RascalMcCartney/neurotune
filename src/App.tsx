import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CallbackPage from './pages/CallbackPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cb" element={<CallbackPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;