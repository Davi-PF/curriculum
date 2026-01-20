import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SkillModal } from "../../components/Skills/SkillModal";
import { Skill } from "@/src/types/skill";

describe("SkillModal", () => {
  const mockSkill: Skill = {
    id: "react",
    label: "React",
    description: "Biblioteca para interfaces",
  };

  it("não renderiza nada quando skill é null", () => {
    const { container } = render(
      <SkillModal
        skill={null}
        isOpen={false}
        isClosing={false}
        onClose={vi.fn()}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renderiza título e descrição da skill quando aberta", () => {
    render(
      <SkillModal
        skill={mockSkill}
        isOpen={true}
        isClosing={false}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Biblioteca para interfaces")).toBeInTheDocument();
  });

  it("chama onClose ao clicar no backdrop", () => {
    const onClose = vi.fn();

    render(
      <SkillModal
        skill={mockSkill}
        isOpen={true}
        isClosing={false}
        onClose={onClose}
      />,
    );

    const backdrop = screen.getAllByRole("button", {
      name: /fechar modal/i,
    })[0];

    fireEvent.click(backdrop);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("chama onClose ao clicar no botão de fechar (×)", () => {
    const onClose = vi.fn();

    render(
      <SkillModal
        skill={mockSkill}
        isOpen={true}
        isClosing={false}
        onClose={onClose}
      />,
    );

    const closeButton = screen.getAllByRole("button", {
      name: /fechar modal/i,
    })[1];

    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("aplica estado fechado quando isOpen=false", () => {
    render(
      <SkillModal
        skill={mockSkill}
        isOpen={false}
        isClosing={false}
        onClose={vi.fn()}
      />,
    );

    const backdrop = screen.getAllByRole("button", {
      name: /fechar modal/i,
    })[0];
    expect(backdrop.className).toContain("opacity-0");

    const dialog = document.querySelector("dialog");
    expect(dialog).toBeTruthy();
    expect(dialog?.hasAttribute("open")).toBe(false);
    expect(dialog?.className).toContain("scale-95");
    expect(dialog?.className).toContain("opacity-0");
  });

  it("aplica estado fechado quando isClosing=true (animação de saída)", () => {
    render(
      <SkillModal
        skill={mockSkill}
        isOpen={true}
        isClosing={true}
        onClose={vi.fn()}
      />,
    );

    const backdrop = screen.getAllByRole("button", {
      name: /fechar modal/i,
    })[0];
    expect(backdrop.className).toContain("opacity-0");

    const dialog = document.querySelector("dialog");
    expect(dialog).toBeTruthy();
    expect(dialog?.hasAttribute("open")).toBe(false);
    expect(dialog?.className).toContain("scale-95");
    expect(dialog?.className).toContain("opacity-0");
  });
});
