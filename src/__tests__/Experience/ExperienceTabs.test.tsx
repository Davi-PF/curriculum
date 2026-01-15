import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { ExperienceTabs } from "../../components/Experience/ExperienceTabs";
import { ExperienceItem } from "../../types/ExperienceRelated/ExperienceItem";


describe("ExperienceTabs", () => {
  const experiences: ExperienceItem[] = [
    {
      id: "1",
      company: "Acme",
      logo: "/acme.png",
      title: "Dev",
      period: "2020",
      description: "Desc",
      extraActivities: "Atividades",
      activities: [],
    },
    {
      id: "2",
      company: "Beta",
      logo: "/beta.png",
      title: "DevOps",
      period: "2021",
      description: "Desc",
      extraActivities: "Atividades",
      activities: [],
    },
    {
      id: "3",
      company: "Gamma",
      logo: "/gamma.png",
      title: "SRE",
      period: "2022",
      description: "Desc",
      extraActivities: "Atividades",
      activities: [],
    },
  ];

  it("renders one tab button per experience", () => {
    render(
      <ExperienceTabs
        experiences={experiences}
        activeTab={0}
        onChange={vi.fn()}
      />
    );

    expect(screen.getAllByRole("button")).toHaveLength(experiences.length);

    // garante que os logos (e consequentemente as tabs) existem
    experiences.forEach((exp) => {
      expect(screen.getByAltText(`${exp.company} logo`)).toBeInTheDocument();
    });
  });

  it("calls onChange with the correct index when a tab is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(index: number) => void>();

    render(
      <ExperienceTabs experiences={experiences} activeTab={0} onChange={onChange} />
    );

    const betaButton = screen.getByAltText("Beta logo").closest("button");
    expect(betaButton).not.toBeNull();

    await user.click(betaButton!);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("applies active styling to the active tab and inactive styling to others", () => {
    render(
      <ExperienceTabs
        experiences={experiences}
        activeTab={2}
        onChange={vi.fn()}
      />
    );

    const activeButton = screen.getByAltText("Gamma logo").closest("button");
    const inactiveButton = screen.getByAltText("Acme logo").closest("button");

    expect(activeButton).not.toBeNull();
    expect(inactiveButton).not.toBeNull();

    // assinatura da classe ativa
    expect(activeButton!.className).toContain("text-emerald-400");
    expect(activeButton!.className).toContain("border-emerald-400");

    // assinatura da classe inativa
    expect(inactiveButton!.className).toContain("text-stone-400");
    expect(inactiveButton!.className).toContain("hover:text-gray-200");
  });
});
