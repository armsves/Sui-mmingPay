import React from 'react';
import { Container, Flex, Text, Button, Card, Box } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import { CheckIcon, LightningBoltIcon, LockClosedIcon, GlobeIcon } from '@radix-ui/react-icons';

export function LandingPage() {
  return (
    <div>
      <Container size="4" style={{ padding: '24px 24px' }}>
        <Flex direction="column" gap="12" align="center">
          {/* Hero Section */}
          <Box style={{ textAlign: 'center' }}>
            <Text size="4" style={{ 
              color: '#1565c0', 
              maxWidth: '700px', 
              margin: '0 auto', 
              display: 'block', 
              lineHeight: '1.6' 
            }}>
              A decentralized payroll payment system built on the Sui blockchain, enabling secure, 
              transparent, and efficient payments between clients and freelancers worldwide.
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '32px' 
            }}>
              <Card style={{ 
                padding: '32px', 
                backgroundColor: 'rgba(173, 216, 230, 0.8)',
                backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
                border: '1px solid rgba(173,216,230,0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}>
                <Flex direction="column" align="center" gap="4">
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    <LightningBoltIcon style={{ width: '32px', height: '32px', color: 'white' }} />
                  </div>
                  <Text size="5" weight="bold" style={{ color: '#1a1a1a' }}>Fast Payments</Text>
                  <Text size="3" style={{ color: '#1565c0', textAlign: 'center', lineHeight: '1.5' }}>
                    Lightning-fast transactions on the Sui blockchain with minimal fees
                  </Text>
                </Flex>
              </Card>

              <Card style={{ 
                padding: '32px', 
                backgroundColor: 'rgba(173, 216, 230, 0.8)', // light blue with opacity
                backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
                border: '1px solid rgba(173,216,230,0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}>
                <Flex direction="column" align="center" gap="4">
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    <LockClosedIcon style={{ width: '32px', height: '32px', color: 'white' }} />
                  </div>
                  <Text size="5" weight="bold" style={{ color: '#1a1a1a' }}>Secure</Text>
                  <Text size="3" style={{ color: '#1565c0', textAlign: 'center', lineHeight: '1.5' }}>
                    Built on blockchain technology ensuring transparency and security
                  </Text>
                </Flex>
              </Card>

              <Card style={{ 
                padding: '32px', 
                backgroundColor: 'rgba(173, 216, 230, 0.8)', // light blue with opacity
                backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
                border: '1px solid rgba(173,216,230,0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}>
                <Flex direction="column" align="center" gap="4">
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    <GlobeIcon style={{ width: '32px', height: '32px', color: 'white' }} />
                  </div>
                  <Text size="5" weight="bold" style={{ color: '#1a1a1a' }}>Global</Text>
                  <Text size="3" style={{ color: '#1565c0', textAlign: 'center', lineHeight: '1.5' }}>
                    Work with freelancers from anywhere in the world without borders
                  </Text>
                </Flex>
              </Card>

              <Card style={{ 
                padding: '32px', 
                backgroundColor: 'rgba(173, 216, 230, 0.8)', // light blue with opacity
                backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
                border: '1px solid rgba(173,216,230,0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}>
                <Flex direction="column" align="center" gap="4">
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, #ff6f00 0%, #e65100 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    <CheckIcon style={{ width: '32px', height: '32px', color: 'white' }} />
                  </div>
                  <Text size="5" weight="bold" style={{ color: '#1a1a1a' }}>Reliable</Text>
                  <Text size="3" style={{ color: '#1565c0', textAlign: 'center', lineHeight: '1.5' }}>
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
              textAlign: 'center' 
            }}>
              How It Works
            </Text>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '32px' 
            }}>
              <Card style={{ 
                padding: '32px', 
                backgroundColor: 'rgba(173, 216, 230, 0.8)', // light blue with opacity
                backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
                border: '1px solid rgba(173,216,230,0.3)'
              }}>
                <Flex direction="column" gap="4">
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    <Text size="4" weight="bold" style={{ color: 'white' }}>1</Text>
                  </div>
                  <Text size="5" weight="bold" style={{ color: '#1a1a1a' }}>Submit Invoice</Text>
                  <Text size="3" style={{ color: '#1565c0', lineHeight: '1.5' }}>
                    Freelancers submit invoices with payment details and project information
                  </Text>
                </Flex>
              </Card>

              <Card style={{ 
                padding: '32px', 
                backgroundColor: 'rgba(173, 216, 230, 0.8)', // light blue with opacity
                backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
                border: '1px solid rgba(173,216,230,0.3)'
              }}>
                <Flex direction="column" gap="4">
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    <Text size="4" weight="bold" style={{ color: 'white' }}>2</Text>
                  </div>
                  <Text size="5" weight="bold" style={{ color: '#1a1a1a' }}>Admin Review</Text>
                  <Text size="3" style={{ color: '#1565c0', lineHeight: '1.5' }}>
                    Authorized administrators review and approve payment requests
                  </Text>
                </Flex>
              </Card>

              <Card style={{ 
                padding: '32px', 
                backgroundColor: 'rgba(173, 216, 230, 0.8)', // light blue with opacity
                backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', 
                border: '1px solid rgba(173,216,230,0.3)'
              }}>
                <Flex direction="column" gap="4">
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    <Text size="4" weight="bold" style={{ color: 'white' }}>3</Text>
                  </div>
                  <Text size="5" weight="bold" style={{ color: '#1a1a1a' }}>Secure Payment</Text>
                  <Text size="3" style={{ color: '#1565c0', lineHeight: '1.5' }}>
                    Payments are processed securely through the Sui blockchain
                  </Text>
                </Flex>
              </Card>
            </div>
          </Box>
        </Flex>
      </Container>
    </div>
  );
}