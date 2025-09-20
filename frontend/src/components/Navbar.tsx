import React from 'react';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
// Custom ConnectButton with connected style
function WalletConnectStyled() {
  const account = useCurrentAccount();
  const isConnected = !!account?.address;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <ConnectButton
        style={{
          background: isConnected ? 'rgba(255,255,255,0.7)' : '#1976d2',
          color: isConnected ? '#1976d2' : '#fff',
          fontWeight: 700,
          fontSize: '16px',
          border: '2px solid #1976d2',
          borderRadius: '10px',
          padding: '8px 16px',
          minWidth: 0,
          width: 'auto',
          cursor: 'pointer',
          outline: 'none',
          transition: 'background 0.2s, color 0.2s',
          display: 'inline-block',
          textAlign: 'center',
          boxShadow: isConnected ? '0 2px 8px #1976d233' : '0 2px 8px #1976d2',
        }}
      />
    </div>
  );
}
import { Flex, Text, Button } from '@radix-ui/themes';
import { LightningBoltIcon, LockClosedIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav style={{
      background: 'rgba(255,255,255,0.12)',
      borderBottom: 'none',
      boxShadow: '0 8px 32px rgba(33,150,243,0.08)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      width: '100%',
      transition: 'background 0.2s',
    }}>
      <div style={{ margin: 'auto', padding: '5px' }}>
        <Flex justify="between" align="center" style={{ height: '64px' }}>
          {/* Logo and Project Name */}
          <Flex align="center" gap="3">
            <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="/SuimmingPay-logo.png"
                alt="SuimmingPay Logo"
                style={{
                  width: '40px',
                  height: '40px',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}
              />
            </Link>
            <Text size="6" weight="bold" style={{ color: 'dark-blue' }}>
              Sui-mmingPay
            </Text>
            <Text size="4" weight="medium" style={{ color: '#1976d2', marginLeft: '12px', fontStyle: 'italic', letterSpacing: '0.02em' }}>
              Secure Payroll Payments for Freelancers
            </Text>
          </Flex>

          {/* Navigation Links */}
          <Flex align="center" gap="6">
            <Link to="/submit-invoice" style={{ textDecoration: 'none' }}>
              <Button size="4" style={{
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: 'white',
                padding: '12px 32px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                border: 'none',
                fontWeight: 600,
                fontFamily: 'Inter, Poppins, Open Sans, Arial, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s, box-shadow 0.2s',
              }}
                onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'}
                onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'}
              >
                <span role="img" aria-label="invoice">📝</span> Submit an Invoice
              </Button>
            </Link>
            <Link to="/admin" style={{ textDecoration: 'none' }}>
              <Button size="4" style={{
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: 'white',
                padding: '12px 32px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                border: 'none',
                fontWeight: 600,
                fontFamily: 'Inter, Poppins, Open Sans, Arial, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s, box-shadow 0.2s',
              }}
                onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'}
                onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'}
              >
                <span role="img" aria-label="admin">🔑</span> Admin Portal
              </Button>
            </Link>
            <div style={{ marginLeft: '16px' }}>
              <WalletConnectStyled />
            </div>
          </Flex>
        </Flex>
      </div>
    </nav>
  );
}