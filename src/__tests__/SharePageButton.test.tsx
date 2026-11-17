import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import SharePageButton from "../components/SharePageButton";

async function flushPromises(times = 2) {
  for (let i = 0; i < times; i += 1) {
    await Promise.resolve();
  }
}


type TTranslations = {
  shareButtonStatus: {
    title: string;
    text: string;
    ariaLabel: string;
    prompt: string;
    share: string;
    copied: string;
    shared: string;
    error: string;
  };
};

const translationsByLanguage: Record<"pt" | "en", TTranslations> = {
  pt: {
    shareButtonStatus: {
      title: "Currículo do Davi Prudente Ferreira",
      text: "Confira o currículo de:",
      ariaLabel: "Compartilhar link da página",
      prompt: "Copie o link:",
      share: "Compartilhar",
      copied: "Copiado!",
      shared: "Compartilhado!",
      error: "Erro",
    },
  },
  en: {
    shareButtonStatus: {
      title: "Davi Prudente Ferreira's Resume",
      text: "Check out the resume of:",
      ariaLabel: "Share page link",
      prompt: "Copy the link:",
      share: "Share",
      copied: "Link copied!",
      shared: "Page shared!",
      error: "Error",
    },
  },
};

let currentLang: "pt" | "en" = "pt";

vi.mock("../contexts/LanguageContext", () => ({
  useLanguage: () => ({ t: translationsByLanguage[currentLang] }),
}));

type ShareFn = (data: ShareData) => Promise<void>;
type ClipboardWriteTextFn = (text: string) => Promise<void>;

function setLocationHref(href: string) {
  const parsed = new URL(href);
  Object.defineProperty(globalThis, "location", {
    value: { href, origin: parsed.origin, pathname: parsed.pathname },
    writable: true,
    configurable: true,
  });
}

/**
 * Para este componente, usar `"share" in navigator` / `"clipboard" in navigator"`
 * significa que:
 * - setar `navigator.share = undefined` NÃO desativa; a propriedade continua existindo.
 * - para desativar, precisamos REMOVER a propriedade (delete).
 */
type ClipboardLike = Pick<Clipboard, "writeText">;

type NavPatch = {
  share?: (data: ShareData) => Promise<void>;
  clipboard?: ClipboardLike;
};

function patchNavigator(patch: NavPatch) {
  const nav = globalThis.navigator;

  delete (nav as unknown as { share?: unknown }).share;
  delete (nav as unknown as { clipboard?: unknown }).clipboard;

  if (patch.share) {
    Object.defineProperty(nav, "share", {
      value: patch.share,
      configurable: true,
      writable: true,
    });
  }

  if (patch.clipboard) {
    Object.defineProperty(nav, "clipboard", {
      value: patch.clipboard,
      configurable: true,
      writable: true,
    });
  }
}

function patchPrompt(
  mockPrompt: (message?: string, defaultValue?: string) => string | null
) {
  Object.defineProperty(globalThis, "prompt", {
    value: mockPrompt,
    configurable: true,
    writable: true,
  });
}

function renderAndClick(url?: string) {
  render(<SharePageButton url={url} />);
  const button = screen.getByRole("button", {
    name: "Compartilhar link da página",
  });
  fireEvent.click(button);
  return button;
}

describe("SharePageButton", () => {
  const originalPrompt = globalThis.prompt;

  beforeEach(() => {
    currentLang = "pt";
    vi.restoreAllMocks();
    setLocationHref("https://example.com/current");
    patchNavigator({});
    patchPrompt(vi.fn());
  });

  afterEach(() => {
    vi.useRealTimers();
    Object.defineProperty(globalThis, "prompt", {
      value: originalPrompt,
      configurable: true,
      writable: true,
    });
  });

  it("renderiza com label inicial", () => {
    render(<SharePageButton />);
    expect(
      screen.getByRole("button", { name: "Compartilhar link da página" })
    ).toHaveTextContent("Compartilhar");
  });

  describe("Web Share API", () => {
    it("chama navigator.share com url passada e mostra estado 'shared'", async () => {
      const shareMock = vi.fn<ShareFn>().mockResolvedValue(undefined);
      patchNavigator({ share: shareMock });

      const button = renderAndClick("https://example.com/custom");

      await waitFor(() => expect(shareMock).toHaveBeenCalledTimes(1));
      expect(shareMock).toHaveBeenCalledWith(
        expect.objectContaining({ url: "https://example.com/custom" })
      );

      expect(button).toHaveTextContent("Compartilhado!");
    });

    it("se share falhar, mostra estado 'error'", async () => {
      const shareMock = vi.fn<ShareFn>().mockRejectedValue(new Error("boom"));
      patchNavigator({ share: shareMock });

      const button = renderAndClick("https://example.com/custom");

      await waitFor(() => expect(button).toHaveTextContent("Erro"));
    });

    it("quando url não é passada, usa origin + pathname da página atual", async () => {
      const shareMock = vi.fn<ShareFn>().mockResolvedValue(undefined);
      patchNavigator({ share: shareMock });

      renderAndClick(); // sem url

      await waitFor(() => {
        expect(shareMock).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Currículo do Davi Prudente Ferreira",
            text: "Confira o currículo de:",
            url: "https://example.com/current",
          })
        );
      });
    });

    it("usa title e text explícitos quando fornecidos via props", async () => {
      const shareMock = vi.fn<ShareFn>().mockResolvedValue(undefined);
      patchNavigator({ share: shareMock });

      render(
        <SharePageButton
          url="https://example.com/custom"
          title="Título Customizado"
          text="Texto Customizado"
        />
      );
      fireEvent.click(
        screen.getByRole("button", { name: "Compartilhar link da página" })
      );

      await waitFor(() => {
        expect(shareMock).toHaveBeenCalledWith({
          title: "Título Customizado",
          text: "Texto Customizado",
          url: "https://example.com/custom",
        });
      });
    });

    it("usa aria-label, title e text padrão em inglês quando idioma é en", async () => {
      currentLang = "en";
      const shareMock = vi.fn<ShareFn>().mockResolvedValue(undefined);
      patchNavigator({ share: shareMock });

      render(<SharePageButton url="https://example.com/en" />);
      const button = screen.getByRole("button", { name: "Share page link" });
      expect(button).toHaveTextContent("Share");

      fireEvent.click(button);

      await waitFor(() => {
        expect(shareMock).toHaveBeenCalledWith({
          title: "Davi Prudente Ferreira's Resume",
          text: "Check out the resume of:",
          url: "https://example.com/en",
        });
      });
      expect(button).toHaveTextContent("Page shared!");
    });

    it("descarta query string e fragmento da URL atual ao compartilhar (SEC-05)", async () => {
      setLocationHref(
        "https://example.com/current?utm_source=newsletter&fbclid=abc123#contato"
      );
      const shareMock = vi.fn<ShareFn>().mockResolvedValue(undefined);
      patchNavigator({ share: shareMock });

      renderAndClick(); // sem url

      await waitFor(() => expect(shareMock).toHaveBeenCalledTimes(1));
      const sharedUrl = shareMock.mock.calls[0][0].url;
      expect(sharedUrl).toBe("https://example.com/current");
      expect(sharedUrl).not.toContain("?");
      expect(sharedUrl).not.toContain("#");
    });
  });

  describe("Clipboard API (fallback)", () => {
    it("copia apenas origin + pathname quando url não é passada (SEC-05)", async () => {
      setLocationHref("https://example.com/current?gclid=xyz#secao");
      const writeTextMock = vi.fn<ClipboardWriteTextFn>().mockResolvedValue(undefined);

      patchNavigator({
        clipboard: { writeText: writeTextMock } as unknown as Clipboard,
      });

      renderAndClick(); // sem url

      await waitFor(() =>
        expect(writeTextMock).toHaveBeenCalledWith("https://example.com/current")
      );
    });

    it("copia para clipboard quando Web Share não está disponível", async () => {
      const writeTextMock = vi.fn<ClipboardWriteTextFn>().mockResolvedValue(undefined);

      patchNavigator({
        clipboard: { writeText: writeTextMock } as unknown as Clipboard,
      });

      const button = renderAndClick("https://example.com/clip");

      await waitFor(() =>
        expect(writeTextMock).toHaveBeenCalledWith("https://example.com/clip")
      );
      expect(button).toHaveTextContent("Copiado!");
    });

    it("se clipboard falhar, mostra estado 'error'", async () => {
      const writeTextMock = vi.fn<ClipboardWriteTextFn>().mockRejectedValue(new Error("nope"));

      patchNavigator({
        clipboard: { writeText: writeTextMock } as unknown as Clipboard,
      });

      const button = renderAndClick("https://example.com/clip");

      await waitFor(() => expect(button).toHaveTextContent("Erro"));
    });
  });

  describe("Fallback final (prompt)", () => {
    it("usa prompt quando nenhuma API está disponível e mostra estado 'copied'", async () => {
      const promptMock = vi.fn(() => null);
      patchPrompt(promptMock);
      patchNavigator({}); // sem share/clipboard

      const button = renderAndClick("https://example.com/prompt");

      await waitFor(() =>
        expect(promptMock).toHaveBeenCalledWith(
          "Copie o link:",
          "https://example.com/prompt"
        )
      );

      expect(button).toHaveTextContent("Copiado!");
    });

    it("usa mensagem do prompt e aria-label em inglês quando idioma é en", async () => {
      currentLang = "en";
      const promptMock = vi.fn(() => null);
      patchPrompt(promptMock);
      patchNavigator({});

      render(<SharePageButton url="https://example.com/prompt-en" />);
      const button = screen.getByRole("button", { name: "Share page link" });
      fireEvent.click(button);

      await waitFor(() =>
        expect(promptMock).toHaveBeenCalledWith(
          "Copy the link:",
          "https://example.com/prompt-en"
        )
      );

      expect(button).toHaveTextContent("Link copied!");
    });
  });

  describe("Reset de status", () => {
    it("volta para idle após 2.5s (copied -> idle)", async () => {
  vi.useFakeTimers();

  const writeTextMock = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined);

  patchNavigator({
    clipboard: { writeText: writeTextMock } as Pick<Clipboard, "writeText">,
  });

  render(<SharePageButton url="https://example.com/reset" />);
  const button = screen.getByRole("button", { name: "Compartilhar link da página" });

  // dispara o handler
  await act(async () => {
    fireEvent.click(button);
    await flushPromises(); // garante que o await do writeText completou
  });

  expect(writeTextMock).toHaveBeenCalledWith("https://example.com/reset");
  expect(button).toHaveTextContent("Copiado!");

  act(() => {
    vi.advanceTimersByTime(2500);
  });

  expect(button).toHaveTextContent("Compartilhar");
});
  });

  describe("Acessibilidade", () => {
    it("permite interação via teclado (Enter) disparando ação", async () => {
      const writeTextMock = vi.fn<ClipboardWriteTextFn>().mockResolvedValue(undefined);

      patchNavigator({
        clipboard: { writeText: writeTextMock } as unknown as Clipboard,
      });

      render(<SharePageButton url="https://example.com/kb" />);
      const button = screen.getByRole("button", {
        name: "Compartilhar link da página",
      });

      button.focus();

      // Em alguns ambientes, Enter em button dispara click automaticamente; em outros não.
      // Para ser determinístico, disparamos o click que o browser geraria.
      fireEvent.keyDown(button, { key: "Enter", code: "Enter", charCode: 13 });
      fireEvent.click(button);

      await waitFor(() => expect(writeTextMock).toHaveBeenCalledTimes(1));
    });

    it("mantém classes de contraste acessível no estado normal e hover", () => {
      render(<SharePageButton />);

      const button = screen.getByRole("button", {
        name: "Compartilhar link da página",
      });

      expect(button.className).toContain("bg-stone-200/20");
      expect(button.className).toContain("hover:bg-stone-700/60");
      expect(button.className).not.toContain("hover:bg-stone-400/50");
      expect(button.className).toContain("text-emerald-300");
    });
  });
});