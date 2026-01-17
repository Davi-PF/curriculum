import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import SharePageButton from "../components/SharePageButton";

// Mock do contexto de linguagem
const mockTranslations = {
  shareButtonStatus: {
    share: "Compartilhar",
    copied: "Copiado!",
    shared: "Compartilhado!",
    error: "Erro",
  },
};

vi.mock("../contexts/LanguageContext", () => ({
  useLanguage: () => ({ t: mockTranslations }),
}));

describe("SharePageButton", () => {
  let originalNavigator: any;

  beforeEach(() => {
    vi.clearAllMocks();
    originalNavigator = global.navigator;
  });

  afterEach(() => {
    global.navigator = originalNavigator;
  });

  describe("Renderização", () => {
    it("deve renderizar o botão com texto padrão", () => {
      render(<SharePageButton />);
      expect(
        screen.getByRole("button", { name: /compartilhar link da página/i })
      ).toBeDefined();
      expect(screen.getByText("Compartilhar")).toBeDefined();
    });

    it("deve aplicar className customizada", () => {
      render(<SharePageButton className="custom-class" />);
      const button = screen.getByRole("button");
      expect(button.className).toContain("custom-class");
    });

    it("deve ter aria-label correto", () => {
      render(<SharePageButton />);
      expect(
        screen.getByLabelText("Compartilhar link da página")
      ).toBeDefined();
    });

    it("deve ter type='button' para evitar submit em forms", () => {
      render(<SharePageButton />);
      expect(screen.getByRole("button").getAttribute("type")).toBe("button");
    });
  });

  describe("Web Share API", () => {
    it("deve chamar navigator.share quando disponível", async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined);

      Object.defineProperty(global.navigator, "share", {
        value: mockShare,
        writable: true,
        configurable: true,
      });

      render(
        <SharePageButton
          url="https://example.com"
          title="Meu Site"
          text="Confira:"
        />
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockShare).toHaveBeenCalledWith({
          title: "Meu Site",
          text: "Confira:",
          url: "https://example.com",
        });
      });
    });

    it("deve mostrar estado 'shared' após compartilhar com sucesso", async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined);

      Object.defineProperty(global.navigator, "share", {
        value: mockShare,
        writable: true,
        configurable: true,
      });

      render(<SharePageButton url="https://example.com" />);

      fireEvent.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(screen.getByText("Compartilhado!")).toBeDefined();
      });
    });

    it("deve mostrar erro quando Web Share API falha", async () => {
      const mockShare = vi.fn().mockRejectedValue(new Error("Share failed"));

      Object.defineProperty(global.navigator, "share", {
        value: mockShare,
        writable: true,
        configurable: true,
      });

      render(<SharePageButton url="https://example.com" />);

      fireEvent.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(screen.getByText("Erro")).toBeDefined();
      });
    });
  });

  describe("Clipboard API (fallback)", () => {
    it("deve copiar para clipboard quando Web Share não está disponível", async () => {
      const mockWriteText = vi
        .fn<(text: string) => Promise<void>>()
        .mockResolvedValue(undefined);

      delete (globalThis.navigator as unknown as { share?: unknown }).share;

      // 2) Injeta clipboard mockado
      Object.defineProperty(globalThis.navigator, "clipboard", {
        value: { writeText: mockWriteText },
        configurable: true,
      });

      render(<SharePageButton url="https://example.com" />);
      fireEvent.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith("https://example.com");
      });

      expect(screen.getByRole("button")).toHaveTextContent("Copiado!");
    });

  });

  describe("Props e configurações", () => {
    it("deve usar título e texto customizados", async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined);

      Object.defineProperty(global.navigator, "share", {
        value: mockShare,
        writable: true,
        configurable: true,
      });

      render(
        <SharePageButton
          url="https://example.com"
          title="Título Custom"
          text="Texto custom aqui"
        />
      );

      fireEvent.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(mockShare).toHaveBeenCalledWith({
          title: "Título Custom",
          text: "Texto custom aqui",
          url: "https://example.com",
        });
      });
    });

    it("deve usar valores padrão quando props não são fornecidas", async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined);

      Object.defineProperty(global.navigator, "share", {
        value: mockShare,
        writable: true,
        configurable: true,
      });

      Object.defineProperty(global.window, "location", {
        value: { href: "https://current.com" },
        writable: true,
        configurable: true,
      });

      render(<SharePageButton />);

      fireEvent.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(mockShare).toHaveBeenCalledWith({
          title: "Currículo / Portfólio",
          text: "Confira meu currículo/portfólio:",
          url: "https://current.com",
        });
      });
    });

    it("deve usar URL fornecida na prop ao invés de window.location", async () => {
      const mockShare = vi.fn().mockResolvedValue(undefined);

      Object.defineProperty(global.navigator, "share", {
        value: mockShare,
        writable: true,
        configurable: true,
      });

      Object.defineProperty(global.window, "location", {
        value: { href: "https://wrong-url.com" },
        writable: true,
        configurable: true,
      });

      render(<SharePageButton url="https://correct-url.com" />);

      fireEvent.click(screen.getByRole("button"));

      await waitFor(() => {
        expect(mockShare).toHaveBeenCalledWith(
          expect.objectContaining({
            url: "https://correct-url.com",
          })
        );
      });
    });
  });
});
