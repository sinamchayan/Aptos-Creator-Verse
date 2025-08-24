import React from 'react';
import { Shield, Hash, Clock, Zap, CheckCircle, Copy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/enhanced-button';
import { useToast } from '@/hooks/use-toast';
import { FingerprintResult } from '@/services/fingerprintService';

interface FingerprintDisplayProps {
  fingerprint: FingerprintResult;
  fileName: string;
  onMintNFT: () => void;
  minting?: boolean;
}

export function FingerprintDisplay({ 
  fingerprint, 
  fileName, 
  onMintNFT, 
  minting = false 
}: FingerprintDisplayProps) {
  const { toast } = useToast();

  const copyFingerprint = () => {
    navigator.clipboard.writeText(fingerprint.fingerprint);
    toast({
      title: "Copied!",
      description: "Fingerprint copied to clipboard",
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-success';
    if (confidence >= 0.7) return 'bg-creator-warning';
    return 'bg-destructive';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.9) return 'Excellent';
    if (confidence >= 0.7) return 'Good';
    return 'Fair';
  };

  return (
    <Card className="creator-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-success" />
            <CardTitle>AI Fingerprint Generated</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        </div>
        <CardDescription>
          Unique AI-powered identification for: {fileName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fingerprint Hash */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Hash className="w-4 h-4" />
            Fingerprint Hash
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg font-mono text-sm">
            <code className="flex-1 break-all">{fingerprint.fingerprint}</code>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyFingerprint}
              className="shrink-0"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Zap className="w-4 h-4" />
            Confidence Score
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-muted/50 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full transition-smooth ${getConfidenceColor(fingerprint.confidence)}`}
                style={{ width: `${fingerprint.confidence * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{(fingerprint.confidence * 100).toFixed(1)}%</span>
              <Badge 
                variant="outline" 
                className={`${getConfidenceColor(fingerprint.confidence)} border-0 text-white`}
              >
                {getConfidenceText(fingerprint.confidence)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Content Type</div>
            <Badge variant="outline" className="capitalize">
              {fingerprint.contentType}
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Generated</div>
            <div className="flex items-center gap-1 text-sm">
              <Clock className="w-3 h-3" />
              {new Date(fingerprint.timestamp).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Feature Vector Preview */}
        <div className="space-y-2">
          <div className="text-sm font-medium">AI Feature Vector (Preview)</div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-5 gap-2 text-xs font-mono">
              {fingerprint.features.slice(0, 10).map((feature, index) => (
                <div 
                  key={index}
                  className="p-1 bg-background rounded text-center"
                >
                  {feature.toFixed(3)}
                </div>
              ))}
            </div>
            {fingerprint.features.length > 10 && (
              <div className="text-center text-xs text-muted-foreground mt-2">
                +{fingerprint.features.length - 10} more features
              </div>
            )}
          </div>
        </div>

        {/* Mint NFT Button */}
        <div className="pt-4 border-t">
          <Button 
            variant="hero" 
            size="lg" 
            className="w-full" 
            onClick={onMintNFT}
            disabled={minting}
          >
            {minting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Minting NFT on Aptos...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Mint IP Protection NFT
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Register this fingerprint on Aptos blockchain for permanent IP protection
          </p>
        </div>
      </CardContent>
    </Card>
  );
}