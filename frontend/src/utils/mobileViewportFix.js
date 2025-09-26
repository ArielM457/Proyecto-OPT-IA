
import { useEffect } from 'react';

export const initMobileViewportFix = () => {
  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    
    document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  setViewportHeight();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setViewportHeight, 150);
  });

  window.addEventListener('orientationchange', () => {
    setTimeout(setViewportHeight, 500);
  });

  let lastHeight = window.innerHeight;
  window.addEventListener('scroll', () => {
    const currentHeight = window.innerHeight;
    if (Math.abs(currentHeight - lastHeight) > 150) {
      setViewportHeight();
      lastHeight = currentHeight;
    }
  });
};

export const useMobileViewportFix = () => {
  useEffect(() => {
    initMobileViewportFix();

  }, []);
};