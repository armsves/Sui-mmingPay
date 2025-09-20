import React, { useState } from 'react';
import { Container, Card, Flex, Text, Button, TextField, TextArea } from '@radix-ui/themes';
import { useCurrentAccount } from '@mysten/dapp-kit';

export function SubmitInvoicePage() {
  const currentAccount = useCurrentAccount();
  const [formData, setFormData] = useState({
    freelancerName: '',
    freelancerEmail: '',
    projectDescription: '',
    amount: '',
    dueDate: '',
    additionalNotes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement invoice submission logic
    console.log('Invoice submitted:', formData);
    alert('Invoice submission functionality will be implemented soon!');
  };

  if (!currentAccount) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        minHeight: '100vh',
        padding: '64px 0',
        backdropFilter: 'blur(5px)'
      }}>
        <Container size="3">
          <Card style={{
            padding: '48px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <Flex direction="column" align="center" gap="6">
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
              }}>
                <Text size="6" weight="bold" style={{ color: 'white' }}>S</Text>
              </div>
              <Text size="7" weight="bold" style={{ color: '#1a1a1a' }}>
                Connect Your Wallet
              </Text>
              <Text size="4" style={{ color: '#666', textAlign: 'center' }}>
                Please connect your wallet to submit an invoice for payment.
              </Text>
            </Flex>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      minHeight: '100vh',
      padding: '64px 0',
      backdropFilter: 'blur(5px)'
    }}>
      <Container size="3">
        <Card style={{
          padding: '48px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.3)'
        }}>
          <Flex direction="column" gap="8">
            <div style={{ textAlign: 'center' }}>
              <Text size="8" weight="bold" style={{ color: '#1a1a1a', display: 'block', marginBottom: '16px' }}>
                Submit Invoice
              </Text>
              <Text size="4" style={{ color: '#666' }}>
                Fill out the form below to submit your invoice for payment processing.
              </Text>
            </div>

            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="6">
                {/* Freelancer Information */}
                <div>
                  <Text size="4" weight="medium" >
                    Freelancer Name
                  </Text>
                  <TextField.Root
                    value={formData.freelancerName}
                    onChange={(e) => handleInputChange('freelancerName', e.target.value)}
                    placeholder="Enter your full name"
                    required
                    
                  />
                </div>

                <div>
                  <Text size="4" weight="medium" >
                    Email Address
                  </Text>
                  <TextField.Root
                    type="email"
                    value={formData.freelancerEmail}
                    onChange={(e) => handleInputChange('freelancerEmail', e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    
                  />
                </div>

                {/* Project Details */}
                <div>
                  <Text size="4" weight="medium" >
                    Project Description
                  </Text>
                  <TextArea
                    value={formData.projectDescription}
                    onChange={(e) => handleInputChange('projectDescription', e.target.value)}
                    placeholder="Describe the work completed..."
                    rows={4}
                    required
                    
                  />
                </div>

                {/* Payment Information */}
                <div>
                  <Text size="4" weight="medium" >
                    Amount (SUI)
                  </Text>
                  <TextField.Root
                    type="number"
                    step="0.001"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="0.000"
                    required
                    
                  />
                </div>

                <div>
                  <Text size="4" weight="medium" >
                    Due Date
                  </Text>
                  <TextField.Root
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    required
                    
                  />
                </div>

                {/* Additional Notes */}
                <div>
                  <Text size="4" weight="medium" >
                    Additional Notes (Optional)
                  </Text>
                  <TextArea
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    placeholder="Any additional information..."
                    rows={3}
                    
                  />
                </div>

                {/* Wallet Info */}
                <Card >
                  <Text size="3" >
                    Connected Wallet:
                  </Text>
                  <Text size="3" >
                    {currentAccount.address}
                  </Text>
                </Card>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  size="4" 
                  
                >
                  Submit Invoice
                </Button>
              </Flex>
            </form>
          </Flex>
        </Card>
      </Container>
    </div>
  );
}