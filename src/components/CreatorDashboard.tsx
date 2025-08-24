import React, { useState } from 'react';
import { ContentUpload } from './ContentUpload';
import { FingerprintDisplay } from './FingerprintDisplay';
import { NFTMintingFlow } from './NFTMintingFlow';
import { FingerprintResult } from '@/services/fingerprintService';

export function CreatorDashboard() {
  const [fingerprint, setFingerprint] = useState<FingerprintResult | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [showMinting, setShowMinting] = useState(false);

  const handleFingerprintGenerated = (result: FingerprintResult, file: File) => {
    setFingerprint(result);
    setFileName(file.name);
  };

  const handleMintNFT = () => {
    setShowMinting(true);
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Create Your
            <span className="gradient-primary bg-clip-text text-transparent"> AI Fingerprint</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your creative content to generate a unique AI-powered fingerprint, then mint it as an NFT for permanent IP protection
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {!fingerprint && (
            <ContentUpload onFingerprintGenerated={handleFingerprintGenerated} />
          )}

          {fingerprint && !showMinting && (
            <FingerprintDisplay
              fingerprint={fingerprint}
              fileName={fileName}
              onMintNFT={handleMintNFT}
            />
          )}

          {fingerprint && showMinting && (
            <NFTMintingFlow
              fingerprint={fingerprint}
              fileName={fileName}
            />
          )}
        </div>
      </div>
    </section>
  );
}