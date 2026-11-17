import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Contact from "../../components/Contact/Contact";
import { LanguageProvider, useLanguage } from "../../contexts/LanguageContext";
import { renderWithLanguage } from "../test-utils";

const writeTextMock = vi.fn().mockResolvedValue(undefined);

Object.defineProperty(navigator, "clipboard", {
  configurable: true,
  value: {
    writeText: writeTextMock,
  },
});

function ContactWithToggle() {
  const { toggleLanguage } = useLanguage();

  return (
    <div>
      <button type="button" onClick={toggleLanguage}>
        Alternar idioma
      </button>
      <Contact />
    </div>
  );
}

describe("Contact", () => {
  beforeEach(() => {
    writeTextMock.mockClear();
  });

  it("renderiza secao de contato e copia email ao clicar", async () => {
    renderWithLanguage(<Contact />);

    expect(
      screen.getByRole("heading", { name: /contato/i })
    ).toBeInTheDocument();

    const emailButton = screen.getByLabelText(/copiar email/i);
    expect(emailButton).toHaveAttribute(
      "aria-label",
      expect.stringContaining("Email:"),
    );
    fireEvent.click(emailButton);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith("daviprufer@gmail.com");
    });
  });

  it("copia telefone ao clicar", async () => {
    renderWithLanguage(<Contact />);

    const phoneButton = screen.getByLabelText(/copiar telefone/i);
    expect(phoneButton).toHaveAttribute(
      "aria-label",
      expect.stringContaining("Telefone:"),
    );
    fireEvent.click(phoneButton);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith("47999585464");
    });
  });

  it("exposes WCAG 2.5.3 compliant accessible names for email, phone, and contact links in PT and EN", () => {
    render(
      <LanguageProvider>
        <ContactWithToggle />
      </LanguageProvider>,
    );

    expect(
      screen.getByRole("button", { name: /Copiar email: Email:/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Copiar telefone: Telefone:/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /LinkedIn:\s*Acesse por aqui!/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /GitHub:\s*Acesse por aqui!/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Alternar idioma" }));

    expect(
      screen.getByRole("button", { name: /Copy email: Email:/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Copy phone: Phone:/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /LinkedIn:\s*Access here!/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /GitHub:\s*Access here!/i }),
    ).toBeInTheDocument();
  });
});
