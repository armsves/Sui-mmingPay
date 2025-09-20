import React, { useState, useEffect } from 'react';
import { Container, Card, Flex, Text, Button, Badge, Dialog } from '@radix-ui/themes';
import { useCurrentAccount, useSignPersonalMessage, useSuiClient } from '@mysten/dapp-kit';
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
  
  const isAdmin = currentAccount?.address === adminWalletAddress;
  const [createdAllowlists, setCreatedAllowlists] = useState<any[]>([]);
  
  // Decrypt states
  const [decryptedFileUrls, setDecryptedFileUrls] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string>('');
  const [reloadKey, setReloadKey] = useState(0);
  const [isDecrypting, setIsDecrypting] = useState(false);

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
                            <Badge style={{ backgroundColor: '#e8f5e8', color: '#2e7d2e' }}>
                              {allowlist.status || 'Active'}
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
                            <Text size="2" style={{ color: '#666' }}>
                              <strong>Blob ID:</strong> {allowlist.blobId?.slice(0, 15)}...
                            </Text>
                          </Flex>
                        </Flex>
                        
                        <Flex direction="column" gap="2" style={{ minWidth: '160px' }}>
                                                
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