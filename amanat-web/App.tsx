import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import { Language } from './types';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Listings from './pages/Listings';
import PropertyDetail from './pages/PropertyDetail';
import Construction from './pages/Construction';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.DARI);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <Router>
      <Layout lang={lang} onLangChange={setLang} isDarkMode={isDarkMode} onThemeToggle={toggleTheme}>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home lang={lang} isDarkMode={isDarkMode} />} />
            <Route path="/listings" element={<Listings lang={lang} />} />
            <Route path="/construction" element={<Construction lang={lang} />} />
            <Route path="/property/:id" element={<PropertyDetail lang={lang} />} />
            <Route path="/services" element={<Services lang={lang} />} />
            <Route path="/about" element={<About lang={lang} />} />
            <Route path="/contact" element={<Contact lang={lang} />} />
          </Routes>
        </ErrorBoundary>
      </Layout>
    </Router>
  );
};

export default App;