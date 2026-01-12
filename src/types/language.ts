export type Language = "pt" | "en";

export interface Translations {
  header: {
    title: string;
  };
  navbar: {
    home: string;
    about: string;
    skills: string;
    contact: string;
  };
  hero: {
    title: string;
    subtitle: string;
    quote: string;
  };
  experience: {
    title: string;
    description: string;
  };
  skill: {
    title: string;
    hardSkills: string;
    softSkills: string;
    description: string;
  };
  about: {
    title: string;
    description: string;
  };
  contact: {
    title: string;
    description: string;
    accessHere: string;
    ariaLabelCopyEmail: string;
    ariaLabelCopyPhone: string;
    Phone: string;
    Email: string;
    LinkedIn: string;
    GitHub: string;
    curriculumText: string;
  };
  formation: {
    title: string;
    description: string;
  }
  footer: {
    rights: string;
  };
}
