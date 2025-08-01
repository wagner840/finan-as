/**
 * @fileoverview Onboarding flow for new users
 * @module shared/components/Onboarding/OnboardingFlow
 */

import { useState, useCallback } from 'react';
import type { ReactElement } from 'react';
import { Button } from '../UI/Button';
import { TutorialModal } from '../Tutorial/TutorialModal';
import { tutorialSteps } from '../Tutorial/tutorialData';

/**
 * Props for the OnboardingFlow component
 */
export interface OnboardingFlowProps {
  /** Whether the onboarding is open */
  isOpen: boolean;
  
  /** Handler for completing onboarding */
  onComplete: () => void;
  
  /** Handler for skipping onboarding */
  onSkip: () => void;
  
  /** Handler for starting with categories */
  onStartWithCategories: () => void;
}

/**
 * Welcome step component
 */
interface WelcomeStepProps {
  onNext: () => void;
  onSkip: () => void;
}

const WelcomeStep = ({ onNext, onSkip }: WelcomeStepProps): ReactElement => (
  <div className="text-center space-y-8">
    <div className="w-32 h-32 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-8">
      <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
    </div>
    
    <div>
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Bem-vindo ao My Finance! 🎉
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Organize suas finanças de forma simples, segura e completamente privada. 
        Todos os seus dados ficam apenas no seu dispositivo.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
        <div className="text-3xl mb-3">🔒</div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          100% Privado
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Seus dados nunca saem do seu dispositivo
        </p>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <div className="text-3xl mb-3">📱</div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Funciona Offline
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Use mesmo sem conexão com a internet
        </p>
      </div>
      
      <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
        <div className="text-3xl mb-3">⚡</div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Sem Cadastro
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Comece a usar imediatamente
        </p>
      </div>
      
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
        <div className="text-3xl mb-3">📊</div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Relatórios Visuais
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Gráficos e análises detalhadas
        </p>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button
        variant="primary"
        size="lg"
        onClick={onNext}
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        }
      >
        Começar Configuração
      </Button>
      <Button
        variant="secondary"
        size="lg"
        onClick={onSkip}
      >
        Pular e Explorar
      </Button>
    </div>
  </div>
);

/**
 * Privacy explanation step
 */
interface PrivacyStepProps {
  onNext: () => void;
  onBack: () => void;
}

const PrivacyStep = ({ onNext, onBack }: PrivacyStepProps): ReactElement => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Sua Privacidade é Sagrada 🔒
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Entenda como protegemos suas informações financeiras com nossa abordagem única.
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-4">
            ✅ O que fazemos
          </h3>
          <ul className="space-y-3 text-green-700 dark:text-green-300">
            <li className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z" clipRule="evenodd" />
              </svg>
              <span>Armazenamos tudo localmente no seu navegador</span>
            </li>
            <li className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z" clipRule="evenodd" />
              </svg>
              <span>Você tem controle total dos seus dados</span>
            </li>
            <li className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z" clipRule="evenodd" />
              </svg>
              <span>Oferecemos múltiplos formatos de backup</span>
            </li>
            <li className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293z" clipRule="evenodd" />
              </svg>
              <span>Funciona completamente offline</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-4">
            ❌ O que NÃO fazemos
          </h3>
          <ul className="space-y-3 text-red-700 dark:text-red-300">
            <li className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Enviamos dados para nossos servidores</span>
            </li>
            <li className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Coletamos informações pessoais</span>
            </li>
            <li className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Fazemos tracking ou analytics</span>
            </li>
            <li className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Compartilhamos com terceiros</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg text-center">
      <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
        💡 Como verificar?
      </h3>
      <p className="text-blue-700 dark:text-blue-300">
        Pressione <kbd className="px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-xs">F12</kbd> → 
        <kbd className="px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-xs ml-1">Application</kbd> → 
        <kbd className="px-2 py-1 bg-blue-200 dark:bg-blue-800 rounded text-xs ml-1">Local Storage</kbd> 
        para ver seus dados armazenados localmente.
      </p>
    </div>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button variant="secondary" onClick={onBack}>
        Voltar
      </Button>
      <Button
        variant="primary"
        onClick={onNext}
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        }
      >
        Entendi, continuar
      </Button>
    </div>
  </div>
);

/**
 * Quick start step
 */
interface QuickStartProps {
  onFinish: () => void;
  onShowTutorial: () => void;
  onStartWithCategories: () => void;
  onBack: () => void;
}

const QuickStart = ({ onFinish, onShowTutorial, onStartWithCategories, onBack }: QuickStartProps): ReactElement => (
  <div className="space-y-8">
    <div className="text-center">
      <div className="text-6xl mb-4">🚀</div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Pronto para começar!
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        Escolha como você quer começar a usar o My Finance.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-2-4a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Tutorial Completo
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Veja um guia passo a passo de todas as funcionalidades
          </p>
          <Button variant="primary" onClick={onShowTutorial} className="w-full">
            Ver Tutorial
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-success-100 dark:bg-success-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-success-600 dark:text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Configuração Guiada
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Comece criando suas categorias básicas
          </p>
          <Button variant="success" onClick={onStartWithCategories} className="w-full">
            Configurar Agora
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-warning-100 dark:bg-warning-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-warning-600 dark:text-warning-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Explorar Sozinho
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Pule a configuração e explore livremente
          </p>
          <Button variant="secondary" onClick={onFinish} className="w-full">
            Explorar Agora
          </Button>
        </div>
      </div>
    </div>

    <div className="text-center">
      <Button variant="secondary" onClick={onBack}>
        Voltar
      </Button>
    </div>
  </div>
);

/**
 * Main onboarding flow component
 */
export const OnboardingFlow = ({
  isOpen,
  onComplete,
  onSkip,
  onStartWithCategories,
}: OnboardingFlowProps): ReactElement => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

  const handleNext = useCallback((): void => {
    setCurrentStep(prev => prev + 1);
  }, []);

  const handleBack = useCallback((): void => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  const handleShowTutorial = useCallback((): void => {
    setShowTutorial(true);
  }, []);

  const handleTutorialComplete = useCallback((): void => {
    setShowTutorial(false);
    onComplete();
  }, [onComplete]);

  if (!isOpen) return <></>;

  if (showTutorial) {
    return (
      <TutorialModal
        isOpen={true}
        onClose={handleTutorialComplete}
        steps={tutorialSteps}
        showDontShowAgain={true}
        onDontShowAgain={handleTutorialComplete}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {currentStep === 0 && (
            <WelcomeStep onNext={handleNext} onSkip={onSkip} />
          )}
          
          {currentStep === 1 && (
            <PrivacyStep onNext={handleNext} onBack={handleBack} />
          )}
          
          {currentStep === 2 && (
            <QuickStart
              onFinish={onComplete}
              onShowTutorial={handleShowTutorial}
              onStartWithCategories={onStartWithCategories}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
};