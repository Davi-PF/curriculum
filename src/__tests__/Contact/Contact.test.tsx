import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Contact from "../../components/Contact/Contact";
import { renderWithLanguage } from "../test-utils";

const writeTextMock = vi.fn().mockResolvedValue(undefined);

Object.defineProperty(navigator, "clipboard", {
  configurable: true,
  value: {
    writeText: writeTextMock,
  },
});

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
    fireEvent.click(emailButton);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith("daviprufer@gmail.com");
    });
  });

  it("copia telefone ao clicar", async () => {
    renderWithLanguage(<Contact />);

    const phoneButton = screen.getByLabelText(/copiar telefone/i);
    fireEvent.click(phoneButton);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith("47999585464");
    });
  });
});
