import React from 'react';
import { Shield, Zap, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AptosService } from '@/services/aptosService';

export function HeroSection() {
  const stats = [
    { icon: Shield, label: 'IP Assets Protected', value: '12.5K+' },
    { icon: Zap, label: 'AI Fingerprints Generated', value: '48.2K+' },
    { icon: Users, label: 'Active Creators', value: '3.8K+' },
    { icon: TrendingUp, label: 'Total Royalties Distributed', value: '$2.1M+' }
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered IP Protection on Aptos</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Protect Your
            <span className="gradient-primary bg-clip-text text-transparent"> Creative IP </span>
            with AI & Blockchain
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Generate unique AI fingerprints for your creative work and mint them as NFTs on Aptos. 
            Prove ownership, track royalties, and build fractionalized communities around your intellectual property.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="xl" className="text-lg">
              <Shield className="w-5 h-5 mr-2" />
              Connect Wallet
            </Button>
            
            
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="creator-card text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">AI Fingerprinting</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced AI models generate unique, tamper-resistant fingerprints for any digital content
                </p>
              </CardContent>
            </Card>

            <Card className="creator-card text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 gradient-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Aptos Blockchain</h3>
                <p className="text-sm text-muted-foreground">
                  Lightning-fast, low-cost transactions with parallel execution for real-time royalty distribution
                </p>
              </CardContent>
            </Card>

            <Card className="creator-card text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 gradient-glow rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Fractionalized Ownership</h3>
                <p className="text-sm text-muted-foreground">
                  Enable fans to invest in your IP and create engaged communities around your creative work
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="creator-card text-center">
                <CardContent className="p-6">
                  <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}