// src/__tests__/CurriculumDriveAccess.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CurriculumDriveAccess from "../../components/Contact/CurriculumDriveAccess";

// Mock do hook de idioma
vi.mock("../../contexts/LanguageContext", () => ({
  useLanguage: () => ({
    t: {
      contact: {
        curriculumText: "Currículo em PDF",
      },
    },
  }),
}));

describe("CurriculumDriveAccess", () => {
  it("renderiza o texto do botão a partir do i18n", () => {
    render(<CurriculumDriveAccess href="https://example.com/cv" />);

    expect(screen.getByText("Currículo em PDF")).toBeInTheDocument();
  });

  it("aplica href, target e rel corretamente", () => {
    render(<CurriculumDriveAccess href="https://example.com/cv" />);

    const link = screen.getByRole("link", { name: "Currículo em PDF" });

    expect(link).toHaveAttribute("href", "https://example.com/cv");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("inclui className extra sem perder classes base", () => {
    render(<CurriculumDriveAccess href="https://example.com/cv" className="mt-3 scale-90" />);

    const link = screen.getByRole("link", { name: "Currículo em PDF" });

    // classes base (verifica algumas-chave)
    expect(link.className).toContain("inline-block");
    expect(link.className).toContain("rounded-full");

    // classes customizadas
    expect(link.className).toContain("mt-3");
    expect(link.className).toContain("scale-90");
  });
});
