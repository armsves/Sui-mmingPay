import React from 'react';
import { Flex, Text, Link as RadixLink } from '@radix-ui/themes';
import { ExternalLinkIcon, GitHubLogoIcon } from '@radix-ui/react-icons';

export function Footer() {
    return (
        <footer style={{
            backgroundColor: 'rgba(255,255,255,0.30)',
            borderTop: 'none',
            boxShadow: 'none',
            padding: '10px 0'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 4px' }}>
                <Flex direction="column" gap="6" align="center">
                    {/* Technologies and Social Links Section */}
                    <Flex gap="12" align="center" wrap="wrap" justify="center">
                        {/* Powered by section */}
                        <Flex gap="6" align="center" wrap="wrap">
                            <Text size="4" weight="medium" style={{ color: '#1565c0' }}>
                                Powered by:
                            </Text>

                            {/* Sui Logo */}
                            <Flex align="center" gap="2" style={{ transition: 'transform 0.2s' }}>
                                <img
                                    src="/sui-logo.png"
                                    alt="Sui"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        objectFit: 'contain'
                                    }}
                                />
                            </Flex>

                            {/* Walrus Logo */}
                            <Flex align="center" gap="2" style={{ transition: 'transform 0.2s' }}>
                                <img
                                    src="/walrus-logo.png"
                                    alt="Walrus"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        objectFit: 'contain'
                                    }}
                                />
                            </Flex>

                            {/* Seal Logo */}
                            <Flex align="center" gap="2" style={{ transition: 'transform 0.2s' }}>
                                <img
                                    src="/seal-logo.jpeg"
                                    alt="Seal"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        objectFit: 'contain',
                                        borderRadius: '4px'
                                    }}
                                />
                            </Flex>

                            {/* Wormhole Logo */}
                            <Flex align="center" gap="2" style={{ transition: 'transform 0.2s' }}>
                                <img
                                    src="/wormhole-logo.png"
                                    alt="Wormhole"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        objectFit: 'contain'
                                    }}
                                />
                            </Flex>
                            <RadixLink href="https://github.com/armsves/Sui-mmingPay" target="_blank" style={{ color: '#1565c0', transition: 'color 0.2s', textDecoration: 'none' }}>
                                <Flex align="center" gap="1" style={{ transition: 'transform 0.2s' }}>
                                    <GitHubLogoIcon style={{ width: '28px', height: '28px' }} />
                                </Flex>
                            </RadixLink>

                            <RadixLink href="https://x.com/armsves" target="_blank" style={{ color: '#1565c0', transition: 'color 0.2s', textDecoration: 'none' }}>
                                <Flex align="center" gap="1" style={{ transition: 'transform 0.2s' }}>
                                    {/* X (formerly Twitter) Logo */}
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </Flex>
                            </RadixLink>

                        </Flex>
                    </Flex>

                    {/* Copyright */}
                    <Text size="2" style={{ color: '#1565c0', textAlign: 'center' }}>
                        © 2025 Sui-mmingPay. A freelancer payroll system on Sui blockchain.
                    </Text>
                </Flex>
            </div>
        </footer>
    );
}