import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

    const button = screen.getByRole("button", { name: "EN — Switch to English" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("lang", "en");
    expect(button).not.toHaveAttribute("aria-pressed");
    expect(button.className).toContain("scale-100");
  });

  it("renders with English language", () => {
    languageState.language = "en";
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button", { name: "PT — Mudar para Português" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("lang", "pt");
    expect(button).not.toHaveAttribute("aria-pressed");
  });

  it("calls toggleLanguage when clicked", () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button", { name: "EN — Switch to English" });
    fireEvent.click(button);

    expect(toggleLanguageMock).toHaveBeenCalledTimes(1);
  });

  it("applies scale class when isScrolled is true", () => {
    render(<LanguageSwitcher isScrolled />);

    const button = screen.getByRole("button", { name: "EN — Switch to English" });
    expect(button.className).toContain("scale-87");
  });

  it("exposes visible focus styles and hides decorative visual indicators from assistive technologies", () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button", { name: "EN — Switch to English" });
    expect(button.className).toContain("focus-visible:outline-none");
    expect(button.className).toContain("focus-visible:ring-2");
    expect(button.className).toContain("focus-visible:ring-emerald-300");

    const hiddenSpans = button.querySelectorAll('span[aria-hidden="true"]');
    expect(hiddenSpans.length).toBeGreaterThanOrEqual(2);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("can be focused with Tab and activated with Enter and Space via keyboard", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button type="button">Antes</button>
        <LanguageSwitcher />
        <button type="button">Depois</button>
      </div>,
    );

    const before = screen.getByRole("button", { name: "Antes" });
    const switcher = screen.getByRole("button", { name: "EN — Switch to English" });
    const after = screen.getByRole("button", { name: "Depois" });

    before.focus();
    await user.tab();
    expect(document.activeElement).toBe(switcher);

    await user.keyboard("{Enter}");
    expect(toggleLanguageMock).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(switcher);

    await user.keyboard(" ");
    expect(toggleLanguageMock).toHaveBeenCalledTimes(2);
    expect(document.activeElement).toBe(switcher);

    await user.tab();
    expect(document.activeElement).toBe(after);
  });
});
