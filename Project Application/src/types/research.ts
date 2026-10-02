export interface ResearchPaper {
  title: string;
  subtitle: string;
  authors: string[];
  affiliation: string;
  venue: string;
  year: number;
  doi: string;
  area: string;
  abstract: string;
  keyContributions: string[];
  bibtex: string;
  downloadUrl?: string;
}

export interface WhyPaperPoint {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface ContributionItem {
  number: string;
  title: string;
  tagline: string;
  description: string;
  keyTech: string[];
  impactMetric: string;
}
