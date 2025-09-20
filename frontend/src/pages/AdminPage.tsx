import React, { useState, useEffect } from 'react';
import { Container, Card, Flex, Text, Button, Badge, Dialog } from '@radix-ui/themes';
import { useCurrentAccount, useSignPersonalMessage, useSuiClient, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { CheckIcon, CrossCircledIcon, PersonIcon, FileIcon, ExternalLinkIcon, EyeOpenIcon, DownloadIcon } from '@radix-ui/react-icons';
import { fromHex } from '@mysten/sui/utils';
import { Transaction } from '@mysten/sui/transactions';
import {
  SealClient,
  SessionKey,
  type ExportedSessionKey
} from '@mysten/seal';
import { downloadAndDecrypt, MoveCallConstructor } from '../utils';
import { set, get } from 'idb-keyval';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { useNetworkVariable } from '../networkConfig';

const TTL_MIN = 10;

function constructMoveCall(packageId: string, allowlistId: string): MoveCallConstructor {
  return (tx: Transaction, id: string) => {
    tx.moveCall({
      target: `${packageId}::allowlist::seal_approve`,
      arguments: [tx.pure.vector('u8', fromHex(id)), tx.object(allowlistId)],
    });
  };
}

export function AdminPage() {
  const currentAccount = useCurrentAccount();
  const adminWalletAddress = import.meta.env.VITE_ADMIN_WALLET_ADDRESS;
  const suiClient = useSuiClient();
  const packageId = useNetworkVariable('packageId');
  const mvrName = useNetworkVariable('mvrName');
  const { mutate: signPersonalMessage } = useSignPersonalMessage();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  
  const isAdmin = currentAccount?.address === adminWalletAddress;
  const [createdAllowlists, setCreatedAllowlists] = useState<any[]>([]);
  
  // Decrypt states
  const [decryptedFileUrls, setDecryptedFileUrls] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string>('');
  const [reloadKey, setReloadKey] = useState(0);
  const [isDecrypting, setIsDecrypting] = useState(false);
  
  // Payment states
  const [isSuiPaymentProcessing, setIsSuiPaymentProcessing] = useState(false);
  const [isWormholePaymentProcessing, setIsWormholePaymentProcessing] = useState(false);
  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<'sui' | 'wormhole' | null>(null);

  // Seal client for decryption
  const serverObjectIds = [
    "0x73d05d62c18d9374e3ea529e8e0ed6161da1a141a94d3f76ae3fe4e99356db75", 
    "0xf5d14a81a982144ae441cd7d64b09027f116a468bd36e7eca494f750591623c8"
  ];
  const sealClient = new SealClient({
    suiClient,
    serverConfigs: serverObjectIds.map((id) => ({
      objectId: id,
      weight: 1,
    })),
    verifyKeyServers: false,
  });

  // Load created allowlists from localStorage
  useEffect(() => {
    const loadAllowlists = () => {
      try {
        const stored = localStorage.getItem('createdAllowlists');
        if (stored) {
          setCreatedAllowlists(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading allowlists from localStorage:', error);
      }
    };
    
    loadAllowlists();
    
    // Set up interval to check for new allowlists every 5 seconds
    const interval = setInterval(loadAllowlists, 5000);
    
    return () => clearInterval(interval);
  }, []);

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
        minHeight: '100vh',
        padding: '64px 0',
        backdropFilter: 'blur(5px)'
      }}>
        <Container size="3">
          <Card style={{
            padding: '48px',
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

  // Download and decrypt function for allowlist files
  const handleDownloadDecrypt = async (allowlist: any) => {
    if (!currentAccount?.address) {
      alert('Please connect your wallet first');
      return;
    }

    setIsDecrypting(true);
    setError('');
    
    try {
      // Get blob IDs from the allowlist (we'll use the stored blobId)
      const blobIds = [allowlist.blobId];
      const allowlistId = allowlist.id;
      const suiAddress = currentAccount.address;

      const imported: ExportedSessionKey = await get('sessionKey');

      if (imported) {
        try {
          const currentSessionKey = await SessionKey.import(
            imported,
            new SuiClient({ url: getFullnodeUrl('testnet') }),
          );
          console.log('loaded currentSessionKey', currentSessionKey);
          if (
            currentSessionKey &&
            !currentSessionKey.isExpired() &&
            currentSessionKey.getAddress() === suiAddress
          ) {
            const moveCallConstructor = constructMoveCall(packageId, allowlistId);
            await downloadAndDecrypt(
              blobIds,
              currentSessionKey,
              suiClient,
              sealClient,
              moveCallConstructor,
(error: string | null) => setError(error || ''),
              setDecryptedFileUrls,
              setIsDialogOpen,
              setReloadKey,
            );
            setIsDecrypting(false);
            return;
          }
        } catch (error) {
          console.log('Imported session key is expired', error);
        }
      }

      set('sessionKey', null);

      const sessionKey = await SessionKey.create({
        address: suiAddress,
        packageId,
        ttlMin: TTL_MIN,
        suiClient,
        mvrName,
      });

      try {
        signPersonalMessage(
          {
            message: sessionKey.getPersonalMessage(),
          },
          {
            onSuccess: async (result: { signature: string }) => {
              await sessionKey.setPersonalMessageSignature(result.signature);
              const moveCallConstructor = constructMoveCall(packageId, allowlistId);
              await downloadAndDecrypt(
                blobIds,
                sessionKey,
                suiClient,
                sealClient,
                moveCallConstructor,
  (error: string | null) => setError(error || ''),
                setDecryptedFileUrls,
                setIsDialogOpen,
                setReloadKey,
              );
              set('sessionKey', sessionKey.export());
              setIsDecrypting(false);
            },
            onError: (error) => {
              console.error('Error signing message:', error);
              setError('Failed to sign message for decryption');
              setIsDecrypting(false);
            }
          },
        );
      } catch (error: any) {
        console.error('Error:', error);
        setError('Failed to decrypt file: ' + error.message);
        setIsDecrypting(false);
      }
    } catch (error: any) {
      console.error('Download decrypt error:', error);
      setError('Failed to decrypt file: ' + error.message);
      setIsDecrypting(false);
    }
  };

  // SUI Payment function for invoices
  const handlePayToSui = async (invoice: any) => {
    if (!currentAccount?.address) {
      alert('Please connect your wallet first');
      return;
    }

    if (!adminWalletAddress) {
      alert('Admin wallet address not configured');
      return;
    }

    // Extract amount from filename or use default (you can modify this logic)
    const defaultAmount = 1000000000; // 1 SUI in MIST (1 SUI = 1,000,000,000 MIST)
    let amountToSend = defaultAmount;
    
    // Try to extract amount from filename if it contains amount info
    const fileName = invoice.fileName || '';
    const amountMatch = fileName.match(/(\d+(?:\.\d+)?)\s*SUI/i);
    if (amountMatch) {
      const amount = parseFloat(amountMatch[1]);
      amountToSend = Math.floor(amount * 1000000000); // Convert SUI to MIST
    }

    setIsSuiPaymentProcessing(true);
    setPayingInvoiceId(invoice.id);
    setPaymentType('sui');

    try {
      const tx = new Transaction();
      
      // Create a SUI transfer transaction
      const [coin] = tx.splitCoins(tx.gas, [amountToSend]);
      tx.transferObjects([coin], adminWalletAddress);

      // Set gas budget
      tx.setGasBudget(10000000);

      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: async (result) => {
            console.log('Payment successful:', result);
            
            // Mark invoice as paid in localStorage
            const existingAllowlists = JSON.parse(localStorage.getItem('createdAllowlists') || '[]');
            const updatedAllowlists = existingAllowlists.map((item: any) => 
              item.id === invoice.id 
                ? { ...item, status: 'Paid (SUI)', paidAt: new Date().toISOString(), paymentTxDigest: result.digest, paymentMethod: 'SUI' }
                : item
            );
            localStorage.setItem('createdAllowlists', JSON.stringify(updatedAllowlists));
            setCreatedAllowlists(updatedAllowlists);
            
            alert(`✅ SUI Payment successful!\n\nAmount: ${(amountToSend / 1000000000).toFixed(2)} SUI\nTransaction: ${result.digest}\n\nInvoice has been marked as paid via SUI.`);
            setIsSuiPaymentProcessing(false);
            setPayingInvoiceId(null);
            setPaymentType(null);
          },
          onError: (error) => {
            console.error('SUI Payment failed:', error);
            alert(`❌ SUI Payment failed: ${error.message || 'Unknown error'}\n\nPlease try again.`);
            setIsSuiPaymentProcessing(false);
            setPayingInvoiceId(null);
            setPaymentType(null);
          }
        }
      );
    } catch (error: any) {
      console.error('SUI Payment error:', error);
      alert(`❌ SUI Payment failed: ${error.message || 'Unknown error'}\n\nPlease try again.`);
      setIsSuiPaymentProcessing(false);
      setPayingInvoiceId(null);
      setPaymentType(null);
    }
  };

  // Wormhole Payment function for cross-chain payments to Sepolia
  const handlePayToSepolia = async (invoice: any) => {
    if (!currentAccount?.address) {
      alert('Please connect your wallet first');
      return;
    }

    // Extract amount from filename or use default
    const defaultAmount = 1000000000; // 1 SUI in MIST
    let amountToSend = defaultAmount;
    
    // Try to extract amount from filename if it contains amount info
    const fileName = invoice.fileName || '';
    const amountMatch = fileName.match(/(\d+(?:\.\d+)?)\s*SUI/i);
    if (amountMatch) {
      const amount = parseFloat(amountMatch[1]);
      amountToSend = Math.floor(amount * 1000000000); // Convert SUI to MIST
    }

    setIsWormholePaymentProcessing(true);
    setPayingInvoiceId(invoice.id);
    setPaymentType('wormhole');

    try {
      // For now, we'll simulate the Wormhole process
      // In a real implementation, this would:
      // 1. Create a Wormhole transfer transaction on SUI
      // 2. Wait for attestation
      // 3. Submit the VAA to Sepolia
      
      alert('🌉 Wormhole Cross-Chain Payment\n\nInitiating cross-chain transfer to Sepolia...\n\nNote: This is a demo implementation. In production, this would:\n1. Lock tokens on SUI via Wormhole\n2. Generate VAA (Verifiable Action Approval)\n3. Transfer to Sepolia Ethereum testnet\n4. Complete cross-chain transaction');
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate successful cross-chain transfer
      const mockTxDigest = `wormhole_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      // Mark invoice as paid via Wormhole in localStorage
      const existingAllowlists = JSON.parse(localStorage.getItem('createdAllowlists') || '[]');
      const updatedAllowlists = existingAllowlists.map((item: any) => 
        item.id === invoice.id 
          ? { 
              ...item, 
              status: 'Paid (Wormhole)', 
              paidAt: new Date().toISOString(), 
              paymentTxDigest: mockTxDigest, 
              paymentMethod: 'Wormhole',
              targetChain: 'Sepolia'
            }
          : item
      );
      localStorage.setItem('createdAllowlists', JSON.stringify(updatedAllowlists));
      setCreatedAllowlists(updatedAllowlists);
      
      alert(`✅ Wormhole Payment successful!\n\nAmount: ${(amountToSend / 1000000000).toFixed(2)} SUI equivalent\nTarget Chain: Sepolia (Ethereum Testnet)\nTransaction: ${mockTxDigest}\n\nInvoice has been marked as paid via Wormhole.`);
      setIsWormholePaymentProcessing(false);
      setPayingInvoiceId(null);
      setPaymentType(null);
      
    } catch (error: any) {
      console.error('Wormhole Payment error:', error);
      alert(`❌ Wormhole Payment failed: ${error.message || 'Unknown error'}\n\nPlease try again.`);
      setIsWormholePaymentProcessing(false);
      setPayingInvoiceId(null);
      setPaymentType(null);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '64px 0',
      backdropFilter: 'blur(5px)'
    }}>
      <Container size="4">
        <Flex direction="column" gap="8">

          {/* Created Allowlists Section */}
          <Card style={{
            padding: '32px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <Flex direction="column" gap="6">
              <div>
                <Text size="6" weight="bold" style={{ color: '#1a1a1a', display: 'block', marginBottom: '4px' }}>
                  Created Invoices
                </Text>
              </div>

              {createdAllowlists.length === 0 ? (
                <Card style={{
                  padding: '48px',
                  backgroundColor: 'rgba(245, 245, 245, 0.5)',
                  textAlign: 'center'
                }}>
                  <Flex direction="column" align="center" gap="3">
                    <FileIcon style={{ width: '32px', height: '32px', color: '#999' }} />
                    <Text size="4" style={{ color: '#666' }}>
                      No allowlists created yet.
                    </Text>
                    <Text size="2" style={{ color: '#999' }}>
                      Use the "Secure Upload" feature to create your first allowlist.
                    </Text>
                  </Flex>
                </Card>
              ) : (
                <Flex direction="column" gap="4">
                  {createdAllowlists.map((allowlist, index) => (
                    <Card key={allowlist.id || index} style={{
                      padding: '24px',
                      border: '1px solid rgba(229, 229, 229, 0.5)',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}>
                      <Flex justify="between" align="start" gap="4">
                        <Flex direction="column" gap="2" style={{ flex: 1 }}>
                          <Flex align="center" gap="3">
                            <FileIcon style={{ width: '20px', height: '20px', color: '#1976d2' }} />
                            <Text size="4" weight="bold" style={{ color: '#1a1a1a' }}>
                              {allowlist.fileName}
                            </Text>
                            <Badge style={{ 
                              backgroundColor: allowlist.status?.includes('Paid') ? '#e8f5e8' : '#fff3cd', 
                              color: allowlist.status?.includes('Paid') ? '#2e7d2e' : '#856404' 
                            }}>
                              {allowlist.status?.includes('Paid') ? `✅ ${allowlist.status}` : '💼 Pending'}
                            </Badge>
                          </Flex>
                          
                          <Text size="2" style={{ color: '#666', fontFamily: 'monospace' }}>
                            ID: {allowlist.id?.slice(0, 20)}...{allowlist.id?.slice(-10)}
                          </Text>
                          
                          <Flex direction="column" gap="1">
                            <Text size="2" style={{ color: '#666' }}>
                              <strong>File Type:</strong> {allowlist.fileType || 'Unknown'}
                            </Text>
                            <Text size="2" style={{ color: '#666' }}>
                              <strong>Created:</strong> {new Date(allowlist.createdAt).toLocaleString()}
                            </Text>
                            {allowlist.status?.includes('Paid') && allowlist.paidAt && (
                              <Text size="2" style={{ color: '#10b981' }}>
                                <strong>Paid:</strong> {new Date(allowlist.paidAt).toLocaleString()}
                              </Text>
                            )}
                            {allowlist.paymentMethod && (
                              <Text size="2" style={{ color: '#10b981' }}>
                                <strong>Method:</strong> {allowlist.paymentMethod} {allowlist.targetChain ? `→ ${allowlist.targetChain}` : ''}
                              </Text>
                            )}
                            {allowlist.paymentTxDigest && (
                              <Text size="2" style={{ color: '#666' }}>
                                <strong>Payment TX:</strong> {allowlist.paymentTxDigest.slice(0, 15)}...
                              </Text>
                            )}
                            <Text size="2" style={{ color: '#666' }}>
                              <strong>Blob ID:</strong> {allowlist.blobId?.slice(0, 15)}...
                            </Text>
                          </Flex>
                        </Flex>
                        
                        <Flex direction="column" gap="2" style={{ minWidth: '180px' }}>
                                                
                            <Button 
                              size="2"
                              style={{
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              onClick={() => handleDownloadDecrypt(allowlist)}
                              disabled={isDecrypting}
                            >
                              <DownloadIcon style={{ width: '14px', height: '14px' }} />
                              {isDecrypting ? 'Decrypting...' : 'View Invoice'}
                            </Button>
                            
                            {/* Pay to SUI Button */}
                            <Button 
                              size="2"
                              style={{
                                backgroundColor: allowlist.status?.includes('Paid') ? '#666' : '#1976d2',
                                color: 'white',
                                border: 'none',
                                cursor: allowlist.status?.includes('Paid') ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                opacity: allowlist.status?.includes('Paid') ? 0.6 : 1
                              }}
                              onClick={() => handlePayToSui(allowlist)}
                              disabled={allowlist.status?.includes('Paid') || (isSuiPaymentProcessing && payingInvoiceId === allowlist.id)}
                            >
                              {allowlist.status?.includes('Paid') ? (
                                <>
                                  <CheckIcon style={{ width: '14px', height: '14px' }} />
                                  Paid
                                </>
                              ) : (isSuiPaymentProcessing && payingInvoiceId === allowlist.id && paymentType === 'sui') ? (
                                <>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  💎 Pay to SUI
                                </>
                              )}
                            </Button>
                            
                            {/* Pay to Sepolia via Wormhole Button */}
                            <Button 
                              size="2"
                              style={{
                                backgroundColor: allowlist.status?.includes('Paid') ? '#666' : '#8b5cf6',
                                color: 'white',
                                border: 'none',
                                cursor: allowlist.status?.includes('Paid') ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                opacity: allowlist.status?.includes('Paid') ? 0.6 : 1
                              }}
                              onClick={() => handlePayToSepolia(allowlist)}
                              disabled={allowlist.status?.includes('Paid') || (isWormholePaymentProcessing && payingInvoiceId === allowlist.id)}
                            >
                              {allowlist.status?.includes('Paid') ? (
                                <>
                                  <CheckIcon style={{ width: '14px', height: '14px' }} />
                                  Paid
                                </>
                              ) : (isWormholePaymentProcessing && payingInvoiceId === allowlist.id && paymentType === 'wormhole') ? (
                                <>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  🌉 Pay to Sepolia
                                </>
                              )}
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

      {/* Decrypted Files Dialog */}
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Content style={{ maxWidth: '600px' }}>
          <Dialog.Title>Decrypted Invoice</Dialog.Title>
          
          {error && (
            <Card style={{ 
              padding: '16px', 
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              border: '1px solid rgba(244, 67, 54, 0.3)',
              marginBottom: '16px'
            }}>
              <Text style={{ color: '#d32f2f' }}>
                Error: {error}
              </Text>
            </Card>
          )}

          {decryptedFileUrls.length > 0 && (
            <Flex direction="column" gap="3">
              {decryptedFileUrls.map((url, index) => (
                <Card key={`${url}-${reloadKey}-${index}`} style={{ 
                  padding: '16px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  backgroundColor: 'rgba(16, 185, 129, 0.05)'
                }}>
                  <Flex direction="column" gap="3" align="center">
                    <img 
                      src={url} 
                      alt={`Decrypted file ${index + 1}`}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        objectFit: 'contain',
                        borderRadius: '8px'
                      }}
                    />
                    <Button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `decrypted-file-${index + 1}`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white'
                      }}
                    >
                      <DownloadIcon style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                      Download File {index + 1}
                    </Button>
                  </Flex>
                </Card>
              ))}
            </Flex>
          )}

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="outline">Close</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}