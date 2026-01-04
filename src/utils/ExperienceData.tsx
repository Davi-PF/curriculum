export interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  description: string;
  activities: string[];
  logo: string;
}

export const experiences: ExperienceItem[] = [
  {
    title: 'Sócio-Administrador',
    company: 'Mercado dos Sonhos',
    period: '06/24 - 08/25',
    description: 'Dentro do meu escopo de habilidades, aqui foi onde mais pude me desenvolver como profissional. Aprendi a gerir uma empresa, lidar com clientes, fornecedores, finanças e marketing. Também tive a oportunidade de liderar uma equipe e tomar decisões estratégicas para o crescimento do negócio. Foi uma experiência desafiadora, mas extremamente gratificante.',
    activities: [],
    logo: "/logos/logoMercado.png",
  },
  {
    title: 'Estágio - Analista de Suporte N3',
    company: 'Dinamio Tecnologia',
    period: '02/23 - 05/24',
    description: 'Aqui foi onde tive a oportunidade de aplicar meus conhecimentos técnicos em um ambiente real de trabalho. Aprendi a diagnosticar e resolver problemas de TI, voltado para infraestrutura dos clientes da empresa. Foi também onde tive contato com um grande player do mercado, a Microsoft, e pude aprimorar minhas habilidades em comunicação técnica em inglês.',
    activities: [
      'Gerenciamento remoto de servidores e ambientes de produção e homologação.',
      'Criação e documentação de scripts para automação de rotinas.',
      'Comunicação em inglês com o suporte da Microsoft para repasse e execução de procedimentos técnicos.',
      'Desenvolvimento de documentação técnica e procedimentos técnicos para equipe interna.'
    ],
    logo: "/logos/logoDinamio.svg",
  }
  // Adicione mais experiências aqui
];