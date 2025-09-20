import React from 'react';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Container, Flex, Text, Button, Card, Box } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import { CheckIcon, LightningBoltIcon, LockClosedIcon, GlobeIcon } from '@radix-ui/react-icons';

export function LandingPage() {
  useEffect(() => {
    AOS.init({ duration: 900, once: true });
  }, []);
  return (
    <div>
      <Container size="4" style={{ padding: '24px 24px', fontFamily: 'Inter, Poppins, Open Sans, Arial, sans-serif' }}>
        <Flex direction="column" gap="16" align="center">
          {/* Hero Section */}
          <Box style={{ textAlign: 'center', marginTop: '48px', marginBottom: '32px' }}>
            <Text size="9" weight="bold" style={{ 
              color: '#1565c0', 
              fontFamily: 'inherit',
              marginBottom: '24px',
              letterSpacing: '0.02em',
              lineHeight: '1.1',
              display: 'block',
            }}>
              Sui-mmingPay
            </Text>
            <Text size="5" weight="medium" style={{ 
              color: '#1a1a1a',
              maxWidth: '700px',
              margin: '0 auto',
              display: 'block',
              lineHeight: '1.7',
              fontFamily: 'inherit',
            }}>
              Dive into secure freelance payments on Sui.<br />
              A decentralized payroll payment system built on the Sui blockchain, enabling secure, transparent, and efficient payments between clients and freelancers worldwide.
            </Text>
          </Box>

          {/* Features Grid */}
          <Box style={{ width: '100%' }}>
            <Text size="7" weight="bold" style={{ 
              color: '#1a1a1a', 
              marginBottom: '40px', 
              display: 'block', 
              textAlign: 'center' 
            }}>
              Why Choose Sui-mmingPay?
            </Text>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '40px',
              padding: '16px',
              alignItems: 'stretch',
            }}>
              <Card style={{ 
                padding: '36px',
                background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                border: '1.5px solid #90caf9',
                borderRadius: '24px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1,
              }}
              data-aos="fade-up"
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(33,150,243,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)'; }}>
                <Flex direction="column" align="center" gap="4">
                  <div style={{
                    width: '72px',
                    height: '72px',
                    background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 18px rgba(33,150,243,0.18)',
                    marginBottom: '12px',
                    border: '3px solid #bbdefb',
                  }}>
                    <LightningBoltIcon style={{ width: '32px', height: '32px', color: 'white' }} />
                  </div>
                  <Text size="5" weight="bold" style={{ color: '#1a1a1a' }}>Fast Payments</Text>
                  <Text size="3" style={{ color: '#1976d2', textAlign: 'center', lineHeight: '1.6', marginTop: '8px' }}>
                    Lightning-fast transactions on the Sui blockchain with minimal fees
                  </Text>
                </Flex>
              </Card>

              <Card style={{ 
                padding: '36px',
                background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                border: '1.5px solid #81c784',
                borderRadius: '24px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(76,175,80,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)'; }}>
                <Flex direction="column" align="center" gap="4">
                  <div style={{
                    width: '72px',
                    height: '72px',
                    background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 18px rgba(76,175,80,0.18)',
                    marginBottom: '12px',
                    border: '3px solid #c8e6c9',
                  }}>
                    <LockClosedIcon style={{ width: '32px', height: '32px', color: 'white' }} />
                  </div>
                  <Text size="5" weight="bold" style={{ color: '#1a1a1a' }}>Secure</Text>
                  <Text size="3" style={{ color: '#388e3c', textAlign: 'center', lineHeight: '1.6', marginTop: '8px' }}>
                    Built on blockchain technology ensuring transparency and security
                  </Text>
                </Flex>
              </Card>

              <Card style={{ 
                padding: '36px',
                background: 'linear-gradient(135deg, #ede7f6 0%, #d1c4e9 100%)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                border: '1.5px solid #b39ddb',
                borderRadius: '24px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(156,39,176,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)'; }}>
                <Flex direction="column" align="center" gap="4">
                  <div style={{
                    width: '72px',
                    height: '72px',
                    background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 18px rgba(156,39,176,0.18)',
                    marginBottom: '12px',
                    border: '3px solid #d1c4e9',
                  }}>
                    <GlobeIcon style={{ width: '32px', height: '32px', color: 'white' }} />
                  </div>
                  <Text size="5" weight="bold" style={{ color: '#1a1a1a' }}>Global</Text>
                  <Text size="3" style={{ color: '#7b1fa2', textAlign: 'center', lineHeight: '1.6', marginTop: '8px' }}>
                    Work with freelancers from anywhere in the world without borders
                  </Text>
                </Flex>
              </Card>

              <Card style={{ 
                padding: '36px',
                background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                border: '1.5px solid #ffb74d',
                borderRadius: '24px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(255,111,0,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)'; }}>
                <Flex direction="column" align="center" gap="4">
                  <div style={{
                    width: '72px',
                    height: '72px',
                    background: 'linear-gradient(135deg, #ff6f00 0%, #e65100 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 18px rgba(255,111,0,0.18)',
                    marginBottom: '12px',
                    border: '3px solid #ffe0b2',
                  }}>
                    <CheckIcon style={{ width: '32px', height: '32px', color: 'white' }} />
                  </div>
                  <Text size="5" weight="bold" style={{ color: '#1a1a1a' }}>Reliable</Text>
                  <Text size="3" style={{ color: '#e65100', textAlign: 'center', lineHeight: '1.6', marginTop: '8px' }}>
                    Smart contracts ensure payments are executed as agreed
                  </Text>
                </Flex>
              </Card>
            </div>
          </Box>

          {/* How it Works */}
          <Box style={{ width: '100%' }}>
            <Text size="7" weight="bold" style={{
              color: '#1a1a1a',
              marginBottom: '40px',
              display: 'block',
              textAlign: 'center',
            }}>
              How It Works
            </Text>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'flex-start',
              gap: '0',
              position: 'relative',
              marginBottom: '48px',
            }}>
              {[{
                color: '#1976d2',
                bg: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                icon: <LightningBoltIcon style={{ width: '28px', height: '28px', color: 'white' }} />,
                title: 'Submit Invoice',
                desc: 'Freelancers submit invoices with payment details and project information',
              }, {
                color: '#388e3c',
                bg: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
                icon: <LockClosedIcon style={{ width: '28px', height: '28px', color: 'white' }} />,
                title: 'Admin Review',
                desc: 'Authorized administrators review and approve payment requests',
              }, {
                color: '#7b1fa2',
                bg: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                icon: <CheckIcon style={{ width: '28px', height: '28px', color: 'white' }} />,
                title: 'Secure Payment',
                desc: 'Payments are processed securely through the Sui blockchain',
              }].map((step, i, arr) => (
                <div key={i} style={{
                  flex: '1 1 0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  minWidth: '260px',
                  maxWidth: '320px',
                  zIndex: 2,
                }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    background: step.bg,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 16px ${step.color}33`,
                    marginBottom: '12px',
                    border: `3px solid ${step.color}22`,
                  }}>
                    {step.icon}
                  </div>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: '#fff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 2px 8px ${step.color}22`,
                    position: 'absolute',
                    top: '44px',
                    left: 'calc(50% - 16px)',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    color: step.color,
                    border: `2px solid ${step.color}44`,
                  }}>{i + 1}</div>
                  <Text size="5" weight="bold" style={{ color: '#1a1a1a', marginTop: '32px', marginBottom: '8px', textAlign: 'center' }}>{step.title}</Text>
                  <Text size="3" style={{ color: step.color, textAlign: 'center', lineHeight: '1.6', marginBottom: '8px' }}>{step.desc}</Text>
                  {i < arr.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      top: '60px',
                      right: '-40px',
                      width: '80px',
                      height: '4px',
                      background: `linear-gradient(90deg, ${step.color}22 0%, ${arr[i+1].color}22 100%)`,
                      borderRadius: '2px',
                      zIndex: 1,
                    }} />
                  )}
                  {i < arr.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      top: '56px',
                      right: '36px',
                      width: '16px',
                      height: '16px',
                      background: arr[i+1].color,
                      borderRadius: '50%',
                      boxShadow: `0 2px 8px ${arr[i+1].color}22`,
                      border: `2px solid #fff`,
                      zIndex: 2,
                    }} />
                  )}
                </div>
              ))}
            </div>
          </Box>
        </Flex>
      </Container>
    </div>
  );
}