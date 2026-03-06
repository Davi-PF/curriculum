import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

const toggleLanguageMock = vi.fn();

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

  it("renders with Portuguese as default language", () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button", { name: "Switch to English" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button.className).toContain("scale-100");
  });

  it("renders with English language", () => {
    languageState.language = "en";
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button", { name: /mudar para portugu/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("calls toggleLanguage when clicked", () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button", { name: "Switch to English" });
    fireEvent.click(button);

    expect(toggleLanguageMock).toHaveBeenCalledTimes(1);
  });

  it("applies scale class when isScrolled is true", () => {
    render(<LanguageSwitcher isScrolled />);

    const button = screen.getByRole("button", { name: "Switch to English" });
    expect(button.className).toContain("scale-87");
  });
});
