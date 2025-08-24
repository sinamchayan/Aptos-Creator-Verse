import React, { useState, useCallback } from 'react';
import { Upload, Image, Music, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { fingerprintService, FingerprintResult } from '@/services/fingerprintService';

interface ContentUploadProps {
  onFingerprintGenerated: (result: FingerprintResult, file: File) => void;
}

export function ContentUpload({ onFingerprintGenerated }: ContentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, []);

  const handleFile = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 50MB",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 200);

      let fingerprintResult: FingerprintResult;

      if (file.type.startsWith('image/')) {
        fingerprintResult = await fingerprintService.generateImageFingerprint(file);
      } else if (file.type.startsWith('audio/')) {
        fingerprintResult = await fingerprintService.generateAudioFingerprint(file);
      } else if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        const text = await file.text();
        fingerprintResult = await fingerprintService.generateTextFingerprint(text);
      } else {
        throw new Error('Unsupported file type');
      }

      clearInterval(progressInterval);
      setProgress(100);

      toast({
        title: "Fingerprint generated!",
        description: `Successfully created AI fingerprint for ${file.name}`,
      });

      onFingerprintGenerated(fingerprintResult, file);

    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error processing file",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const getIcon = (type: string) => {
    if (type.includes('image')) return <Image className="w-8 h-8" />;
    if (type.includes('audio')) return <Music className="w-8 h-8" />;
    return <FileText className="w-8 h-8" />;
  };

  return (
    <Card className="creator-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Content Fingerprinting
        </CardTitle>
        <CardDescription>
          Upload your creative content to generate a unique AI-powered fingerprint for blockchain verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!uploading ? (
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-smooth cursor-pointer
              ${dragActive 
                ? 'border-primary bg-primary/5 scale-[1.02]' 
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Upload Your Content</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop your files here, or click to browse
            </p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Image className="w-4 h-4" />
                Images
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Music className="w-4 h-4" />
                Audio
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                Text
              </div>
            </div>
            <Button variant="hero" size="lg">
              Choose Files
            </Button>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileInput}
              accept="image/*,audio/*,text/*,.txt,.md"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                <span className="text-lg font-semibold">Generating AI Fingerprint...</span>
              </div>
              <Progress value={progress} className="w-full mb-2" />
              <p className="text-sm text-muted-foreground">
                Analyzing content with advanced AI models
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}