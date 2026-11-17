import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Header from "../../components/Header/Header";
import { LanguageProvider } from "../../contexts/LanguageContext";

function renderHeaderWithContext() {
  return render(
    <LanguageProvider>
      <div>
        <button type="button">Antes do cabeçalho</button>
        <Header />
        <main>
          <a href="#conteudo">Ir para conteúdo</a>
        </main>
      </div>
    </LanguageProvider>,
  );
}

describe("Header accessibility integration", () => {
  it("renders banner landmark without empty navigation landmark, exposes h1, translated avatar, and language button", () => {
    renderHeaderWithContext();

    const banner = screen.getByRole("banner");
    expect(banner.tagName).toBe("HEADER");
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Davi Prudente Ferreira",
    });
    expect(banner).toContainElement(heading);

    const switcher = screen.getByRole("button", { name: "EN — Switch to English" });
    expect(banner).toContainElement(switcher);
    expect(switcher).not.toHaveAttribute("aria-pressed");
    expect(switcher).toHaveAttribute("lang", "en");

    const avatar = screen.getByRole("img", { name: "Foto de perfil" });
    expect(banner).toContainElement(avatar);
  });

  it("supports sequential Tab/Shift+Tab navigation and switches PT/EN via Enter and Space preserving focus", async () => {
    const user = userEvent.setup();
    renderHeaderWithContext();

    const beforeButton = screen.getByRole("button", {
      name: "Antes do cabeçalho",
    });
    const switcher = screen.getByRole("button", { name: "EN — Switch to English" });
    const mainLink = screen.getByRole("link", { name: "Ir para conteúdo" });

    beforeButton.focus();
    expect(document.activeElement).toBe(beforeButton);

    await user.tab();
    expect(document.activeElement).toBe(switcher);

    // Ativa com Enter para inglês mantendo foco e atualizando estados acessíveis
    await user.keyboard("{Enter}");
    expect(document.documentElement.lang).toBe("en");
    expect(document.activeElement).toBe(switcher);
    expect(switcher).toHaveAccessibleName("PT — Mudar para Português");
    expect(switcher).not.toHaveAttribute("aria-pressed");
    expect(switcher).toHaveAttribute("lang", "pt");
    expect(screen.getByRole("img", { name: "Profile photo" })).toBeInTheDocument();
    expect(screen.queryByAltText("Foto de perfil")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Davi Prudente Ferreira" }),
    ).toBeInTheDocument();

    // Ativa com Space para retornar ao português mantendo foco no botão
    await user.keyboard(" ");
    expect(document.documentElement.lang).toBe("pt");
    expect(document.activeElement).toBe(switcher);
    expect(switcher).toHaveAccessibleName("EN — Switch to English");
    expect(switcher).not.toHaveAttribute("aria-pressed");
    expect(switcher).toHaveAttribute("lang", "en");
    expect(screen.getByRole("img", { name: "Foto de perfil" })).toBeInTheDocument();

    // Tab sai do banner diretamente para o próximo elemento focável da página e Shift+Tab retorna
    await user.tab();
    expect(document.activeElement).toBe(mainLink);

    await user.tab({ shift: true });
    expect(document.activeElement).toBe(switcher);
  });

  it.each([
    { label: "mobile", width: 375 },
    { label: "desktop", width: 1280 },
  ])(
    "preserves non-overlapping grid structure, accessible controls, and keyboard switching on $label viewport ($width px)",
    async ({ width }) => {
      const user = userEvent.setup();
      const originalWidth = window.innerWidth;

      Object.defineProperty(window, "innerWidth", {
        configurable: true,
        writable: true,
        value: width,
      });

      try {
        renderHeaderWithContext();

        const banner = screen.getByRole("banner");
        const grid = banner.querySelector(
          ".grid-cols-\\[minmax\\(0\\,1fr\\)_auto_minmax\\(0\\,1fr\\)\\]",
        );
        expect(grid).not.toBeNull();

        const switcher = screen.getByRole("button", {
          name: "EN — Switch to English",
        });
        expect(switcher).toBeVisible();
        expect(switcher.className).toContain("focus-visible:ring-2");

        switcher.focus();
        await user.keyboard("{Enter}");

        expect(document.activeElement).toBe(switcher);
        expect(switcher).not.toHaveAttribute("aria-pressed");
        expect(switcher).toHaveAccessibleName("PT — Mudar para Português");
        expect(screen.getByRole("img", { name: "Profile photo" })).toBeVisible();
      } finally {
        Object.defineProperty(window, "innerWidth", {
          configurable: true,
          writable: true,
          value: originalWidth,
        });
      }
    },
  );
});
