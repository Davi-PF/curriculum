import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ExpandableText } from "../components/ExpandableText/ExpandableText";

// Mock do useLanguage para controlar language e textos do botão
const langState = vi.hoisted(() => ({
  language: "pt" as "pt" | "en",
  t: {
    expandable: {
      showMore: "Ler mais",
      showLess: "Ver menos",
    },
  },
}));

vi.mock("../contexts/LanguageContext", () => ({
  useLanguage: () => ({
    language: langState.language,
    t: langState.t,
  }),
}));

describe("ExpandableText", () => {
  beforeEach(() => {
    // garante execução imediata do callback do rAF para setIsExpandable acontecer
    vi.spyOn(globalThis, "requestAnimationFrame").mockImplementation(
      (cb: FrameRequestCallback) => {
        cb(0);
        return 0;
      }
    );

    // reset idioma padrão
    langState.language = "pt";
  });

  it("renderiza o texto corretamente", () => {
    render(<ExpandableText text="Texto de teste simples" />);

    expect(screen.getByText("Texto de teste simples")).toBeInTheDocument();
  });

  it("não exibe botão quando o texto não é expansível", () => {
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      value: 50,
    });
    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      value: 100,
    });

    render(<ExpandableText text="Texto curto" clampLines={2} />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it('exibe botão "Ler mais" quando o texto é expansível', async () => {
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      value: 200,
    });
    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      value: 50,
    });

    render(<ExpandableText text="Texto longo que extrapola o limite" clampLines={1} />);

    expect(
      await screen.findByRole("button", { name: /Ler mais/i })
    ).toBeInTheDocument();
  });

  it('alterna entre "Ler mais" e "Ver menos" ao clicar e aplica line-clamp-none', async () => {
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      value: 200,
    });
    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      value: 50,
    });

    render(<ExpandableText text="Texto longo para expandir" clampLines={1} />);

    const paragraph = screen.getByText("Texto longo para expandir");

    // estado inicial: não expandido => line-clamp-1
    expect(paragraph.className).toContain("line-clamp-1");

    const button = await screen.findByRole("button", { name: /Ler mais/i });
    fireEvent.click(button);

    // expandido => line-clamp-none
    expect(paragraph.className).toContain("line-clamp-none");
    expect(screen.getByRole("button", { name: /Ver menos/i })).toBeInTheDocument();
  });

  it('usa fallback "line-clamp-3" quando clampLines não existe no mapa', () => {
    // Força "não expansível" para não aparecer botão e interferir
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      value: 50,
    });
    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      value: 100,
    });

    render(<ExpandableText text="Texto qualquer" clampLines={99} />);

    const paragraph = screen.getByText("Texto qualquer");
    expect(paragraph.className).toContain("line-clamp-3");
  });

  it('aplica hyphens-none quando language não é "pt"', () => {
    // Força "não expansível" para não depender do botão
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      value: 50,
    });
    Object.defineProperty(HTMLElement.prototype, "clientHeight", {
      configurable: true,
      value: 100,
    });

    langState.language = "en";

    render(<ExpandableText text="Text in English" clampLines={2} />);

    const paragraph = screen.getByText("Text in English");
    expect(paragraph.className).toContain("hyphens-none");
  });
});
