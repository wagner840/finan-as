/**
 * @fileoverview Modal component for expanded image viewing
 * @module shared/components/UI/ImageModal
 */

import { useEffect, useCallback } from 'react';
import type { ReactElement } from 'react';

/**
 * Props for the ImageModal component
 */
export interface ImageModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  
  /** Handler for closing the modal */
  onClose: () => void;
  
  /** Image source URL */
  src: string;
  
  /** Image alt text */
  alt: string;
  
  /** Optional title for the modal */
  title?: string;
}

/**
 * Modal component for viewing images in full size
 * 
 * Features:
 * - Click outside to close
 * - Escape key to close
 * - Responsive sizing
 * - Smooth animations
 * - Dark mode support
 * 
 * @component
 * @example
 * ```tsx
 * <ImageModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   src="/images/screenshot.png"
 *   alt="Tutorial screenshot"
 *   title="Dashboard Overview"
 * />
 * ```
 */
export const ImageModal = ({
  isOpen,
  onClose,
  src,
  alt,
  title
}: ImageModalProps): ReactElement | null => {
  
  // Handle escape key press
  const handleEscapeKey = useCallback((event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // Add/remove event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscapeKey]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((event: React.MouseEvent<HTMLDivElement>): void => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="image-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "image-modal-title" : undefined}
      aria-describedby="image-modal-description"
    >
      <div className="image-modal-content">
        {/* Header with title and close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            {title && (
              <h3 
                id="image-modal-title"
                className="text-lg font-semibold text-gray-900 dark:text-gray-100"
              >
                {title}
              </h3>
            )}
            <p 
              id="image-modal-description"
              className="text-sm text-gray-600 dark:text-gray-400 mt-1"
            >
              Clique na imagem ou fora dela para fechar
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Fechar visualização da imagem"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Image container */}
        <div 
          className="p-4 flex items-center justify-center cursor-pointer"
          onClick={onClose}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[calc(95vh-120px)] object-contain rounded-lg shadow-lg transition-transform hover:scale-[1.02]"
            loading="lazy"
          />
        </div>

        {/* Footer with instructions */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">ESC</kbd>
              <span>para fechar</span>
            </div>
            <span>•</span>
            <span>Clique fora da imagem para fechar</span>
          </div>
        </div>
      </div>
    </div>
  );
};