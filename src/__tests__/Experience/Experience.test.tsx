import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import Experience from "../../components/Experience/Experience";
import { ExperienceItem } from "../../types/ExperienceRelated/ExperienceItem";

// 1) Dados mockados precisam existir ANTES do vi.mock (por causa do hoisting)
const mockExperiencesPt = vi.hoisted((): ExperienceItem[] => [
  {
    id: "1",
    company: "Acme",
    period: "2020",
    logo: "/acme.png",
    title: "Dev",
    description: "Desc 1",
    extraActivities: "Atividades",
    activities: [],
  },
  {
    id: "2",
    company: "Beta",
    period: "2021",
    logo: "/beta.png",
    title: "DevOps",
    description: "Desc 2",
    extraActivities: "Atividades",
    activities: [],
  },
]);

// 2) Mock do LanguageContext
vi.mock("../../contexts/LanguageContext", () => ({
  useLanguage: () => ({
    language: "pt",
    t: {
      experience: { title: "Experiência" },
    },
  }),
}));

// 3) Mock do data
vi.mock("../../data/experiences", () => ({
  experiencesByLanguage: {
    pt: mockExperiencesPt,
  },
}));

// 4) Mocks dos subcomponentes (props tipadas)
interface ExperienceHeaderMockProps {
  readonly title: string;
}

interface ExperienceTabsMockProps {
  readonly experiences: ExperienceItem[];
  readonly activeTab: number;
  readonly onChange: (index: number) => void;
}

interface ExperiencePanelMockProps {
  readonly experience: ExperienceItem;
}

vi.mock("../../components/Experience/ExperienceHeader", () => ({
  ExperienceHeader: ({ title }: ExperienceHeaderMockProps) => <h2>{title}</h2>,
}));

vi.mock("../../components/Experience/ExperienceTabs", () => ({
  ExperienceTabs: ({ experiences, onChange }: ExperienceTabsMockProps) => (
    <div>
      {experiences.map((e, idx) => (
        <button key={e.company} onClick={() => onChange(idx)}>
          {e.company}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("../../components/Experience/ExperiencePanel", () => ({
  ExperiencePanel: ({ experience }: ExperiencePanelMockProps) => (
    <div data-testid="panel">{experience.title}</div>
  ),
}));

describe("Experience", () => {
  it("renders the experience section with header, tabs and initial panel", () => {
    render(<Experience />);

    expect(
      screen.getByRole("heading", { name: "Experiência" })
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Acme" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Beta" })).toBeInTheDocument();

    expect(screen.getByTestId("panel")).toHaveTextContent("Dev");
  });

  it("changes the active experience when a tab is clicked", async () => {
    const user = userEvent.setup();

    render(<Experience />);

    expect(screen.getByTestId("panel")).toHaveTextContent("Dev");

    await user.click(screen.getByRole("button", { name: "Beta" }));

    expect(screen.getByTestId("panel")).toHaveTextContent("DevOps");
  });
});
