import React from 'react';
import { Container, Card, Flex, Text, Button, Badge } from '@radix-ui/themes';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { CheckIcon, CrossCircledIcon, PersonIcon } from '@radix-ui/react-icons';

export function AdminPage() {
  const currentAccount = useCurrentAccount();
  const adminWalletAddress = import.meta.env.VITE_ADMIN_WALLET_ADDRESS;
  
  const isAdmin = currentAccount?.address === adminWalletAddress;

  // Mock data for pending invoices (in real implementation, this would come from blockchain)
  const pendingInvoices = [
    {
      id: '1',
      freelancerName: 'Alice Johnson',
      freelancerAddress: '0x1234...5678',
      projectDescription: 'Frontend development for e-commerce platform',
      amount: '150.5',
      dueDate: '2025-01-15',
      submittedDate: '2025-01-10'
    },
    {
      id: '2',
      freelancerName: 'Bob Smith',
      freelancerAddress: '0x9876...5432',
      projectDescription: 'Smart contract audit and security review',
      amount: '300.0',
      dueDate: '2025-01-20',
      submittedDate: '2025-01-12'
    }
  ];

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
              <PersonIcon style={{ width: '48px', height: '48px', color: '#666' }} />
              <Text size="7" weight="bold" style={{ color: '#1a1a1a' }}>
                Admin Access Required
              </Text>
              <Text size="4" style={{ color: '#666', textAlign: 'center' }}>
                Please connect your wallet to access the admin portal.
              </Text>
            </Flex>
          </Card>
        </Container>
      </div>
    );
  }

  if (!isAdmin) {
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
              <CrossCircledIcon style={{ width: '48px', height: '48px', color: '#f44336' }} />
              <Text size="7" weight="bold" style={{ color: '#1a1a1a' }}>
                Access Denied
              </Text>
              <Text size="4" style={{ color: '#666', textAlign: 'center' }}>
                You don't have admin privileges to access this page.
              </Text>
              <Text size="2" style={{ color: '#999', fontFamily: 'monospace' }}>
                Connected: {currentAccount.address}
              </Text>
            </Flex>
          </Card>
        </Container>
      </div>
    );
  }

  const handleApproveInvoice = (invoiceId: string) => {
    console.log('Approving invoice:', invoiceId);
    alert(`Invoice ${invoiceId} approval functionality will be implemented soon!`);
  };

  const handleRejectInvoice = (invoiceId: string) => {
    console.log('Rejecting invoice:', invoiceId);
    alert(`Invoice ${invoiceId} rejection functionality will be implemented soon!`);
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      minHeight: '100vh',
      padding: '64px 0',
      backdropFilter: 'blur(5px)'
    }}>
      <Container size="4">
        <Flex direction="column" gap="8">
          {/* Admin Header */}
          <Card style={{
            padding: '32px',
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.1) 100%)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
          }}>
            <Flex align="center" gap="4">
              <CheckIcon style={{ width: '32px', height: '32px', color: '#4caf50' }} />
              <div>
                <Text size="6" weight="bold" style={{ color: '#1a1a1a', display: 'block' }}>
                  Admin Portal
                </Text>
                <Text size="3" style={{ color: '#4caf50', fontFamily: 'monospace' }}>
                  {currentAccount.address}
                </Text>
              </div>
            </Flex>
          </Card>

          {/* Pending Invoices */}
          <Card style={{
            padding: '32px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <Flex direction="column" gap="6">
              <div>
                <Text size="6" weight="bold" style={{ color: '#1a1a1a', display: 'block', marginBottom: '8px' }}>
                  Pending Invoices
                </Text>
                <Text size="3" style={{ color: '#666' }}>
                  Review and approve payment requests from freelancers
                </Text>
              </div>

              {pendingInvoices.length === 0 ? (
                <Card style={{
                  padding: '48px',
                  backgroundColor: 'rgba(245, 245, 245, 0.5)',
                  textAlign: 'center'
                }}>
                  <Text size="4" style={{ color: '#666' }}>
                    No pending invoices at the moment.
                  </Text>
                </Card>
              ) : (
                <Flex direction="column" gap="4">
                  {pendingInvoices.map((invoice) => (
                    <Card key={invoice.id} style={{
                      padding: '24px',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid rgba(229, 229, 229, 0.5)',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}>
                      <Flex justify="between" align="start" gap="4">
                        <Flex direction="column" gap="2" style={{ flex: 1 }}>
                          <Flex align="center" gap="2">
                            <Text size="4" weight="bold" style={{ color: '#1a1a1a' }}>
                              {invoice.freelancerName}
                            </Text>
                            <Badge style={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}>
                              Pending
                            </Badge>
                          </Flex>
                          
                          <Text size="2" style={{ color: '#666', fontFamily: 'monospace' }}>
                            {invoice.freelancerAddress}
                          </Text>
                          
                          <Text size="3" style={{ color: '#333', marginTop: '8px' }}>
                            {invoice.projectDescription}
                          </Text>
                          
                          <Flex gap="6" style={{ marginTop: '12px' }}>
                            <Text size="2" style={{ color: '#666' }}>
                              <strong>Amount:</strong> {invoice.amount} SUI
                            </Text>
                            <Text size="2" style={{ color: '#666' }}>
                              <strong>Due:</strong> {invoice.dueDate}
                            </Text>
                            <Text size="2" style={{ color: '#666' }}>
                              <strong>Submitted:</strong> {invoice.submittedDate}
                            </Text>
                          </Flex>
                        </Flex>
                        
                        <Flex gap="2">
                          <Button
                            size="2"
                            style={{
                              backgroundColor: '#4caf50',
                              color: 'white',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleApproveInvoice(invoice.id)}
                          >
                            <CheckIcon style={{ width: '16px', height: '16px' }} />
                            Approve
                          </Button>
                          <Button
                            size="2"
                            variant="outline"
                            style={{
                              color: '#f44336',
                              borderColor: '#f44336',
                              cursor: 'pointer'
                            }}
                            onClick={() => handleRejectInvoice(invoice.id)}
                          >
                            <CrossCircledIcon style={{ width: '16px', height: '16px' }} />
                            Reject
                          </Button>
                        </Flex>
                      </Flex>
                    </Card>
                  ))}
                </Flex>
              )}
            </Flex>
          </Card>
        </Flex>
      </Container>
    </div>
  );
}