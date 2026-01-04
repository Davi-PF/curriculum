export default function Experience() {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Experiências</h2>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900">
            Sócio-Administrador
          </h3>
          <p className="text-gray-400 mb-2">
            Mercado dos Sonhos | 06/24 - 08/25
          </p>
          <p className="text-gray-700">
            Dentro do meu escopo de habilidades, aqui foi onde mais pude me
            desenvolver como profissional. Aprendi a gerir uma empresa, lidar
            com clientes, fornecedores, finanças e marketing. Também tive a
            oportunidade de liderar uma equipe e tomar decisões estratégicas
            para o crescimento do negócio. Foi uma experiência desafiadora, mas
            extremamente gratificante.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900">Estágio - Analista de Suporte N3</h3>
          <p className="text-gray-400 mb-2">
            Dinamio Tecnologia | 02/23 - 05/24
          </p>
            <p className="text-gray-700">
              Aqui foi onde tive a oportunidade de aplicar meus conhecimentos técnicos em um ambiente real de trabalho.
              Aprendi a diagnosticar e resolver problemas de TI, voltado para infraestrutura dos clientes da empresa.
              Foi também onde tive contato com um grande player do mercado, a Microsoft, e pude aprimorar minhas habilidades em comunicação técnica em inglês.
            </p>
            <p className="text-gray-800 mt-3">
            Algumas outras atividades que realizei:
            </p>
            <ul className="text-gray-500 mt-2 ml-8 list-disc">
            <li>Gerenciamento remoto de servidores e ambientes de produção e homologação.</li>
            <li>Criação e documentação de scripts para automação de rotinas.</li>
            <li>Comunicação em inglês com o suporte da Microsoft para repasse e execução de procedimentos técnicos.</li>
            <li>Desenvolvimento de documentação técnica e procedimentos técnicos para equipe interna.</li>
            </ul>
        </div>
        {/* Add more experience items as needed */}
      </div>
    </section>
  );
}
