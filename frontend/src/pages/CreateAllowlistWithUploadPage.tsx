// Copyright (c), Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { Button, Card, Flex, Container, Text, Separator, Spinner } from '@radix-ui/themes';
import { useSignAndExecuteTransaction, useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { useNavigate } from 'react-router-dom';
import { useNetworkVariable } from '../networkConfig';
import { SealClient } from '@mysten/seal';
import { fromHex, toHex } from '@mysten/sui/utils';

type Data = {
  status: string;
  blobId: string;
  endEpoch: string;
  suiRefType: string;
  suiRef: string;
  suiBaseUrl: string;
  blobUrl: string;
  suiUrl: string;
  isImage: string;
};

type WalrusService = {
  id: string;
  name: string;
  publisherUrl: string;
  aggregatorUrl: string;
};

export function CreateAllowlistWithUploadPage() {
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();
  const [createdAllowlistId, setCreatedAllowlistId] = useState<string>('');
  const [capId, setCapId] = useState<string>('');
  
  // File upload states
  const [file, setFile] = useState<File | null>(null);
  const [uploadInfo, setUploadInfo] = useState<Data | null>(null);
  const [selectedService, setSelectedService] = useState<string>('service1');
  
  // Process states
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [processComplete, setProcessComplete] = useState(false);

  const SUI_VIEW_TX_URL = `https://suiscan.xyz/testnet/tx`;
  const SUI_VIEW_OBJECT_URL = `https://suiscan.xyz/testnet/object`;
  const NUM_EPOCH = 1;

  const packageId = useNetworkVariable('packageId');
  const suiClient = useSuiClient();

  // Seal client for encryption
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

  const services: WalrusService[] = [
    {
      id: 'service1',
      name: 'walrus.space',
      publisherUrl: '/publisher1',
      aggregatorUrl: '/aggregator1',
    },
    {
      id: 'service2',
      name: 'staketab.org',
      publisherUrl: '/publisher2',
      aggregatorUrl: '/aggregator2',
    },
    {
      id: 'service3',
      name: 'redundex.com',
      publisherUrl: '/publisher3',
      aggregatorUrl: '/aggregator3',
    },
    {
      id: 'service4',
      name: 'nodes.guru',
      publisherUrl: '/publisher4',
      aggregatorUrl: '/aggregator4',
    },
    {
      id: 'service5',
      name: 'banansen.dev',
      publisherUrl: '/publisher5',
      aggregatorUrl: '/aggregator5',
    },
    {
      id: 'service6',
      name: 'everstake.one',
      publisherUrl: '/publisher6',
      aggregatorUrl: '/aggregator6',
    },
  ];

  const { mutate: signAndExecute } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showRawEffects: true,
          showEffects: true,
        },
      }),
  });

  // Helper functions for Walrus URLs
  function getAggregatorUrl(path: string): string {
    const service = services.find((s) => s.id === selectedService);
    const cleanPath = path.replace(/^\/+/, '').replace(/^v1\//, '');
    return `${service?.aggregatorUrl}/v1/${cleanPath}`;
  }

  function getPublisherUrl(path: string): string {
    const service = services.find((s) => s.id === selectedService);
    const cleanPath = path.replace(/^\/+/, '').replace(/^v1\//, '');
    return `${service?.publisherUrl}/v1/${cleanPath}`;
  }

  // Master function that handles the entire process
  async function handleCompleteProcess() {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    if (!currentAccount?.address) {
      alert('Please connect your wallet first');
      return;
    }

    setIsProcessing(true);
    setCompletedSteps([]);
    setProcessComplete(false);
    
    try {
      // Step 1: Create allowlist
      setCurrentStep('Creating allowlist on blockchain...');
      const allowlistId = await createAllowlistStep();
      setCompletedSteps(prev => [...prev, 'allowlist-created']);
      
      // Step 2: Get Cap ID and add admin
      setCurrentStep('Adding admin to allowlist...');
      const capId = await addAdminStep(allowlistId);
      setCompletedSteps(prev => [...prev, 'admin-added']);
      
      // Step 3: Encrypt and upload file
      setCurrentStep('Encrypting and uploading file to Walrus...');
      const uploadResult = await encryptAndUploadStep(allowlistId);
      setCompletedSteps(prev => [...prev, 'file-uploaded']);
      
      // Step 4: Associate file with allowlist
      setCurrentStep('Associating file with allowlist...');
      await associateFileStep(allowlistId, capId, uploadResult.blobId);
      setCompletedSteps(prev => [...prev, 'file-associated']);
      
      // Complete!
      setCurrentStep('');
      setProcessComplete(true);
      setCreatedAllowlistId(allowlistId);
      setCapId(capId);
      setUploadInfo(uploadResult.uploadInfo);
      setIsProcessing(false);
      
      // Store allowlist information in localStorage for admin portal
      const allowlistData = {
        id: allowlistId,
        capId: capId,
        fileName: file?.name || 'Unknown file',
        fileType: file?.type || 'unknown',
        createdAt: new Date().toISOString(),
        createdBy: currentAccount?.address,
        blobId: uploadResult.blobId,
        status: 'Active',
        blobUrl: uploadResult.uploadInfo.blobUrl,
        suiUrl: uploadResult.uploadInfo.suiUrl
      };
      
      // Get existing allowlists from localStorage or create empty array
      const existingAllowlists = JSON.parse(localStorage.getItem('createdAllowlists') || '[]');
      
      // Add new allowlist to the beginning of the array
      existingAllowlists.unshift(allowlistData);
      
      // Keep only the last 20 allowlists to avoid localStorage bloat
      if (existingAllowlists.length > 20) {
        existingAllowlists.splice(20);
      }
      
      // Store back to localStorage
      localStorage.setItem('createdAllowlists', JSON.stringify(existingAllowlists));
      
      alert('🎉 Complete! Your file has been encrypted, uploaded, and associated with a new allowlist!\n\nYou can view this allowlist in the Admin Portal or share the link with authorized users.');
      
    } catch (error) {
      console.error('Process failed:', error);
      setIsProcessing(false);
      setCurrentStep('');
      alert(`Process failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Step 1: Create allowlist
  async function createAllowlistStep(): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileName = file?.name || 'file';
      const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
      const allowlistName = `${fileName} - ${timestamp}`;
      
      const tx = new Transaction();
      tx.moveCall({
        target: `${packageId}::allowlist::create_allowlist_entry`,
        arguments: [tx.pure.string(allowlistName)],
      });
      tx.setGasBudget(10000000);
      
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: async (result) => {
            const allowlistObject = result.effects?.created?.find(
              (item) => item.owner && typeof item.owner === 'object' && 'Shared' in item.owner,
            );
            const createdObjectId = allowlistObject?.reference?.objectId;
            
            if (createdObjectId) {
              resolve(createdObjectId);
            } else {
              reject(new Error('Failed to extract allowlist ID from transaction'));
            }
          },
          onError: (error) => reject(error)
        }
      );
    });
  }

  // Step 2: Add admin to allowlist
  async function addAdminStep(allowlistId: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        // Wait a bit for blockchain to process, then fetch cap
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const res = await suiClient.getOwnedObjects({
          owner: currentAccount?.address!,
          options: { showContent: true, showType: true },
          filter: { StructType: `${packageId}::allowlist::Cap` },
        });

        const capData = res.data
          .map((obj) => {
            const fields = (obj!.data!.content as { fields: any }).fields;
            return { id: fields?.id.id, allowlist_id: fields?.allowlist_id };
          })
          .find((item) => item.allowlist_id === allowlistId);

        if (!capData?.id) {
          reject(new Error('Could not find Cap for allowlist'));
          return;
        }

        const tx = new Transaction();
        tx.moveCall({
          arguments: [tx.object(allowlistId), tx.object(capData.id), tx.pure.address(currentAccount?.address!)],
          target: `${packageId}::allowlist::add`,
        });
        tx.setGasBudget(10000000);

        signAndExecute(
          { transaction: tx },
          {
            onSuccess: () => resolve(capData.id),
            onError: (error) => reject(error)
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  // Step 3: Encrypt and upload file
  async function encryptAndUploadStep(allowlistId: string): Promise<{blobId: string, uploadInfo: Data}> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async function (event) {
        if (event.target && event.target.result instanceof ArrayBuffer) {
          const result = event.target.result;
          try {
            const nonce = crypto.getRandomValues(new Uint8Array(5));
            const policyObjectBytes = fromHex(allowlistId);
            const id = toHex(new Uint8Array([...policyObjectBytes, ...nonce]));
            const { encryptedObject: encryptedBytes } = await sealClient.encrypt({
              threshold: 2,
              packageId,
              id,
              data: new Uint8Array(result),
            });
            
            const storageInfo = await storeBlob(encryptedBytes);
            const uploadInfo = createUploadInfo(storageInfo.info, file!.type);
            
            let blobId: string;
            if ('alreadyCertified' in storageInfo.info) {
              blobId = storageInfo.info.alreadyCertified.blobId;
            } else if ('newlyCreated' in storageInfo.info) {
              blobId = storageInfo.info.newlyCreated.blobObject.blobId;
            } else {
              throw new Error('Could not extract blob ID from storage info');
            }
            
            resolve({ blobId, uploadInfo });
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error('Invalid file data'));
        }
      };
      reader.readAsArrayBuffer(file!);
    });
  }

  // Step 4: Associate file with allowlist
  async function associateFileStep(allowlistId: string, capId: string, blobId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const tx = new Transaction();
      tx.moveCall({
        target: `${packageId}::allowlist::publish`,
        arguments: [tx.object(allowlistId), tx.object(capId), tx.pure.string(blobId)],
      });
      tx.setGasBudget(10000000);
      
      signAndExecute(
        { transaction: tx },
        {
          onSuccess: () => resolve(),
          onError: (error) => reject(error)
        }
      );
    });
  }

  // Helper functions
  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    if (selectedFile?.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10 MiB');
      return;
    }
    if (selectedFile && !selectedFile.type.startsWith('image/')) {
      alert('Only image files are allowed');
      return;
    }
    setFile(selectedFile);
    // Reset states when new file is selected
    setUploadInfo(null);
    setCompletedSteps([]);
    setProcessComplete(false);
  };

  const storeBlob = (encryptedData: Uint8Array) => {
    return fetch(`${getPublisherUrl(`/v1/blobs?epochs=${NUM_EPOCH}`)}`, {
      method: 'PUT',
      body: encryptedData as BodyInit,
    }).then((response) => {
      if (response.status === 200) {
        return response.json().then((info) => ({ info }));
      } else {
        throw new Error('Failed to store blob on Walrus');
      }
    });
  };

  const createUploadInfo = (storage_info: any, media_type: string): Data => {
    if ('alreadyCertified' in storage_info) {
      return {
        status: 'Already certified',
        blobId: storage_info.alreadyCertified.blobId,
        endEpoch: storage_info.alreadyCertified.endEpoch,
        suiRefType: 'Previous Sui Certified Event',
        suiRef: storage_info.alreadyCertified.event.txDigest,
        suiBaseUrl: SUI_VIEW_TX_URL,
        blobUrl: getAggregatorUrl(`/v1/blobs/${storage_info.alreadyCertified.blobId}`),
        suiUrl: `${SUI_VIEW_OBJECT_URL}/${storage_info.alreadyCertified.event.txDigest}`,
        isImage: media_type.startsWith('image') ? 'true' : 'false',
      };
    } else if ('newlyCreated' in storage_info) {
      return {
        status: 'Newly created',
        blobId: storage_info.newlyCreated.blobObject.blobId,
        endEpoch: storage_info.newlyCreated.blobObject.storage.endEpoch,
        suiRefType: 'Associated Sui Object',
        suiRef: storage_info.newlyCreated.blobObject.id,
        suiBaseUrl: SUI_VIEW_OBJECT_URL,
        blobUrl: getAggregatorUrl(`/v1/blobs/${storage_info.newlyCreated.blobObject.blobId}`),
        suiUrl: `${SUI_VIEW_OBJECT_URL}/${storage_info.newlyCreated.blobObject.id}`,
        isImage: media_type.startsWith('image') ? 'true' : 'false',
      };
    } else {
      throw new Error('Unhandled upload response format');
    }
  };


  const handleViewAll = () => {
    navigate(`/allowlist-example/admin/allowlists`);
  };

  const handleViewAllowlist = () => {
    if (createdAllowlistId) {
      window.open(
        `${window.location.origin}/allowlist-example/admin/allowlist/${createdAllowlistId}`,
        '_blank',
      );
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '64px 0',
      backdropFilter: 'blur(5px)'
    }}>
      <Container size="4">
        <Flex direction="column" gap="6">

          <Card style={{
            padding: '32px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <Flex direction="column" gap="4">
              <Text size="6" weight="bold" style={{ color: '#333' }}>
                Select File
              </Text>
              
              <Flex gap="3" align="center">
                <Text size="3">Walrus service:</Text>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  disabled={isProcessing}
                  style={{
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </Flex>
              
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                disabled={isProcessing}
                style={{
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              />
              <Text size="2" style={{ color: '#666' }}>
                File size must be less than 10 MiB. Only image files are allowed.
              </Text>
              
              <Button
                onClick={handleCompleteProcess}
                disabled={!file || isProcessing}
                size="4"
                style={{
                  padding: '16px 32px',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}
              >
                {isProcessing ? (
                  <Flex align="center" gap="3">
                    <Spinner /> Processing...
                  </Flex>
                ) : 'Encrypt & Upload Invoice'}
              </Button>

              {/* Progress Display */}
              {isProcessing && currentStep && (
                <Card style={{ padding: '16px', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                  <Flex direction="column" gap="2">
                    <Text size="4" weight="bold" style={{ color: '#1976d2' }}>
                      🔄 {currentStep}
                    </Text>
                    <Flex direction="column" gap="1">
                      <Text size="2" style={{ color: completedSteps.includes('allowlist-created') ? '#10b981' : '#666' }}>
                        {completedSteps.includes('allowlist-created') ? '✅' : '⏳'} Create allowlist on blockchain
                      </Text>
                      <Text size="2" style={{ color: completedSteps.includes('admin-added') ? '#10b981' : '#666' }}>
                        {completedSteps.includes('admin-added') ? '✅' : '⏳'} Add admin to allowlist
                      </Text>
                      <Text size="2" style={{ color: completedSteps.includes('file-uploaded') ? '#10b981' : '#666' }}>
                        {completedSteps.includes('file-uploaded') ? '✅' : '⏳'} Encrypt and upload file to Walrus
                      </Text>
                      <Text size="2" style={{ color: completedSteps.includes('file-associated') ? '#10b981' : '#666' }}>
                        {completedSteps.includes('file-associated') ? '✅' : '⏳'} Associate file with allowlist
                      </Text>
                    </Flex>
                  </Flex>
                </Card>
              )}

              {/* Success Display */}
              {processComplete && uploadInfo && (
                <Card style={{ padding: '20px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '2px solid #10b981' }}>
                  <Flex direction="column" gap="3">
                    <Text size="5" weight="bold" style={{ color: '#10b981' }}>
                      🎉 Complete Success!
                    </Text>
                    <Text size="3" style={{ color: '#059669' }}>
                      Your file has been encrypted, uploaded to Walrus, and associated with a new allowlist. 
                      Everything is ready and secure!
                    </Text>
                    
                    <Text size="3" weight="bold" style={{ color: '#333' }}>
                      Allowlist ID: {createdAllowlistId}
                    </Text>
                    <Text size="2" style={{ color: '#666' }}>
                      File: {file?.name} | Status: {uploadInfo.status}
                    </Text>
                    
                    <Flex direction="column" gap="2">
                      <Text size="3" weight="bold" style={{ color: '#333' }}>Quick Links:</Text>
                      <Flex gap="3" wrap="wrap">
                        <a
                          href={uploadInfo.blobUrl}
                          style={{ textDecoration: 'underline', color: '#1a73e8', fontWeight: 'bold' }}
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(uploadInfo.blobUrl, '_blank', 'noopener,noreferrer');
                          }}
                        >
                          📦 View Encrypted Blob
                        </a>
                        <a
                          href={uploadInfo.suiUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'underline', color: '#1a73e8', fontWeight: 'bold' }}
                        >
                          🔍 View Sui Object
                        </a>
                        <a
                          href={`${window.location.origin}/allowlist-example/view/allowlist/${createdAllowlistId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'underline', color: '#10b981', fontWeight: 'bold' }}
                        >
                          🔗 Access Allowlist
                        </a>
                        <Button size="2" variant="outline" onClick={handleViewAll}>
                          📋 View All Allowlists
                        </Button>
                        <Button size="2" onClick={() => navigate('/admin')}>
                          🏛️ Admin Portal
                        </Button>
                      </Flex>
                    </Flex>
                  </Flex>
                </Card>
              )}
            </Flex>
          </Card>
        </Flex>
      </Container>
    </div>
  );
}