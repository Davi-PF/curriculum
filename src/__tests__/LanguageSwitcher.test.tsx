import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

const toggleLanguageMock = vi.fn();

// Variável hoisted para permitir mudar o idioma por teste
const languageState = vi.hoisted(() => ({ language: "pt" as "pt" | "en" }));

vi.mock("../contexts/LanguageContext", () => ({
  useLanguage: () => ({
    language: languageState.language,
    toggleLanguage: toggleLanguageMock,
  }),
}));

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    toggleLanguageMock.mockClear();
    languageState.language = "pt";
  });

  it("renders with Portuguese as default language (shows English flag)", () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button", { name: /language switcher/i });
    expect(button).toBeInTheDocument();

    // quando language === 'pt', alt deve ser "English"
    const image = screen.getByRole("img", { name: /english/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/images/icons/estados-unidos.png");
  });

  it("renders with English language (shows Portuguese flag)", () => {
    languageState.language = "en";
    render(<LanguageSwitcher />);

    // quando language !== 'pt', alt deve ser "Português"
    const image = screen.getByRole("img", { name: /português/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/images/icons/brasil.png");
  });

  it("calls toggleLanguage when clicked", () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button", { name: /language switcher/i });
    fireEvent.click(button);

    expect(toggleLanguageMock).toHaveBeenCalledTimes(1);
  });

  it("applies scale class when isScrolled is true", () => {
    render(<LanguageSwitcher isScrolled />);

    const button = screen.getByRole("button", { name: /language switcher/i });
    expect(button.className).toContain("scale-87");
  });
});
