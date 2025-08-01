/**
 * @fileoverview About page with app information and usage guide
 * @module shared/components/Pages/AboutPage
 */

import { useState } from 'react';
import type { ReactElement } from 'react';
import { Button } from '../UI/Button';
import { TutorialModal } from '../Tutorial/TutorialModal';
import { tutorialSteps, featureHighlights, quickTips } from '../Tutorial/tutorialData';

/**
 * Props for the AboutPage component
 */
export interface AboutPageProps {
  /** Handler for navigating to other sections */
  onNavigate?: (section: string) => void;
}

/**
 * About page component with comprehensive app information
 * 
 * Provides detailed information about the application, its features,
 * privacy policy, and usage instructions. Includes interactive tutorial.
 * 
 * @component
 * @example
 * ```tsx
 * <AboutPage onNavigate={handleNavigate} />
 * ```
 */
export const AboutPage = ({ onNavigate }: AboutPageProps): ReactElement => {
  const [showTutorial, setShowTutorial] = useState(false);

  const handleStartTutorial = (): void => {
    setShowTutorial(true);
  };

  const handleNavigateToCategories = (): void => {
    if (onNavigate) {
      onNavigate('categories');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            My Finance
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            O controle financeiro pessoal que respeita sua privacidade. 
            Gerencie suas finanças de forma simples, segura e completamente offline.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartTutorial}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-2-4a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            >
              Ver Tutorial Completo
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleNavigateToCategories}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              }
            >
              Começar Agora
            </Button>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8">
            Por que escolher o My Finance?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickTips.map((tip) => (
              <div key={tip.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                <div className="text-4xl mb-4">{tip.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {tip.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8">
            Principais Funcionalidades
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featureHighlights.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl flex-shrink-0">{feature.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                          <svg className="w-4 h-4 text-success-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z" clipRule="evenodd" />
                          </svg>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Use */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8">
            Como Usar o My Finance
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700">
              {/* Step 1 */}
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Configure Categorias
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Crie categorias para organizar suas transações: Alimentação, Transporte, Lazer, etc.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-success-100 dark:bg-success-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-success-600 dark:text-success-400">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Registre Transações
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Adicione suas receitas e despesas com descrições claras e categorias apropriadas.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-warning-100 dark:bg-warning-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-warning-600 dark:text-warning-400">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Analise Relatórios
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Use gráficos e relatórios para entender seus padrões de gastos e tomar decisões melhores.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Promise */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Nossa Promessa de Privacidade
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-6">
              Seus dados financeiros são extremamente sensíveis. Por isso, garantimos que 
              <strong className="text-green-600 dark:text-green-400"> 100% das suas informações ficam apenas no seu dispositivo</strong>. 
              Não temos servidores para armazenar dados, não fazemos tracking e não vendemos informações.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                onClick={() => onNavigate?.('privacy')}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              >
                Ler Política de Privacidade
              </Button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8">
            Perguntas Frequentes
          </h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            {[
              {
                question: 'Meus dados estão realmente seguros?',
                answer: 'Sim! Todos os dados ficam armazenados apenas no localStorage do seu navegador. Nunca enviamos nada para nossos servidores. Você pode verificar isso nas ferramentas de desenvolvedor do seu navegador.'
              },
              {
                question: 'E se eu limpar os dados do navegador?',
                answer: 'Se você limpar os dados do navegador, suas informações serão perdidas. Por isso recomendamos fazer backup regular usando a função "Exportar Dados" disponível no rodapé da aplicação.'
              },
              {
                question: 'Posso usar em vários dispositivos?',
                answer: 'Como os dados ficam locais, cada dispositivo terá seus próprios dados. Você pode exportar de um dispositivo e importar em outro para sincronizar manualmente.'
              },
              {
                question: 'A aplicação funciona offline?',
                answer: 'Sim! Após o primeiro carregamento, a aplicação funciona completamente offline. Você pode registrar transações mesmo sem internet.'
              },
              {
                question: 'Como faço backup dos meus dados?',
                answer: 'Use a função "Exportar Dados" no rodapé da aplicação. Recomendamos exportar em JSON para preservar toda a estrutura de dados, mas também oferecemos Excel e CSV.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Pronto para começar?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Comece agora mesmo a organizar suas finanças de forma simples e segura. 
            Sem cadastro, sem complicação, sem riscos para sua privacidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartTutorial}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-2-4a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
            >
              Assistir Tutorial
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => onNavigate?.('dashboard')}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              }
            >
              Ir para Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Tutorial Modal */}
      <TutorialModal
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        steps={tutorialSteps}
        showDontShowAgain={true}
        onDontShowAgain={() => {
          localStorage.setItem('finance-app-tutorial-seen', 'true');
          setShowTutorial(false);
        }}
      />
    </div>
  );
};