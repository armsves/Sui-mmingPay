import React from 'react';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
// Custom ConnectButton with connected style
function WalletConnectStyled() {
  const account = useCurrentAccount();
  const isConnected = !!account?.address;
  return (
    <ConnectButton
      style={{
        background: isConnected ? '#f8fbff' : '#1976d2',
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
      }}
    />
  );
}
import { Flex, Text, Button } from '@radix-ui/themes';
import { LightningBoltIcon, LockClosedIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav style={{ 
      backgroundColor: 'transparent',
      borderBottom: 'none',
      boxShadow: 'none'
    }}>
      <div style={{ margin: 'auto', padding: '5px' }}>
        <Flex justify="between" align="center" style={{ height: '64px' }}>
          {/* Logo and Project Name */}
          <Flex align="center" gap="3">
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}>
              <Text size="4" weight="bold" style={{ color: 'white' }}>S</Text>
            </div>
            <Text size="6" weight="bold" style={{ color: '#1a1a1a' }}>
              Sui-mmingPay - Secure Payroll Payments for Freelancers
            </Text>
          </Flex>

          {/* Navigation Links */}
          <Flex align="center" gap="6">

            <Link to="/submit-invoice" style={{ textDecoration: 'none' }}>
              <Button size="4" style={{
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: 'white',
                padding: '12px 32px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transition: 'all 0.2s',
                border: 'none'
              }}>
                Submit an Invoice
              </Button>
            </Link>
            <Link to="/admin" style={{ textDecoration: 'none' }}>
              <Button size="4" style={{
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: 'white',
                padding: '12px 32px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                transition: 'all 0.2s',
                border: 'none'
              }}>
                Admin Portal
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