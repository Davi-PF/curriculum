import { ActivityLink } from './ActivityLink';

export interface Activity {
  title: string;
  description: string;
  links?: ActivityLink[];
  variant?: ActivityLink['variant'];
}
