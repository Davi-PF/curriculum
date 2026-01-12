import { Activity } from "./Activity";

// src/types/experience.ts
export interface ExperienceItem {
  id: string;
  company: string;
  period: string;
  logo: string;

  title: string;
  description: string;
  extraActivities?: string;
  activities: Activity[];
}
