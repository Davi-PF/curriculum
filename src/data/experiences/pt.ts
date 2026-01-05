import { ExperienceItem } from '@/src/types/experience';

export const experiencesPt: ExperienceItem[] = [
  {
    id: 'mercado-dos-sonhos',
    company: 'Mercado dos Sonhos',
    period: '06/24 - 08/25',
    logo: '/logos/logoMercado.png',

    title: 'Sócio-Administrador',
    description:
      'Dentro do meu escopo de habilidades, aqui foi onde mais pude me desenvolver como profissional. Aprendi a gerir uma empresa, lidar com clientes, fornecedores, finanças e marketing. Também tive a oportunidade de liderar uma equipe e tomar decisões estratégicas para o crescimento do negócio. Foi uma experiência desafiadora, mas extremamente gratificante.',
    activities: [],
  },
  {
    id: 'dinamio',
    company: 'Dinamio Tecnologia',
    period: '02/23 - 05/24',
    logo: '/logos/logoDinamio.svg',

    title: 'Estágio - Analista de Suporte N3',
    description:
      'Aqui foi onde tive a oportunidade de aplicar meus conhecimentos técnicos em um ambiente real de trabalho. Aprendi a diagnosticar e resolver problemas de TI, voltado para infraestrutura dos clientes da empresa. Foi também onde tive contato com um grande player do mercado, a Microsoft, e pude aprimorar minhas habilidades em comunicação técnica em inglês.',
    activities: [
      'Gerenciamento remoto de servidores e ambientes de produção e homologação.',
      'Criação e documentação de scripts para automação de rotinas.',
      'Comunicação em inglês com o suporte da Microsoft.',
      'Desenvolvimento de documentação técnica para equipe interna.',
    ],
  },
];
