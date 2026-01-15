import {
  render,
  renderHook,
  act,
  fireEvent,
  screen,
} from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { LanguageProvider, useLanguage } from "../contexts/LanguageContext";
import { translations } from "../i18n";

function TestComponent() {
  const { language, t, toggleLanguage } = useLanguage();

  return (
    <div>
      <span data-testid="language">{language}</span>
      <span data-testid="translation-ref">
        {t === translations.pt ? "pt" : "en"}
      </span>
      <button onClick={toggleLanguage}>toggle</button>
    </div>
  );
}

describe("LanguageContext – Provider", () => {
  it("should initialize with language as pt", () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    expect(result.current.language).toBe("pt");
  });

  it("should toggle language from pt to en", () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    act(() => {
      result.current.toggleLanguage();
    });

    expect(result.current.language).toBe("en");
  });

  it("should toggle language back to pt", () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    act(() => {
      result.current.toggleLanguage();
      result.current.toggleLanguage();
    });

    expect(result.current.language).toBe("pt");
  });

  it("should update translations when language changes", () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    expect(result.current.t).toBe(translations.pt);

    act(() => {
      result.current.toggleLanguage();
    });

    expect(result.current.t).toBe(translations.en);
  });

  it("should throw error when used outside LanguageProvider", () => {
    expect(() => {
      renderHook(() => useLanguage());
    }).toThrow("useLanguage must be used within LanguageProvider");
  });
});

describe("LanguageContext – useLanguage hook", () => {
  it("toggles language from pt to en", () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    fireEvent.click(screen.getByText("toggle"));

    expect(screen.getByTestId("language")).toHaveTextContent("en");
  });

  it("updates translations when language changes", () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    const initialTranslation =
      screen.getByTestId("translation-ref").textContent;

    fireEvent.click(screen.getByText("toggle"));

    const updatedTranslation = screen.getByTestId("translation-ref").textContent;

    expect(updatedTranslation).not.toBe(initialTranslation);
  });

  it("throws error when useLanguage is used outside LanguageProvider", () => {
    const renderOutsideProvider = () => {
      render(<TestComponent />);
    };

    expect(renderOutsideProvider).toThrow(
      "useLanguage must be used within LanguageProvider"
    );
  });
});
