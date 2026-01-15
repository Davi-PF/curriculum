import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Skills from "../../components/Skills/Skills";

vi.mock("../../contexts/LanguageContext", () => ({
  useLanguage: () => ({
    language: "pt",
    t: {
      skill: {
        title: "Habilidades",
        hardSkills: "Hard Skills",
        softSkills: "Soft Skills",
      },
    },
  }),
}));
vi.mock("../../data/skills", () => ({
  skillsByLanguage: {
    pt: [
      {
        id: "hard-react",
        label: "React",
        description: "Biblioteca para interfaces",
      },
      {
        id: "soft-comunicacao",
        label: "Comunicação",
        description: "Comunicação clara e objetiva",
      },
    ],
  },
}));

describe("Skills", () => {
  it("renderiza títulos e listas de hard e soft skills", () => {
    render(<Skills />);

    expect(screen.getByText("Habilidades")).toBeInTheDocument();
    expect(screen.getByText("Hard Skills")).toBeInTheDocument();
    expect(screen.getByText("Soft Skills")).toBeInTheDocument();

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Comunicação")).toBeInTheDocument();
  });

  it("abre o modal ao clicar em uma skill", () => {
    vi.useFakeTimers();

    render(<Skills />);

    fireEvent.click(screen.getByText("React"));

    act(() => {
      vi.advanceTimersByTime(10);
    });

    expect(screen.getByText("Biblioteca para interfaces")).toBeInTheDocument();

    vi.useRealTimers();
  });

  it("fecha o modal ao clicar no botão de fechar", () => {
    vi.useFakeTimers();

    render(<Skills />);

    fireEvent.click(screen.getByText("React"));

    act(() => {
      vi.advanceTimersByTime(10); // abre modal
    });

    expect(screen.getByText("Biblioteca para interfaces")).toBeInTheDocument();

    const closeButtons = screen.getAllByRole("button", {
      name: /fechar modal/i,
    });

    fireEvent.click(closeButtons[1]); // botão do header

    act(() => {
      vi.advanceTimersByTime(200); // animação + clearSkill
    });

    expect(
      screen.queryByText("Biblioteca para interfaces")
    ).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});
