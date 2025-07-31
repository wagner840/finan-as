/**
 * @fileoverview Responsive advertisement banner component for non-intrusive monetization
 * @module shared/components/AdBanner
 */

import { useState, useEffect } from 'react';
import type { ReactElement } from 'react';

/**
 * Advertisement banner placement options
 */
export type BannerPlacement = 'header' | 'footer' | 'sidebar' | 'inline';

/**
 * Advertisement banner size presets
 */
export type BannerSize = 'small' | 'medium' | 'large' | 'responsive';

/**
 * Props for the AdBanner component
 * 
 * @interface AdBannerProps
 */
export interface AdBannerProps {
  /** Where the banner will be placed @default 'footer' */
  placement?: BannerPlacement;
  
  /** Size preset for the banner @default 'responsive' */
  size?: BannerSize;
  
  /** Custom CSS classes */
  className?: string;
  
  /** Whether to show the banner @default true */
  show?: boolean;
  
  /** Banner content or ad slot ID */
  adSlot?: string;
  
  /** Fallback content when ad fails to load */
  fallbackContent?: ReactElement;
  
  /** Callback when banner loads successfully */
  onLoad?: () => void;
  
  /** Callback when banner fails to load */
  onError?: () => void;
}

/**
 * Get CSS classes for banner placement
 */
const getPlacementClasses = (placement: BannerPlacement): string => {
  const placements = {
    header: 'fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200',
    footer: 'mt-auto bg-gray-50 border-t border-gray-200',
    sidebar: 'sticky top-4',
    inline: 'my-4',
  };
  
  return placements[placement];
};

/**
 * Get CSS classes for banner size
 */
const getSizeClasses = (size: BannerSize, placement: BannerPlacement): string => {
  // Responsive behavior based on placement
  if (placement === 'header' || placement === 'footer') {
    const sizes = {
      small: 'h-16 md:h-20',
      medium: 'h-20 md:h-24',
      large: 'h-24 md:h-32',
      responsive: 'h-16 md:h-20 lg:h-24',
    };
    return sizes[size];
  }
  
  // Sidebar and inline banners
  const sizes = {
    small: 'w-48 h-16 md:w-60 md:h-20',
    medium: 'w-60 h-20 md:w-72 md:h-24',
    large: 'w-72 h-24 md:w-80 md:h-32',
    responsive: 'w-full max-w-sm h-20 md:h-24',
  };
  
  return sizes[size];
};

/**
 * Advertisement banner component for non-intrusive monetization
 * 
 * Provides a responsive container for advertisement content that adapts
 * to different screen sizes and placements. Follows the PRP requirements
 * for non-intrusive advertising that doesn't interfere with user experience.
 * 
 * @component
 * @example
 * ```tsx
 * // Footer banner (recommended)
 * <AdBanner
 *   placement="footer"
 *   size="responsive"
 *   adSlot="ca-pub-123456789"
 *   onLoad={() => console.log('Ad loaded')}
 * />
 * 
 * // Header banner
 * <AdBanner
 *   placement="header"
 *   size="small"
 *   show={showHeaderAd}
 * />
 * 
 * // Inline banner with fallback
 * <AdBanner
 *   placement="inline"
 *   fallbackContent={<div>Sponsored Content</div>}
 * />
 * ```
 */
export const AdBanner = ({
  placement = 'footer',
  size = 'responsive',
  className = '',
  show = true,
  adSlot,
  fallbackContent,
  onLoad,
  onError,
}: AdBannerProps): ReactElement | null => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(show);

  // Handle visibility changes
  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  // Handle ad loading simulation (in real app, this would integrate with ad network)
  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      // Simulate ad loading
      const success = Math.random() > 0.1; // 90% success rate
      
      if (success) {
        setIsLoaded(true);
        onLoad?.();
      } else {
        setHasError(true);
        onError?.();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isVisible, onLoad, onError]);

  if (!isVisible) return null;

  const placementClasses = getPlacementClasses(placement);
  const sizeClasses = getSizeClasses(size, placement);
  
  const containerClasses = [
    'flex items-center justify-center overflow-hidden',
    placementClasses,
    sizeClasses,
    className
  ].filter(Boolean).join(' ');

  // Loading state
  if (!isLoaded && !hasError) {
    return (
      <div className={containerClasses} aria-label="Carregando anúncio">
        <div className="flex items-center justify-center w-full h-full bg-gray-100 animate-pulse">
          <div className="text-gray-400 text-sm">
            <svg className="w-6 h-6 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <span className="hidden md:inline">Carregando...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state with fallback
  if (hasError) {
    if (fallbackContent) {
      return (
        <div className={containerClasses} aria-label="Conteúdo patrocinado">
          {fallbackContent}
        </div>
      );
    }
    
    return (
      <div className={containerClasses} aria-label="Espaço publicitário">
        <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded">
          <div className="text-center text-primary-600 text-sm px-4">
            <svg className="w-6 h-6 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <p className="font-medium">Espaço Publicitário</p>
            <p className="text-xs opacity-75 hidden md:block">Ajude-nos a manter o app gratuito</p>
          </div>
        </div>
      </div>
    );
  }

  // Loaded state - in real app, this would render actual ad content
  return (
    <div className={containerClasses} aria-label="Anúncio">
      <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded">
        <div className="text-center text-gray-600 px-4">
          <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
          
          {/* Mock ad content */}
          <div className="space-y-1">
            <p className="font-semibold text-sm md:text-base">
              Controle suas finanças melhor
            </p>
            <p className="text-xs md:text-sm opacity-75">
              Banco Digital XYZ - Conta gratuita
            </p>
            <div className="hidden md:block">
              <button className="mt-2 px-3 py-1 bg-primary-500 text-white text-xs rounded hover:bg-primary-600 transition-colors">
                Saiba mais
              </button>
            </div>
          </div>
          
          {/* Ad slot indicator */}
          {adSlot && (
            <div className="absolute top-1 right-1 text-xs text-gray-400 opacity-50">
              {adSlot}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Hook for managing ad banner visibility and preferences
 * 
 * @example
 * ```tsx
 * const { showAds, hideAd, showAd } = useAdBanner();
 * 
 * return (
 *   <AdBanner 
 *     show={showAds} 
 *     onError={() => hideAd('header')}
 *   />
 * );
 * ```
 */
export interface UseAdBannerReturn {
  showAds: boolean;
  hideAd: (placement: BannerPlacement) => void;
  showAd: (placement: BannerPlacement) => void;
  toggleAds: () => void;
}

export function useAdBanner(): UseAdBannerReturn {
  const [adVisibility, setAdVisibility] = useState<Record<BannerPlacement, boolean>>({
    header: true,
    footer: true,
    sidebar: true,
    inline: true,
  });

  const [globalAdPreference, setGlobalAdPreference] = useState(() => {
    if (typeof window === 'undefined') return true;
    
    const saved = localStorage.getItem('show-ads');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Save ad preference to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('show-ads', JSON.stringify(globalAdPreference));
    }
  }, [globalAdPreference]);

  const hideAd = (placement: BannerPlacement): void => {
    setAdVisibility(prev => ({ ...prev, [placement]: false }));
  };

  const showAd = (placement: BannerPlacement): void => {
    setAdVisibility(prev => ({ ...prev, [placement]: true }));
  };

  const toggleAds = (): void => {
    setGlobalAdPreference((prev: boolean) => !prev);
  };

  const showAds = globalAdPreference && Object.values(adVisibility).some(Boolean);

  return {
    showAds,
    hideAd,
    showAd,
    toggleAds,
  };
}