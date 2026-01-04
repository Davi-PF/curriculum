export interface Skill {
  name: string;
  description: string;
  level: number; // 0-100
}

export const skills: Skill[] = [
  {
    name: 'Gestão de Pessoas',
    description: 'Habilidade em liderar equipes, motivar colaboradores e gerenciar conflitos.',
    level: 85
  },
  {
    name: 'Skill 2',
    description: 'Descrição da segunda habilidade.',
    level: 70
  },
  {
    name: 'Skill 3',
    description: 'Descrição da terceira habilidade.',
    level: 60
  },
  // Adicione mais habilidades aqui
];
