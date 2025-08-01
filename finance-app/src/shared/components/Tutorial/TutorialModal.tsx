/**
 * @fileoverview Interactive tutorial modal component
 * @module shared/components/Tutorial/TutorialModal
 */

import { useState, useCallback } from 'react';
import type { ReactElement } from 'react';
import { Button } from '../UI/Button';
import { ImageModal } from '../UI/ImageModal';

/**
 * Tutorial step interface
 */
export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  image?: string;
  videoUrl?: string;
  tips?: string[];
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Props for the TutorialModal component
 */
export interface TutorialModalProps {
  /** Whether the tutorial is open */
  isOpen: boolean;
  
  /** Handler for closing the tutorial */
  onClose: () => void;
  
  /** Tutorial steps */
  steps: TutorialStep[];
  
  /** Starting step index */
  initialStep?: number;
  
  /** Whether to show the "Don't show again" option */
  showDontShowAgain?: boolean;
  
  /** Handler for "Don't show again" */
  onDontShowAgain?: () => void;
}

/**
 * Interactive tutorial modal with step-by-step guidance
 * 
 * Provides a comprehensive tutorial experience with navigation,
 * tips, and interactive elements to help users understand the application.
 * 
 * @component
 * @example
 * ```tsx
 * <TutorialModal
 *   isOpen={showTutorial}
 *   onClose={() => setShowTutorial(false)}
 *   steps={tutorialSteps}
 *   showDontShowAgain={true}
 *   onDontShowAgain={handleDontShowAgain}
 * />
 * ```
 */
export const TutorialModal = ({
  isOpen,
  onClose,
  steps,
  initialStep = 0,
  showDontShowAgain = true,
  onDontShowAgain,
}: TutorialModalProps): ReactElement => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  // Handle next step
  const handleNext = useCallback((): void => {
    if (!isLastStep) {
      setCurrentStep(prev => prev + 1);
    }
  }, [isLastStep]);

  // Handle previous step
  const handlePrevious = useCallback((): void => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  }, [isFirstStep]);

  // Handle finish tutorial
  const handleFinish = useCallback((): void => {
    if (dontShowAgain && onDontShowAgain) {
      onDontShowAgain();
    }
    onClose();
  }, [dontShowAgain, onDontShowAgain, onClose]);

  // Handle step action
  const handleStepAction = useCallback((): void => {
    if (currentStepData.action) {
      currentStepData.action.onClick();
    }
  }, [currentStepData]);

  // Handle image expansion
  const handleImageClick = useCallback((imageSrc: string): void => {
    setExpandedImage(imageSrc);
  }, []);

  const handleCloseExpandedImage = useCallback((): void => {
    setExpandedImage(null);
  }, []);

  if (!isOpen) return <></>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Tutorial My Finance
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Passo {currentStep + 1} de {steps.length}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Fechar tutorial"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Text Content */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {currentStepData.title}
                </h3>
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {currentStepData.content}
                  </p>
                </div>
              </div>

              {/* Tips */}
              {currentStepData.tips && currentStepData.tips.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                        💡 Dicas importantes
                      </h4>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        {currentStepData.tips.map((tip, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Step Action */}
              {currentStepData.action && (
                <div className="pt-4">
                  <Button
                    variant="primary"
                    onClick={handleStepAction}
                    icon={
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    }
                  >
                    {currentStepData.action.label}
                  </Button>
                </div>
              )}
            </div>

            {/* Visual Content */}
            <div className="flex items-center justify-center">
              {currentStepData.image && (
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 w-full">
                  <div 
                    className="relative group cursor-pointer" 
                    onClick={() => handleImageClick(currentStepData.image!)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleImageClick(currentStepData.image!);
                      }
                    }}
                    aria-label="Clique para ampliar a imagem"
                  >
                    <img
                      src={currentStepData.image}
                      alt={currentStepData.title}
                      className="w-full h-auto rounded-lg shadow-lg tutorial-image-hover"
                    />
                    {/* Overlay with expand hint */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg expand-icon">
                        <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                    Clique na imagem para ampliá-la
                  </p>
                </div>
              )}
              
              {currentStepData.videoUrl && (
                <div className="w-full">
                  <video
                    controls
                    className="w-full rounded-lg shadow-lg"
                    poster={currentStepData.image}
                  >
                    <source src={currentStepData.videoUrl} type="video/mp4" />
                    Seu navegador não suporta vídeos.
                  </video>
                </div>
              )}

              {!currentStepData.image && !currentStepData.videoUrl && (
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-12 text-center">
                  <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Passo {currentStep + 1}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {/* Don't show again checkbox */}
            {showDontShowAgain && (
              <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                />
                <span>Não mostrar novamente</span>
              </label>
            )}
            
            {!showDontShowAgain && <div />}

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-3">
              <Button
                variant="secondary"
                onClick={handlePrevious}
                disabled={isFirstStep}
              >
                Anterior
              </Button>
              
              {isLastStep ? (
                <Button
                  variant="primary"
                  onClick={handleFinish}
                >
                  Finalizar Tutorial
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleNext}
                >
                  Próximo
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Image Modal */}
      <ImageModal
        isOpen={expandedImage !== null}
        onClose={handleCloseExpandedImage}
        src={expandedImage || ''}
        alt={currentStepData.title}
        title={`${currentStepData.title} - Passo ${currentStep + 1}`}
      />
    </div>
  );
};