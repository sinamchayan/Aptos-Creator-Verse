import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { CreatorDashboard } from '@/components/CreatorDashboard';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CreatorDashboard />
      </main>
    </div>
  );
};

export default Index;
