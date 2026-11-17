import React, { useId, useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import Experience from "../../components/Experience/Experience";
import { ExperiencePanel } from "../../components/Experience/ExperiencePanel";
import { ExperienceTabs } from "../../components/Experience/ExperienceTabs";
import { LanguageProvider, useLanguage } from "../../contexts/LanguageContext";
import { ExperienceItem } from "../../types/ExperienceRelated/ExperienceItem";

interface ControlledExperienceHarnessProps {
  readonly experiences: ExperienceItem[];
  readonly initialTab?: number;
  readonly ariaLabel?: string;
}

function ControlledExperienceHarness({
  experiences,
  initialTab = 0,
  ariaLabel = "Experiências profissionais",
}: ControlledExperienceHarnessProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const baseId = useId();

  return (
    <LanguageProvider>
      <div>
        <button type="button">Antes das abas</button>
        <ExperienceTabs
          experiences={experiences}
          activeTab={activeTab}
          onChange={setActiveTab}
          tabsId={baseId}
          ariaLabel={ariaLabel}
        />
        {experiences.map((exp, index) => {
          const panelId = `${baseId}-panel-${index}`;
          const tabId = `${baseId}-tab-${index}`;

          return index === activeTab ? (
            <ExperiencePanel
              key={index}
              experience={exp}
              id={panelId}
              labelledBy={tabId}
            />
          ) : (
            <div
              key={index}
              role="tabpanel"
              id={panelId}
              aria-labelledby={tabId}
              hidden
            />
          );
        })}
        <button type="button">Depois do painel</button>
      </div>
    </LanguageProvider>
  );
}

function expectAllTabPanelRelationships(
  tabs: HTMLElement[],
  activeIndex: number,
  container: HTMLElement = document.body,
) {
  const allDomPanels = Array.from(
    container.querySelectorAll('[role="tabpanel"]'),
  );
  expect(allDomPanels).toHaveLength(tabs.length);

  const visiblePanels = screen.getAllByRole("tabpanel");
  expect(visiblePanels).toHaveLength(1);

  const tabIds = tabs.map((tab) => tab.getAttribute("id"));
  const controlledIds = tabs.map((tab) => tab.getAttribute("aria-controls"));
  const panelIds = allDomPanels.map((panel) => panel.getAttribute("id"));

  expect(new Set(tabIds).size).toBe(tabs.length);
  expect(new Set(controlledIds).size).toBe(tabs.length);
  expect(new Set(panelIds).size).toBe(tabs.length);

  tabs.forEach((tab, index) => {
    const tabId = tab.getAttribute("id");
    const panelId = tab.getAttribute("aria-controls");
    expect(tabId).toBeTruthy();
    expect(panelId).toBeTruthy();

    const matchedPanel = container.ownerDocument.getElementById(panelId!);
    expect(matchedPanel).not.toBeNull();
    expect(matchedPanel).toHaveAttribute("role", "tabpanel");
    expect(matchedPanel).toHaveAttribute("aria-labelledby", tabId!);

    if (index === activeIndex) {
      expect(tab).toHaveAttribute("aria-selected", "true");
      expect(tab).toHaveAttribute("tabindex", "0");
      expect(matchedPanel).not.toHaveAttribute("hidden");
      expect(matchedPanel).toHaveAttribute("tabindex", "0");
      expect(matchedPanel).toBe(visiblePanels[0]);
    } else {
      expect(tab).toHaveAttribute("aria-selected", "false");
      expect(tab).toHaveAttribute("tabindex", "-1");
      expect(matchedPanel).toHaveAttribute("hidden");
      expect(matchedPanel).not.toHaveAttribute("tabindex");
      expect(matchedPanel).toBeEmptyDOMElement();
    }
  });
}

function LanguageAwareExperienceHarness() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div>
      <button type="button" onClick={toggleLanguage}>
        Alternar idioma ({language})
      </button>
      <Experience />
    </div>
  );
}

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

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(experiences.length);
    tabs.forEach((tab) => {
      expect(tab.tagName).toBe("BUTTON");
      expect(tab).toHaveAttribute("type", "button");
    });

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

  describe("WAI-ARIA semantics and relationships", () => {
    it("exposes tablist, tabs, all DOM tabpanels, unique IDs, roving tabIndex, and bidirectional aria relationships", () => {
      render(
        <ControlledExperienceHarness experiences={experiences} initialTab={1} />,
      );

      const tablist = screen.getByRole("tablist", {
        name: "Experiências profissionais",
      });
      expect(tablist).toHaveAttribute("aria-orientation", "horizontal");

      const tabs = screen.getAllByRole("tab");
      expect(tabs).toHaveLength(3);

      expectAllTabPanelRelationships(tabs, 1);

      expect(
        screen.getByRole("heading", { name: "DevOps" }),
      ).toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "Dev" })).not.toBeInTheDocument();
      expect(screen.queryByRole("heading", { name: "SRE" })).not.toBeInTheDocument();
    });

    it("generates distinct non-colliding IDs across multiple instances", () => {
      render(
        <div>
          <ControlledExperienceHarness
            experiences={experiences.slice(0, 2)}
            ariaLabel="Instância 1"
          />
          <ControlledExperienceHarness
            experiences={experiences.slice(0, 2)}
            ariaLabel="Instância 2"
          />
        </div>,
      );

      const allTabs = screen.getAllByRole("tab");
      const allIds = allTabs.map((tab) => tab.getAttribute("id"));
      const allControls = allTabs.map((tab) => tab.getAttribute("aria-controls"));
      const allPanels = screen.getAllByRole("tabpanel", { hidden: true });
      const allPanelIds = allPanels.map((panel) => panel.getAttribute("id"));

      expect(allPanels).toHaveLength(allTabs.length);
      expect(new Set(allIds).size).toBe(allTabs.length);
      expect(new Set(allControls).size).toBe(allTabs.length);
      expect(new Set(allPanelIds).size).toBe(allTabs.length);
    });
  });

  describe("Keyboard navigation with automatic activation", () => {
    it("navigates circularly with ArrowRight and ArrowLeft updating selection, focus, tabIndex, and panels", async () => {
      const user = userEvent.setup();

      render(<ControlledExperienceHarness experiences={experiences} />);

      const tabs = screen.getAllByRole("tab");
      tabs[0].focus();
      expect(document.activeElement).toBe(tabs[0]);
      expectAllTabPanelRelationships(tabs, 0);

      // 0 -> 1 via ArrowRight
      await user.keyboard("{ArrowRight}");
      expect(document.activeElement).toBe(tabs[1]);
      expectAllTabPanelRelationships(tabs, 1);
      expect(screen.getByRole("heading", { name: "DevOps" })).toBeInTheDocument();

      // 1 -> 2 via ArrowRight
      await user.keyboard("{ArrowRight}");
      expect(document.activeElement).toBe(tabs[2]);
      expectAllTabPanelRelationships(tabs, 2);
      expect(screen.getByRole("heading", { name: "SRE" })).toBeInTheDocument();

      // Última (2) -> Primeira (0) via ArrowRight circular
      await user.keyboard("{ArrowRight}");
      expect(document.activeElement).toBe(tabs[0]);
      expectAllTabPanelRelationships(tabs, 0);
      expect(screen.getByRole("heading", { name: "Dev" })).toBeInTheDocument();

      // Primeira (0) -> Última (2) via ArrowLeft circular
      await user.keyboard("{ArrowLeft}");
      expect(document.activeElement).toBe(tabs[2]);
      expectAllTabPanelRelationships(tabs, 2);
      expect(screen.getByRole("heading", { name: "SRE" })).toBeInTheDocument();

      // 2 -> 1 via ArrowLeft
      await user.keyboard("{ArrowLeft}");
      expect(document.activeElement).toBe(tabs[1]);
      expectAllTabPanelRelationships(tabs, 1);
      expect(screen.getByRole("heading", { name: "DevOps" })).toBeInTheDocument();
    });

    it("supports Home and End keys to jump to the first and last tab regardless of tab count", async () => {
      const user = userEvent.setup();
      const fourExperiences: ExperienceItem[] = [
        ...experiences,
        {
          id: "4",
          company: "Delta",
          logo: "/delta.png",
          title: "Principal",
          period: "2024",
          description: "Desc 4",
          activities: [],
        },
      ];

      render(
        <ControlledExperienceHarness
          experiences={fourExperiences}
          initialTab={1}
        />,
      );

      const tabs = screen.getAllByRole("tab");
      tabs[1].focus();
      expectAllTabPanelRelationships(tabs, 1);

      await user.keyboard("{End}");
      expect(document.activeElement).toBe(tabs[3]);
      expectAllTabPanelRelationships(tabs, 3);
      expect(
        screen.getByRole("heading", { name: "Principal" }),
      ).toBeInTheDocument();

      await user.keyboard("{Home}");
      expect(document.activeElement).toBe(tabs[0]);
      expectAllTabPanelRelationships(tabs, 0);
      expect(screen.getByRole("heading", { name: "Dev" })).toBeInTheDocument();
    });

    it("calls preventDefault only for tab navigation keys and ignores unrelated keys", () => {
      const onChange = vi.fn();

      render(
        <ExperienceTabs
          experiences={experiences}
          activeTab={1}
          onChange={onChange}
        />,
      );

      const tabs = screen.getAllByRole("tab");
      tabs[1].focus();

      const navEvent = new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
        cancelable: true,
      });
      const navNotCancelled = tabs[1].dispatchEvent(navEvent);
      expect(navNotCancelled).toBe(false);
      expect(navEvent.defaultPrevented).toBe(true);
      expect(onChange).toHaveBeenCalledWith(2);

      onChange.mockClear();
      fireEvent.keyDown(tabs[1], { key: "ArrowDown" });
      expect(onChange).not.toHaveBeenCalled();

      const nonNavEvent = new KeyboardEvent("keydown", {
        key: "ArrowDown",
        bubbles: true,
        cancelable: true,
      });
      const nonNavNotCancelled = tabs[1].dispatchEvent(nonNavEvent);
      expect(nonNavNotCancelled).toBe(true);
      expect(nonNavEvent.defaultPrevented).toBe(false);
    });
  });

  describe("Tab sequence navigation", () => {
    it("allows Tab and Shift+Tab to enter only the active tab, move to active tabpanel, and leave naturally", async () => {
      const user = userEvent.setup();

      render(
        <ControlledExperienceHarness experiences={experiences} initialTab={1} />,
      );

      const beforeButton = screen.getByRole("button", {
        name: "Antes das abas",
      });
      const afterButton = screen.getByRole("button", {
        name: "Depois do painel",
      });
      const tabs = screen.getAllByRole("tab");
      const activePanel = screen.getByRole("tabpanel");

      beforeButton.focus();
      expect(document.activeElement).toBe(beforeButton);

      await user.tab();
      expect(document.activeElement).toBe(tabs[1]);

      // Tab sai do tablist sem parar na aba[2] (tabIndex=-1) e alcança o tabpanel ativo (tabIndex=0)
      await user.tab();
      expect(document.activeElement).toBe(activePanel);

      await user.tab();
      expect(document.activeElement).toBe(afterButton);

      // Shift+Tab retorna pelo tabpanel ativo e vai direto para a aba ativa
      await user.tab({ shift: true });
      expect(document.activeElement).toBe(activePanel);

      await user.tab({ shift: true });
      expect(document.activeElement).toBe(tabs[1]);

      // Shift+Tab sai do tablist sem parar na aba[0] (tabIndex=-1)
      await user.tab({ shift: true });
      expect(document.activeElement).toBe(beforeButton);
    });
  });

  describe("Integration, i18n, and responsive viewports", () => {
    it("integrates ExperienceHeader, ExperienceTabs, and ExperiencePanel across PT/EN switching", async () => {
      const user = userEvent.setup();

      render(
        <LanguageProvider>
          <LanguageAwareExperienceHarness />
        </LanguageProvider>,
      );

      const tablistPt = screen.getByRole("tablist", { name: "Experiências" });
      expect(tablistPt).toHaveAttribute("aria-orientation", "horizontal");

      const tabsPt = screen.getAllByRole("tab");
      expect(tabsPt).toHaveLength(4);
      expectAllTabPanelRelationships(tabsPt, 0);

      // Navega até a terceira aba ("Dinamio Tecnologia") via teclado
      tabsPt[0].focus();
      await user.keyboard("{ArrowRight}{ArrowRight}");
      expect(document.activeElement).toBe(tabsPt[2]);
      expectAllTabPanelRelationships(tabsPt, 2);
      expect(
        screen.getByText(/Dinamio Tecnologia \|/),
      ).toBeInTheDocument();

      // Alterna para inglês e confirma paridade de tablist, seleção e relacionamentos
      await user.click(screen.getByRole("button", { name: /Alternar idioma/i }));

      const tablistEn = screen.getByRole("tablist", { name: "Experiences" });
      expect(tablistEn).toBe(tablistPt);

      const tabsEn = screen.getAllByRole("tab");
      expectAllTabPanelRelationships(tabsEn, 2);
      expect(screen.getByRole("tab", { name: "Developed Projects" })).toBeInTheDocument();
    });

    it("preserves focus, selection, and ARIA relationships on the 4th tab when switching from PT to EN", async () => {
      const user = userEvent.setup();

      render(
        <LanguageProvider>
          <LanguageAwareExperienceHarness />
        </LanguageProvider>,
      );

      const tabsPt = screen.getAllByRole("tab");
      expect(tabsPt).toHaveLength(4);

      tabsPt[0].focus();
      await user.keyboard("{End}");

      const fourthTabPt = screen.getByRole("tab", {
        name: "Projetos Desenvolvidos",
      });
      expect(document.activeElement).toBe(fourthTabPt);
      expectAllTabPanelRelationships(tabsPt, 3);
      expect(
        screen.getByRole("heading", { name: "Desenvolvedor Full-Stack" }),
      ).toBeInTheDocument();

      // Aciona troca de idioma sem alterar o foco do usuário para comprovar não desmontagem da 4ª aba
      fireEvent.click(
        screen.getByRole("button", { name: /Alternar idioma/i }),
      );

      const tabsEn = screen.getAllByRole("tab");
      const fourthTabEn = screen.getByRole("tab", {
        name: "Developed Projects",
      });

      expect(fourthTabEn).toBe(fourthTabPt);
      expect(document.activeElement).toBe(fourthTabEn);
      expectAllTabPanelRelationships(tabsEn, 3);
      expect(
        screen.getByRole("heading", { name: "Full-Stack Developer" }),
      ).toBeInTheDocument();
    });

    it.each([
      { label: "mobile", width: 375 },
      { label: "desktop", width: 1280 },
    ])(
      "preserves accessible names, click selection, and keyboard navigation on $label viewport ($width px)",
      async ({ width }) => {
        const user = userEvent.setup();
        const originalWidth = window.innerWidth;

        Object.defineProperty(window, "innerWidth", {
          configurable: true,
          writable: true,
          value: width,
        });

        try {
          render(<ControlledExperienceHarness experiences={experiences} />);

          const tablist = screen.getByRole("tablist", {
            name: "Experiências profissionais",
          });
          expect(tablist.className).toContain("overflow-x-auto");
          expect(tablist.className).toContain("sm:overflow-visible");

          const acmeTab = screen.getByRole("tab", { name: "Acme" });
          const betaTab = screen.getByRole("tab", { name: "Beta" });
          const gammaTab = screen.getByRole("tab", { name: "Gamma" });

          // Rótulo visual usa classes responsivas mantendo aria-label acessível em ambos os viewports
          expect(acmeTab.querySelector("span")?.className).toContain("hidden");
          expect(acmeTab.querySelector("span")?.className).toContain("sm:inline");

          await user.click(betaTab);
          expect(betaTab).toHaveAttribute("aria-selected", "true");
          expect(
            screen.getByRole("heading", { name: "DevOps" }),
          ).toBeInTheDocument();

          betaTab.focus();
          await user.keyboard("{End}");
          expect(document.activeElement).toBe(gammaTab);
          expect(gammaTab).toHaveAttribute("aria-selected", "true");
          expect(
            screen.getByRole("heading", { name: "SRE" }),
          ).toBeInTheDocument();
        } finally {
          Object.defineProperty(window, "innerWidth", {
            configurable: true,
            writable: true,
            value: originalWidth,
          });
        }
      },
    );
  });
});
