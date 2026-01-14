import { renderHook, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { translations } from '../i18n';

it('should initialize with language as pt', () => {
  const { result } = renderHook(() => useLanguage(), {
    wrapper: LanguageProvider,
  });

  expect(result.current.language).toBe('pt');
});

it('should toggle language from pt to en', () => {
  const { result } = renderHook(() => useLanguage(), {
    wrapper: LanguageProvider,
  });

  act(() => {
    result.current.toggleLanguage();
  });

  expect(result.current.language).toBe('en');
});

it('should toggle language back to pt', () => {
  const { result } = renderHook(() => useLanguage(), {
    wrapper: LanguageProvider,
  });

  act(() => {
    result.current.toggleLanguage();
    result.current.toggleLanguage();
  });

  expect(result.current.language).toBe('pt');
});

it('should update translations when language changes', () => {
  const { result } = renderHook(() => useLanguage(), {
    wrapper: LanguageProvider,
  });

  expect(result.current.t).toBe(translations.pt);

  act(() => {
    result.current.toggleLanguage();
  });

  expect(result.current.t).toBe(translations.en);
});

it('should throw error when used outside LanguageProvider', () => {
  expect(() => {
    renderHook(() => useLanguage());
  }).toThrow('useLanguage must be used within LanguageProvider');
});
