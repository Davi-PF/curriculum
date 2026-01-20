import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { Skill } from "../../types/skill";
import { SkillGroup } from "../../components/Skills/SkillGroup";

// Mock do SkillButton para o teste ser unitário do SkillGroup
vi.mock("@/src/components/Skills/SkillButton", () => ({
  SkillButton: ({
    skill,
    onClick,
  }: {
    skill: Skill;
    onClick: (skill: Skill) => void;
  }) => (
    <button type="button" onClick={() => onClick(skill)}>
      {skill.label}
    </button>
  ),
}));

function makeSkill(id: string, label: string, description = "desc"): Skill {
  return { id, label, description };
}

describe("SkillGroup", () => {
  it("renderiza o título e os botões das skills", () => {
    const skills: Skill[] = [
      makeSkill("hard-react", "React"),
      makeSkill("hard-ts", "TypeScript"),
    ];

    render(
      <SkillGroup
        title="Hard Skills"
        skills={skills}
        showHint={false}
        hintText="Toque em uma habilidade"
        onSkillClick={vi.fn()}
      />
    );

    expect(screen.getByRole("heading", { name: "Hard Skills" })).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("chama onSkillClick com a skill correta ao clicar", () => {
    const onSkillClick = vi.fn();
    const skills: Skill[] = [
      makeSkill("hard-react", "React", "Biblioteca para interfaces"),
      makeSkill("hard-ts", "TypeScript", "Linguagem tipada"),
    ];

    render(
      <SkillGroup
        title="Hard Skills"
        skills={skills}
        showHint={false}
        hintText="Toque em uma habilidade"
        onSkillClick={onSkillClick}
      />
    );

    fireEvent.click(screen.getByText("React"));

    expect(onSkillClick).toHaveBeenCalledTimes(1);
    expect(onSkillClick).toHaveBeenCalledWith(skills[0]);
  });

  it("exibe o hintText quando showHint=true e oculta quando showHint=false", () => {
    const skills: Skill[] = [makeSkill("hard-react", "React")];

    const { rerender } = render(
      <SkillGroup
        title="Hard Skills"
        skills={skills}
        showHint={false}
        hintText="Toque em uma habilidade para ver detalhes"
        onSkillClick={vi.fn()}
      />
    );

    const hint = screen.getByText("Toque em uma habilidade para ver detalhes");
    expect(hint).toHaveAttribute("hidden");

    rerender(
      <SkillGroup
        title="Hard Skills"
        skills={skills}
        showHint={true}
        hintText="Toque em uma habilidade para ver detalhes"
        onSkillClick={vi.fn()}
      />
    );

    expect(screen.getByText("Toque em uma habilidade para ver detalhes")).not.toHaveAttribute("hidden");
  });

  it("aplica classes de glow no título quando showHint=true", () => {
    const skills: Skill[] = [makeSkill("hard-react", "React")];

    render(
      <SkillGroup
        title="Hard Skills"
        skills={skills}
        showHint={true}
        hintText="Toque em uma habilidade"
        onSkillClick={vi.fn()}
      />
    );

    // O "pill" é o parent do heading
    const heading = screen.getByRole("heading", { name: "Hard Skills" });
    const pill = heading.parentElement;

    expect(pill).toBeTruthy();
    expect(pill!.className).toContain("ring-2");
    expect(pill!.className).toContain("ring-emerald-400/40");
  });

  it("aplica className no wrapper externo", () => {
    const skills: Skill[] = [makeSkill("hard-react", "React")];

    const { container } = render(
      <SkillGroup
        title="Hard Skills"
        skills={skills}
        showHint={false}
        hintText="Toque em uma habilidade"
        onSkillClick={vi.fn()}
        className="mt-6"
      />
    );

    // wrapper é o primeiro div retornado pelo componente
    expect(container.firstElementChild).toHaveClass("mt-6");
  });
});
