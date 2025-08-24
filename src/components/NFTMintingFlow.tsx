import React, { useState } from 'react';
import { Wallet, Shield, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { aptosService, NFTMetadata, MintResult } from '@/services/aptosService';
import { FingerprintResult } from '@/services/fingerprintService';

interface NFTMintingFlowProps {
  fingerprint: FingerprintResult;
  fileName: string;
}

type MintingStep = 'connect' | 'details' | 'minting' | 'success' | 'error';

export function NFTMintingFlow({ fingerprint, fileName }: NFTMintingFlowProps) {
  const [currentStep, setCurrentStep] = useState<MintingStep>('connect');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [nftName, setNftName] = useState(fileName.split('.')[0]);
  const [description, setDescription] = useState('');
  const [royaltyPercentage, setRoyaltyPercentage] = useState([5]);
  const [mintResult, setMintResult] = useState<MintResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const connectWallet = async () => {
    setLoading(true);
    try {
      const result = await aptosService.connectWallet();
      if (result.success && result.address) {
        setWalletAddress(result.address);
        setCurrentStep('details');
        toast({
          title: "Wallet connected!",
          description: "Ready to mint your IP protection NFT",
        });
      } else {
        throw new Error(result.error || 'Failed to connect wallet');
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const mintNFT = async () => {
    setLoading(true);
    setCurrentStep('minting');

    try {
      const metadata: NFTMetadata = {
        name: nftName,
        description: description || `AI-verified intellectual property: ${nftName}`,
        fingerprint: fingerprint.fingerprint,
        contentType: fingerprint.contentType,
        confidence: fingerprint.confidence,
        features: fingerprint.features,
        creator: walletAddress,
        createdAt: fingerprint.timestamp,
        royaltyPercentage: royaltyPercentage[0]
      };

      const result = await aptosService.mintNFT(walletAddress, metadata);
      setMintResult(result);

      if (result.success) {
        setCurrentStep('success');
        toast({
          title: "NFT minted successfully!",
          description: "Your IP is now protected on the Aptos blockchain",
        });
      } else {
        setCurrentStep('error');
        toast({
          title: "Minting failed",
          description: result.error || "Failed to mint NFT",
          variant: "destructive"
        });
      }
    } catch (error) {
      setCurrentStep('error');
      toast({
        title: "Minting failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderConnectStep = () => (
    <Card className="creator-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Connect Aptos Wallet
        </CardTitle>
        <CardDescription>
          Connect your Aptos wallet to mint your IP protection NFT
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-8">
          <Wallet className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Ready to Protect Your IP</h3>
          <p className="text-muted-foreground mb-6">
            Connect your Aptos wallet to mint an NFT representing your verified intellectual property
          </p>
          <Button 
            variant="hero" 
            size="lg" 
            onClick={connectWallet}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              'Connect Aptos Wallet'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderDetailsStep = () => (
    <Card className="creator-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          NFT Details
        </CardTitle>
        <CardDescription>
          Customize your IP protection NFT details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="nft-name">NFT Name</Label>
          <Input
            id="nft-name"
            value={nftName}
            onChange={(e) => setNftName(e.target.value)}
            placeholder="Enter NFT name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your creative work..."
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <Label>Royalty Percentage: {royaltyPercentage[0]}%</Label>
          <Slider
            value={royaltyPercentage}
            onValueChange={setRoyaltyPercentage}
            max={25}
            min={0}
            step={0.5}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            Set the royalty percentage for future sales and fractionalization
          </p>
        </div>

        <div className="border rounded-lg p-4 bg-muted/30">
          <h4 className="font-semibold mb-2">Fingerprint Summary</h4>
          <div className="space-y-1 text-sm">
            <div>Type: <Badge variant="outline">{fingerprint.contentType}</Badge></div>
            <div>Confidence: <span className="font-mono">{(fingerprint.confidence * 100).toFixed(1)}%</span></div>
            <div>Hash: <span className="font-mono text-xs">{fingerprint.fingerprint}</span></div>
          </div>
        </div>

        <Button 
          variant="hero" 
          size="lg" 
          className="w-full"
          onClick={mintNFT}
          disabled={!nftName.trim()}
        >
          Mint IP Protection NFT
        </Button>
      </CardContent>
    </Card>
  );

  const renderMintingStep = () => (
    <Card className="creator-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Minting on Aptos Blockchain
        </CardTitle>
        <CardDescription>
          Processing your transaction on the Aptos network...
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <h3 className="text-lg font-semibold mb-2">Creating Your NFT</h3>
          <p className="text-muted-foreground">
            Your IP protection NFT is being minted on the Aptos blockchain. This may take a few moments.
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const renderSuccessStep = () => (
    <Card className="creator-card border-success/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-success">
          <CheckCircle2 className="w-5 h-5" />
          NFT Minted Successfully!
        </CardTitle>
        <CardDescription>
          Your intellectual property is now protected on the Aptos blockchain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-success/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-lg font-semibold mb-2">IP Protection Active</h3>
          <p className="text-muted-foreground">
            Your creative work is now verifiably yours with blockchain-backed proof
          </p>
        </div>

        {mintResult && (
          <div className="space-y-3 border rounded-lg p-4 bg-success/5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Transaction Hash:</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {mintResult.transactionHash}
              </code>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">NFT Address:</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">
                {mintResult.nftAddress}
              </code>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Explorer
          </Button>
          <Button variant="hero" className="flex-1" onClick={() => window.location.reload()}>
            Create Another
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderErrorStep = () => (
    <Card className="creator-card border-destructive/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-5 h-5" />
          Minting Failed
        </CardTitle>
        <CardDescription>
          There was an issue minting your NFT
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center py-4">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-destructive" />
          <h3 className="text-lg font-semibold mb-2">Transaction Failed</h3>
          <p className="text-muted-foreground">
            {mintResult?.error || "An unexpected error occurred during minting"}
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setCurrentStep('details')}>
            Try Again
          </Button>
          <Button variant="creator" className="flex-1" onClick={() => window.location.reload()}>
            Start Over
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  switch (currentStep) {
    case 'connect':
      return renderConnectStep();
    case 'details':
      return renderDetailsStep();
    case 'minting':
      return renderMintingStep();
    case 'success':
      return renderSuccessStep();
    case 'error':
      return renderErrorStep();
    default:
      return renderConnectStep();
  }
}