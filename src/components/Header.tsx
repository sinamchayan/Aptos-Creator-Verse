import React from 'react';
import { Sparkles, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';

export function Header() {
  return (
    <header className="glass-card sticky top-0 z-50 border-b border-border/30">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center">
                <Shield className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
                Creator-Verse
              </h1>
              <p className="text-xs text-muted-foreground">AI-Powered IP Protection</p>
            </div>
          </div>

          

          <div className="flex items-center gap-3">
            <Button variant="glass" size="sm">
              <Zap className="w-4 h-4 mr-2" />
              Powered by Aptos
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}