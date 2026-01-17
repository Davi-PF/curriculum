import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HeaderTitle } from "../../components/Header/HeaderTitle";
import { LanguageProvider } from "../../contexts/LanguageContext";

function renderWithLanguage(ui: React.ReactNode) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe("HeaderTitle", () => {
  it("renderiza o título do header a partir do i18n", () => {
    renderWithLanguage(<HeaderTitle isScrolled={false} />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Davi Prudente Ferreira"
    );
  });

  it("aplica classes de texto reduzidas quando está scrollado", () => {
    const { container } = renderWithLanguage(<HeaderTitle isScrolled />);

    const heading = container.querySelector("h1");
    expect(heading).toHaveClass("text-xs");
  });

  it("aplica classes de texto maiores quando não está scrollado", () => {
    const { container } = renderWithLanguage(
      <HeaderTitle isScrolled={false} />
    );

    const heading = container.querySelector("h1");
    expect(heading).toHaveClass("text-sm");
  });
});
