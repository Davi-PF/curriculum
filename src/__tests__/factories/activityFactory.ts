import type { Activity } from '../../types/ExperienceRelated/Activity';

export function makeActivity(
  overrides?: Partial<Activity>
): Activity {
  return {
    title: 'Título da atividade',
    description: 'Descrição da atividade',
    links: [],
    variant: 'experience',
    ...overrides,
  };
}