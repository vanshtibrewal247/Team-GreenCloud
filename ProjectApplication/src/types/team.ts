export interface TeamMember {
  id: string;
  order: string;
  name: string;
  rollNo?: string;
  role: string;
  badge: string;
  avatarUrl: string;
  institution: string;
  bio: string;
  responsibilities: string[];
  focusAreas: string[];
  social: {
    github: string;
    linkedin: string;
    email: string;
    scholar?: string;
  };
}
