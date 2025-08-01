/**
 * @fileoverview Tutorial data and steps configuration
 * @module shared/components/Tutorial/tutorialData
 */

import type { TutorialStep } from './TutorialModal';

/**
 * Complete tutorial steps for the My Finance application
 */
export const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: '🎉 Bem-vindo ao My Finance!',
    content: `Parabéns por escolher o My Finance para organizar suas finanças! 

    Nossa aplicação foi desenvolvida pensando na sua privacidade e simplicidade. Todos os seus dados ficam armazenados apenas no seu dispositivo - nada é enviado para nossos servidores.

    Vamos te mostrar como aproveitar ao máximo todas as funcionalidades disponíveis.`,
    tips: [
      'Seus dados nunca saem do seu dispositivo',
      'Funciona offline após o primeiro carregamento',
      'Interface intuitiva e fácil de usar',
      'Relatórios detalhados e visualizações'
    ]
  },
  {
    id: 'privacy-first',
    title: '🔒 Privacidade em Primeiro Lugar',
    content: `O My Finance foi projetado com foco total na sua privacidade:

    • **100% Local**: Todos os dados ficam no seu navegador
    • **Zero Servidores**: Não enviamos nem armazenamos seus dados
    • **Você no Controle**: Exporte, importe ou apague quando quiser
    • **Código Aberto**: Transparência total sobre como funciona

    Isso significa que mesmo que nossos servidores saiam do ar, seus dados continuam seguros e acessíveis no seu dispositivo.`,
    tips: [
      'Use a função "Exportar Dados" para fazer backup',
      'Seus dados ficam no localStorage do navegador',
      'Limpar dados do navegador apagará suas informações',
      'Recomendamos fazer backup regularmente'
    ]
  },
  {
    id: 'dashboard-overview',
    title: '📊 Dashboard - Sua Visão Geral',
    content: `O Dashboard é o coração da aplicação, onde você vê um resumo completo das suas finanças:

    • **Cards de Resumo**: Receitas, despesas e saldo atual
    • **Transações Recentes**: Últimas movimentações
    • **Gráficos Rápidos**: Visualização dos seus gastos
    • **Ações Rápidas**: Botões para adicionar transações e categorias

    É aqui que você terá a primeira impressão da sua situação financeira atual.`,
    image: '/images/tutorial/step1-dashboard-overview.png',
    tips: [
      'Os valores são atualizados em tempo real',
      'Verde indica receitas, vermelho indica despesas',
      'O saldo é calculado automaticamente',
      'Clique nos cards para ver mais detalhes'
    ]
  },
  {
    id: 'categories-system',
    title: '🏷️ Sistema de Categorias',
    content: `As categorias são fundamentais para organizar suas finanças:

    • **Organização**: Agrupe transações similares
    • **Cores Personalizadas**: Identifique rapidamente cada categoria
    • **Relatórios**: Veja gastos por categoria
    • **Flexibilidade**: Crie, edite ou remova quando precisar

    Exemplos: Alimentação, Transporte, Lazer, Educação, Saúde, etc.`,
    image: '/images/tutorial/step3-categories-management.png',
    tips: [
      'Comece com categorias básicas e evolua',
      'Use cores que façam sentido para você',
      'Categorias ajudam na análise de gastos',
      'Pode criar quantas categorias precisar'
    ]
  },
  {
    id: 'transactions-management',
    title: '💰 Gerenciamento de Transações',
    content: `As transações são o registro de todas suas movimentações financeiras:

    **Tipos de Transação:**
    • **Receitas**: Salário, vendas, investimentos, etc.
    • **Despesas**: Compras, contas, gastos em geral

    **Funcionalidades:**
    • Adicionar, editar e excluir transações
    • Buscar e filtrar por período, categoria ou tipo
    • Duplicar transações recorrentes
    • Visualizar histórico completo`,
    image: '/images/tutorial/step2-new-transaction-form.png',
    tips: [
      'Seja específico nas descrições',
      'Registre transações regularmente',
      'Use a função duplicar para gastos recorrentes',
      'Organize por categorias para melhor controle'
    ]
  },
  {
    id: 'reports-analytics',
    title: '📈 Relatórios e Análises',
    content: `A seção de relatórios oferece insights valiosos sobre suas finanças:

    **Visualizações Disponíveis:**
    • **Gráficos de Pizza**: Distribuição de gastos por categoria
    • **Gráficos de Barras**: Evolução mensal de receitas vs despesas
    • **Estatísticas**: Totais, médias e comparações
    • **Períodos Flexíveis**: Analise diferentes intervalos de tempo

    Use esses dados para tomar decisões financeiras mais informadas.`,
    image: '/images/tutorial/step5-reports-overview.png',
    tips: [
      'Analise seus gastos mensalmente',
      'Identifique categorias com maior gasto',
      'Compare receitas vs despesas',
      'Use os relatórios para definir metas'
    ]
  },
  {
    id: 'export-import',
    title: '📤 Exportar e Fazer Backup',
    content: `Mantenha seus dados seguros com nossas opções de backup:

    **Formatos de Exportação:**
    • **Excel (.xlsx)**: Para análises avançadas
    • **CSV**: Compatível com planilhas
    • **JSON**: Backup completo dos dados
    • **Markdown**: Relatórios legíveis

    **Recursos:**
    • Filtros por período e categoria
    • Inclusão de metadados e resumos
    • Preview antes da exportação`,
    image: '/images/tutorial/step7-export-data-modal.png',
    tips: [
      'Faça backup regularmente',
      'Excel é ideal para análises complexas',
      'JSON preserva toda a estrutura de dados',
      'Use filtros para exportações específicas'
    ]
  },
  {
    id: 'dark-mode-settings',
    title: '🌙 Modo Escuro e Personalização',
    content: `Personalize sua experiência com o My Finance:

    • **Modo Escuro**: Alterne entre temas claro e escuro
    • **Responsivo**: Funciona perfeitamente em qualquer dispositivo
    • **Persistência**: Suas preferências são salvas automaticamente
    • **Acessibilidade**: Interface otimizada para todos os usuários

    O modo escuro é especialmente útil para uso noturno ou ambientes com pouca luz.`,
    image: '/images/tutorial/step6-dark-mode.png',
    tips: [
      'Toggle de modo escuro no header',
      'Configuração é salva automaticamente',
      'Funciona em mobile, tablet e desktop',
      'Interface otimizada para ambos os modos'
    ]
  },
  {
    id: 'getting-started',
    title: '🚀 Primeiros Passos',
    content: `Agora que você conhece a aplicação, vamos começar:

    **1.** Crie suas primeiras categorias (ex: Alimentação, Transporte)
    **2.** Adicione algumas transações recentes
    **3.** Explore o dashboard para ver o resumo
    **4.** Acesse os relatórios para análises
    **5.** Configure suas preferências
    **6.** Faça seu primeiro backup de dados

    Lembre-se: comece simples e evolua gradualmente!`,
    tips: [
      'Não precisa registrar tudo de uma vez',
      'Comece com o mês atual',
      'Seja consistente nos registros',
      'Use as categorias para organizar melhor'
    ],
    action: {
      label: 'Criar Primeira Categoria',
      onClick: () => {
        // Esta função será implementada no componente pai
        console.log('Navigate to categories');
      }
    }
  }
];

/**
 * Quick tips for new users
 */
export const quickTips = [
  {
    id: 'data-privacy',
    title: 'Seus dados são 100% privados',
    description: 'Tudo fica armazenado apenas no seu navegador, nunca enviamos dados para servidores.',
    icon: '🔒'
  },
  {
    id: 'offline-ready',
    title: 'Funciona offline',
    description: 'Após o primeiro carregamento, use a aplicação mesmo sem internet.',
    icon: '📱'
  },
  {
    id: 'export-anytime',
    title: 'Exporte quando quiser',
    description: 'Seus dados não ficam presos aqui. Exporte em vários formatos.',
    icon: '📤'
  },
  {
    id: 'no-signup',
    title: 'Sem cadastro necessário',
    description: 'Comece a usar imediatamente, sem precisar criar conta.',
    icon: '⚡'
  }
];

/**
 * Feature highlights for the about page
 */
export const featureHighlights = [
  {
    title: 'Controle Total das Finanças',
    description: 'Monitore receitas, despesas e tenha uma visão clara do seu orçamento.',
    icon: '📊',
    benefits: [
      'Dashboard intuitivo com resumo financeiro',
      'Gráficos e relatórios detalhados',
      'Categorização inteligente de gastos',
      'Análise de tendências mensais'
    ]
  },
  {
    title: 'Privacidade Absoluta',
    description: 'Seus dados financeiros ficam 100% no seu dispositivo, sem riscos.',
    icon: '🔒',
    benefits: [
      'Zero armazenamento em servidores',
      'Dados criptografados localmente',
      'Você tem controle total',
      'Transparência completa do código'
    ]
  },
  {
    title: 'Interface Moderna',
    description: 'Design limpo, intuitivo e otimizado para qualquer dispositivo.',
    icon: '✨',
    benefits: [
      'Modo escuro e claro',
      'Responsivo para mobile e desktop',
      'Navegação intuitiva',
      'Acessibilidade otimizada'
    ]
  },
  {
    title: 'Flexibilidade Total',
    description: 'Personalize categorias, exporte dados e use como preferir.',
    icon: '🎯',
    benefits: [
      'Categorias personalizáveis',
      'Múltiplos formatos de export',
      'Filtros avançados',
      'Backup e restauração simples'
    ]
  }
];