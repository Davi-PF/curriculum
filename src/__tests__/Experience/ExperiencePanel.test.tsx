import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { ExperiencePanel } from "../../components/Experience/ExperiencePanel";
import { ExperienceItem } from "../../types/ExperienceRelated/ExperienceItem";
import { Activity } from "../../types/ExperienceRelated/Activity";

// Spy usado dentro do mock (precisa ser hoisted por causa do vi.mock hoisting)
const activityItemSpy = vi.hoisted(() => vi.fn());

// Props do ExpandableText (mínimo necessário para o teste)
interface ExpandableTextMockProps {
  readonly text: string;
  readonly className?: string;
  readonly clampLines?: number;
}

// O path precisa bater com o import no ExperiencePanel.
vi.mock("../../components/ExpandableText/ExpandableText", () => ({
  ExpandableText: ({ text, className }: ExpandableTextMockProps) => (
    <p data-testid="expandable-text" className={className}>
      {text}
    </p>
  ),
}));

interface ExperienceActivityItemMockProps {
  readonly activity: Activity;
}

// O path precisa bater com o import no ExperiencePanel.
vi.mock("../../components/Experience/ExperienceActivityItem", () => ({
  ExperienceActivityItem: ({ activity }: ExperienceActivityItemMockProps) => {
    activityItemSpy(activity);
    return <li data-testid="activity-item">{activity.title}</li>;
  },
}));

describe("ExperiencePanel", () => {
  beforeEach(() => {
    activityItemSpy.mockClear();
  });

  it("renders main experience info and logo image", () => {
    const experience: ExperienceItem = {
      id: "1",
      logo: "/logo.png",
      company: "Acme",
      title: "SysAdmin",
      period: "2020 - 2022",
      description: "Fiz várias coisas.",
      extraActivities: "Atividades extras:",
      activities: [],
    };

    render(<ExperiencePanel experience={experience} />);

    expect(
      screen.getByRole("heading", { name: "SysAdmin" })
    ).toBeInTheDocument();

    expect(screen.getByText("Acme | 2020 - 2022")).toBeInTheDocument();

    expect(screen.getByTestId("expandable-text")).toHaveTextContent(
      "Fiz várias coisas."
    );

    expect(screen.getByAltText("Acme logo")).toBeInTheDocument();
  });

  it("renders extra activities and list items when activities exist", () => {
    const experience: ExperienceItem = {
      id: "2",
      logo: "/x.png",
      company: "Beta",
      title: "Dev",
      period: "2023",
      description: "Descrição aqui.",
      extraActivities: "Principais atividades:",
      activities: [
        { title: "Atividade 1", description: "Desc 1", links: [] },
        { title: "Atividade 2", description: "Desc 2" },
      ],
    };

    render(<ExperiencePanel experience={experience} />);

    expect(screen.getByText("Principais atividades:")).toBeInTheDocument();

    expect(screen.getByRole("list")).toBeInTheDocument();

    const items = screen.getAllByTestId("activity-item");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Atividade 1");
    expect(items[1]).toHaveTextContent("Atividade 2");

    expect(activityItemSpy).toHaveBeenCalledTimes(2);
  });

  it("does NOT render activities section when activities is empty", () => {
    const experience: ExperienceItem = {
      id: "3",
      logo: "/z.png",
      company: "Gamma",
      title: "Analista",
      period: "2019",
      description: "Sem atividades extras.",
      extraActivities: "Não deveria aparecer",
      activities: [],
    };

    render(<ExperiencePanel experience={experience} />);

    expect(
      screen.queryByText("Não deveria aparecer")
    ).not.toBeInTheDocument();

    expect(screen.queryByTestId("activity-item")).not.toBeInTheDocument();
    expect(activityItemSpy).not.toHaveBeenCalled();
  });
});
