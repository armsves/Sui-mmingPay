// Copyright (c), Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { SubmitInvoicePage } from './pages/SubmitInvoicePage';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #42a5f5 0%, #90caf9 100%)'
      }}>
        {/* SVG Animated Waves Layer */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <svg width="100%" height="100%" viewBox="0 0 1600 900" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#42a5f5" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#90caf9" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            <g>
              <path id="wave1" fill="url(#waveGradient)" fillOpacity="0.7">
                <animate attributeName="d" dur="8s" repeatCount="indefinite"
                  values="M0,600 Q400,500 800,600 T1600,600 V900 H0 Z;
                          M0,600 Q400,700 800,600 T1600,600 V900 H0 Z;
                          M0,600 Q400,500 800,600 T1600,600 V900 H0 Z" />
                M0,600 Q400,500 800,600 T1600,600 V900 H0 Z
              </path>
              <path id="wave2" fill="#e3f2fd" fillOpacity="0.3">
                <animate attributeName="d" dur="10s" repeatCount="indefinite"
                  values="M0,650 Q400,600 800,650 T1600,650 V900 H0 Z;
                          M0,650 Q400,750 800,650 T1600,650 V900 H0 Z;
                          M0,650 Q400,600 800,650 T1600,650 V900 H0 Z" />
                M0,650 Q400,600 800,650 T1600,650 V900 H0 Z
              </path>
            </g>
          </svg>
        </div>
        {/* Sui logo and sun reflections remain unchanged below... */}
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '300px', height: '300px', backgroundImage: 'url(/sui-logo.png)',
          backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
          opacity: 0.1, zIndex: 1, pointerEvents: 'none', filter: 'brightness(0.8) contrast(1.2)'
        }} />
        <div style={{
          position: 'fixed', top: '15%', right: '20%', width: '120px', height: '120px',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, rgba(255, 235, 59, 0.2) 40%, transparent 70%)',
          borderRadius: '50%', zIndex: 1, pointerEvents: 'none'
        }} />
        <div style={{
          position: 'fixed', top: '70%', left: '15%', width: '80px', height: '80px',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, rgba(255, 235, 59, 0.15) 50%, transparent 70%)',
          borderRadius: '50%', zIndex: 1, pointerEvents: 'none'
        }} />
        
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/submit-invoice" element={<SubmitInvoicePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
