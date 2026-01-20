import { describe, it, beforeEach, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Skills from "../../components/Skills/Skills";

import type { Skill } from "../../types/skill";

// --------------------
// Mocks de dependências
// --------------------

// 1) LanguageContext
vi.mock("../../contexts/LanguageContext", () => ({
  useLanguage: () => ({
    language: "pt",
    t: {
      skill: {
        title: "Habilidades",
        hardSkills: "Hard Skills",
        softSkills: "Soft Skills",
        hintText: "Toque em uma habilidade para ver detalhes",
      },
    },
  }),
}));

// 2) skills data
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
        description: "Boa comunicação",
      },
    ],
  },
}));

// 3) useViewportHint: para não depender de IntersectionObserver
vi.mock("../../components/Skills/hooks/useViewportHint", () => ({
  useViewportHint: () => ({
    ref: { current: null },
    showHint: true, // você pode alternar para testar comportamento sem hint
  }),
}));

// 4) useModal e useSelectedSkill: controlamos o estado do modal via variáveis mutáveis
let modalState: {
  isOpen: boolean;
  isClosing: boolean;
  isModalVisible: boolean;
};

let selectedSkillState: Skill | null = null;

vi.mock("../../components/Skills/hooks/useModal", () => ({
  useModal: () => ({
    ...modalState,
    openModal: vi.fn(() => {
      modalState.isOpen = true;
      modalState.isClosing = false;
      modalState.isModalVisible = true;
    }),
    closeModal: vi.fn(() => {
      modalState.isClosing = true;
      // mantém visível durante closing; Skills limpa skill após 200ms
      modalState.isOpen = false;
    }),
  }),
}));

vi.mock("../../components/Skills/hooks/useSelectedSkill", () => ({
  useSelectedSkill: () => ({
    selectedSkill: selectedSkillState,
    selectSkill: vi.fn((skill: Skill) => {
      selectedSkillState = skill;
    }),

    clearSkill: vi.fn(() => {
      selectedSkillState = null;
      modalState.isModalVisible = false;
      modalState.isClosing = false;
      modalState.isOpen = false;
    }),
  }),
}));

// --------------------
// Helpers
// --------------------
function renderSkills() {
  return render(<Skills />);
}

describe("Skills", () => {
  beforeEach(() => {
    // estado inicial antes de cada teste
    modalState = { isOpen: false, isClosing: false, isModalVisible: false };
    selectedSkillState = null;
    vi.clearAllMocks();
  });

  it("renderiza títulos e skills separadas por hard/soft", () => {
    renderSkills();

    expect(screen.getByText("Habilidades")).toBeInTheDocument();
    expect(screen.getByText("Hard Skills")).toBeInTheDocument();
    expect(screen.getByText("Soft Skills")).toBeInTheDocument();

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Comunicação")).toBeInTheDocument();

    // como showHint está true no mock, o hintText aparece (pode ser 2x, hard e soft)
    expect(
      screen.getAllByText("Toque em uma habilidade para ver detalhes").length,
    ).toBeGreaterThan(0);
  });

  it("abre o modal ao clicar em uma skill e mostra descrição", () => {
    const { rerender } = renderSkills();

    // Clica pelo texto do botão (SkillButton renderiza label)
    fireEvent.click(screen.getByText("React"));

    // Como nossos mocks mutam estado, precisamos re-renderizar para Skills refletir o novo estado
    rerender(<Skills />);

    // Modal deve aparecer com descrição
    expect(screen.getByText("Biblioteca para interfaces")).toBeInTheDocument();
    const dialog = document.querySelector("dialog");
    expect(dialog).toBeTruthy();
    expect(dialog!).toHaveTextContent("React");
    expect(dialog!).toHaveTextContent("Biblioteca para interfaces");
  });

  it("fecha o modal ao clicar no botão de fechar e limpa após 200ms", () => {
    vi.useFakeTimers();

    const { rerender } = renderSkills();

    // abre
    fireEvent.click(screen.getByText("React"));
    rerender(<Skills />);
    expect(screen.getByText("Biblioteca para interfaces")).toBeInTheDocument();

    // fecha (há dois botões com aria-label "Fechar modal": backdrop e header)
    const closeButtons = screen.getAllByRole("button", {
      name: /fechar modal/i,
    });
    fireEvent.click(closeButtons.at(-1)!);


    // Skills faz clearSkill após 200ms
    act(() => {
      vi.advanceTimersByTime(250);
    });

    // refletir estado após timers
    rerender(<Skills />);

    expect(
      screen.queryByText("Biblioteca para interfaces"),
    ).not.toBeInTheDocument();

    vi.useRealTimers();
  });
});
