// Copyright (c), Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { SubmitInvoicePage } from './pages/SubmitInvoicePage';
import { AdminPage } from './pages/AdminPage';
import { CreateAllowlistWithUploadPage } from './pages/CreateAllowlistWithUploadPage';
import { CreateAllowlist } from './CreateAllowlist';
import { Allowlist } from './Allowlist';
import { AllAllowlist } from './OwnedAllowlists';
import AllowlistView from './AllowlistView';
import { CreateService } from './CreateSubscriptionService';
import { Service } from './SubscriptionService';
import { AllServices } from './OwnedSubscriptionServices';
import SubscriptionView from './SubscriptionView';
import DemoAppPage from './pages/DemoAppPage';

function App() {
  const [recipientAllowlist, setRecipientAllowlist] = useState<string>('');
  const [capId, setCapId] = useState<string>('');
  const currentAccount = useCurrentAccount();

  return (
    <BrowserRouter>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background image with opacity */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          backgroundImage: 'url(/background.jpg)',
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          opacity: 0.5,
          //filter: 'blur(2px) brightness(0.96)'
        }} />
        {/* Gradient overlay for contrast */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          background: 'linear-gradient(120deg, rgba(173,216,230,0.35) 0%, rgba(255,255,255,0.7) 100%)',
          mixBlendMode: 'overlay',
        }} />
        {/* Sui Drop image in the absolute center, above background but below content */}
        <img
          src="/sui-drop.png"
          alt="Sui Drop"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1,
            pointerEvents: 'none',
            width: '320px',
            maxWidth: '60vw',
            opacity: 0.5
          }}
        />
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/submit-invoice" element={<SubmitInvoicePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/create-allowlist-upload" element={<CreateAllowlistWithUploadPage />} />
                <Route path="/demo-app/*" element={<DemoAppPage />} />
              <Route path="/allowlist-example/*" element={
                <Routes>
                  <Route path="/" element={<CreateAllowlist />} />
                  <Route path="admin/allowlist/:id" element={<Allowlist setRecipientAllowlist={setRecipientAllowlist} setCapId={setCapId} />} />
                  <Route path="admin/allowlists" element={<AllAllowlist />} />
                  <Route path="view/allowlist/:id" element={<AllowlistView suiAddress={currentAccount?.address || ''} />} />
                </Routes>
              } />
              <Route path="/subscription-example/*" element={
                <Routes>
                  <Route path="/" element={<CreateService />} />
                  <Route path="admin/service/:id" element={<Service setRecipientAllowlist={setRecipientAllowlist} setCapId={setCapId} />} />
                  <Route path="admin/services" element={<AllServices />} />
                  <Route path="view/service/:id" element={<SubscriptionView suiAddress={currentAccount?.address || ''} />} />
                </Routes>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
