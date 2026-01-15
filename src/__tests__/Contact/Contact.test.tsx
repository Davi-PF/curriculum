import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Contact from "../../components/Contact/Contact";
import { renderWithLanguage } from "../test-utils";

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

describe("Contact", () => {
  it("renderiza seção de contato e exibe toast ao copiar email", async () => {
    renderWithLanguage(<Contact />);

    expect(
      screen.getByRole("heading", { name: /contato/i })
    ).toBeInTheDocument();

    const emailButton = screen.getByLabelText(/copiar email/i);
    fireEvent.click(emailButton);

    expect(await screen.findByText(/email copiado/i)).toBeInTheDocument();
  });

  it("exibe toast ao copiar telefone", async () => {
    renderWithLanguage(<Contact />);

    const phoneButton = screen.getByLabelText(/copiar telefone/i);
    fireEvent.click(phoneButton);

    expect(await screen.findByText(/telefone copiado/i)).toBeInTheDocument();
  });
});
