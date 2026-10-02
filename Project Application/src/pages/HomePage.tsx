import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { WhatIsEdge } from '../components/home/WhatIsEdge';
import { EdgeVsCloud } from '../components/home/EdgeVsCloud';
import { CarbonAware } from '../components/home/CarbonAware';
import { ProblemSection } from '../components/home/ProblemSection';
import { WorkflowProcess } from '../components/home/WorkflowProcess';
import { KeyMetrics } from '../components/home/KeyMetrics';
import { FinalCta } from '../components/home/FinalCta';

interface HomePageProps {
  onNavigateToTry: () => void;
  onNavigateToResearch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToTry,
  onNavigateToResearch,
}) => {
  return (
    <div className="space-y-0">
      <HeroSection
        onExploreSimulator={onNavigateToTry}
        onExploreResearch={onNavigateToResearch}
      />
      <WhatIsEdge />
      <EdgeVsCloud />
      <CarbonAware />
      <ProblemSection />
      <WorkflowProcess />
      <KeyMetrics />
      <FinalCta onRunSimulation={onNavigateToTry} />
    </div>
  );
};
