import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Locator, Page, TestInfo } from "@playwright/test";
import type { Result } from "axe-core";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

function formatAxeViolations(violations: Result[]): string {
  return violations
    .map((violation) => {
      const nodesSummary = violation.nodes
        .map((node) => {
          const selectors = node.target.join(" > ");
          const summary = node.failureSummary ?? "Sem sugestão adicional.";
          return `  - Seletor: ${selectors}\n    Sugestão: ${summary.replaceAll("\n", " ")}`;
        })
        .join("\n");

      return [
        `Regra: ${violation.id} (impacto: ${violation.impact ?? "não informado"})`,
        `Descrição: ${violation.description}`,
        `Ajuda: ${violation.help} (${violation.helpUrl})`,
        `Elementos afetados:\n${nodesSummary}`,
      ].join("\n");
    })
    .join("\n\n");
}

async function runAxeAudit(page: Page, testInfo: TestInfo, label: string) {
  const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

  if (results.incomplete.length > 0) {
    await testInfo.attach(`axe-incomplete-${label}`, {
      body: formatAxeViolations(results.incomplete),
      contentType: "text/plain",
    });
  }

  if (results.violations.length > 0) {
    const formatted = formatAxeViolations(results.violations);
    await testInfo.attach(`axe-violations-${label}`, {
      body: formatted,
      contentType: "text/plain",
    });
    throw new Error(
      `Violações axe-core encontradas em "${label}":\n\n${formatted}`,
    );
  }
}

async function expectElementNotObscuredByHeader(
  page: Page,
  target: Locator,
): Promise<void> {
  const header = page.getByRole("banner");
  const headerBox = await header.boundingBox();
  const targetBox = await target.boundingBox();

  expect(headerBox).not.toBeNull();
  expect(targetBox).not.toBeNull();

  if (headerBox && targetBox) {
    // Garante que o controle focado não está totalmente encoberto atrás do cabeçalho sticky
    const visibleHeightBelowHeader =
      targetBox.y + targetBox.height - (headerBox.y + headerBox.height);
    const isBelowOrOutsideHeaderOverlap =
      targetBox.y >= headerBox.y + headerBox.height ||
      visibleHeightBelowHeader > 0;
    expect(isBelowOrOutsideHeaderOverlap).toBe(true);
  }
}

test.describe("Auditoria E2E de Acessibilidade (Playwright + axe-core)", () => {
  test("Cenário A — Página inicial em português sem violações WCAG", async ({
    page,
  }, testInfo) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { level: 1, name: "Davi Prudente Ferreira" }),
    ).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "pt");
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "EN — Switch to English" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Copiar email: Email:/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Copiar telefone: Telefone:/i }),
    ).toBeVisible();

    await runAxeAudit(page, testInfo, "home-pt");
  });

  test("Cenário B — Alternância para inglês atualiza idioma do documento, conteúdo e passa no axe-core", async ({
    page,
  }, testInfo) => {
    await page.goto("/");

    const switcher = page.getByRole("button", { name: "EN — Switch to English" });
    await switcher.click();

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(
      page.getByRole("heading", { level: 2, name: "Experiences" }),
    ).toBeVisible();
    await expect(
      page.getByRole("img", { name: "Profile photo" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "PT — Mudar para Português" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Copy email: Email:/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Copy phone: Phone:/i }),
    ).toBeVisible();

    await runAxeAudit(page, testInfo, "home-en");
  });

  test("Cenário C — SkillModal aberto via interação real passa no axe-core e mantém fundo fora da interação", async ({
    page,
  }, testInfo) => {
    await page.goto("/");

    const skillTrigger = page.getByRole("button", {
      name: "Abrir detalhes da skill React",
    });
    await skillTrigger.click();

    const dialog = page.getByRole("dialog", { name: "React" });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");

    const closeButton = dialog.getByRole("button", { name: "Fechar modal" });
    await expect(closeButton).toBeFocused();

    // Com <dialog>.showModal() nativo ativo, Tab não alcança controles externos da página
    await page.keyboard.press("Tab");
    const focusedInsideBackground = await page.evaluate(() => {
      const dialogEl = document.querySelector("dialog[open]");
      const activeEl = document.activeElement;
      return Boolean(
        activeEl &&
          activeEl !== document.body &&
          activeEl !== document.documentElement &&
          dialogEl &&
          !dialogEl.contains(activeEl),
      );
    });
    expect(focusedInsideBackground).toBe(false);

    await runAxeAudit(page, testInfo, "skill-modal-open");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(skillTrigger).toBeFocused();
  });

  test("Cenário D — Todas as quatro abas de ExperienceTabs passam no axe-core com painel sincronizado", async ({
    page,
  }, testInfo) => {
    await page.goto("/");

    const tablist = page.getByRole("tablist", { name: "Experiências" });
    await expect(tablist).toHaveAttribute("aria-orientation", "horizontal");

    const tabs = tablist.getByRole("tab");
    await expect(tabs).toHaveCount(4);

    for (let index = 0; index < 4; index += 1) {
      const tab = tabs.nth(index);
      await tab.click();

      await expect(tab).toHaveAttribute("aria-selected", "true");
      await expect(tab).toHaveAttribute("tabindex", "0");

      const tabId = await tab.getAttribute("id");
      const panelId = await tab.getAttribute("aria-controls");
      expect(tabId).toBeTruthy();
      expect(panelId).toBeTruthy();

      const visiblePanels = page.getByRole("tabpanel");
      await expect(visiblePanels).toHaveCount(1);
      await expect(visiblePanels.first()).toHaveAttribute("id", panelId!);
      await expect(visiblePanels.first()).toHaveAttribute(
        "aria-labelledby",
        tabId!,
      );

      const allPanels = page.locator('[role="tabpanel"]');
      await expect(allPanels).toHaveCount(4);
      for (let panelIndex = 0; panelIndex < 4; panelIndex += 1) {
        const currentPanel = allPanels.nth(panelIndex);
        if (panelIndex === index) {
          await expect(currentPanel).toBeVisible();
        } else {
          await expect(currentPanel).toBeHidden();
          await expect(currentPanel).toHaveAttribute("hidden", "");
        }
      }

      await runAxeAudit(page, testInfo, `experience-tab-${index}`);
    }
  });

  test.describe("Cenário E — Auditoria responsiva Mobile e Desktop", () => {
    for (const viewport of [
      { name: "mobile", width: 375, height: 812 },
      { name: "desktop", width: 1280, height: 800 },
    ]) {
      test(`página inicial sem violações em viewport ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
        page,
      }, testInfo) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
        await page.goto("/");

        const switcher = page.getByRole("button", {
          name: "EN — Switch to English",
        });
        await expect(switcher).toBeVisible();

        const tablist = page.getByRole("tablist", { name: "Experiências" });
        await expect(tablist.getByRole("tab")).toHaveCount(4);

        const skillButton = page.getByRole("button", {
          name: "Abrir detalhes da skill React",
        });
        await expect(skillButton).toBeVisible();

        await runAxeAudit(page, testInfo, `viewport-${viewport.name}`);
      });
    }
  });

  test("Cenário F — Navegação por teclado, indicador de foco visível e interação com cabeçalho fixo", async ({
    page,
  }) => {
    await page.goto("/");

    // 1. Tab inicial chega no LanguageSwitcher com foco visível e acionamento por Enter
    const switcher = page.getByRole("banner").getByRole("button");
    await expect(switcher).toHaveAccessibleName("EN — Switch to English");
    await page.keyboard.press("Tab");
    await expect(switcher).toBeFocused();

    const switcherFocusRing = await switcher.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        outlineStyle: style.outlineStyle,
        boxShadow: style.boxShadow,
      };
    });
    expect(
      switcherFocusRing.outlineStyle !== "none" ||
        switcherFocusRing.boxShadow !== "none",
    ).toBe(true);

    await page.keyboard.press("Enter");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(switcher).toHaveAccessibleName("PT — Mudar para Português");
    await expect(switcher).toBeFocused();
    await page.keyboard.press(" ");
    await expect(page.locator("html")).toHaveAttribute("lang", "pt");
    await expect(switcher).toHaveAccessibleName("EN — Switch to English");
    await expect(switcher).toBeFocused();

    // 2. Navegação completa por teclado em ExperienceTabs (ArrowRight, End, Home, ArrowLeft, Tab)
    const tablist = page.getByRole("tablist", { name: "Experiências" });
    const tabs = tablist.getByRole("tab");
    await tabs.nth(0).focus();
    await expect(tabs.nth(0)).toBeFocused();
    await expectElementNotObscuredByHeader(page, tabs.nth(0));

    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toBeFocused();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("End");
    await expect(tabs.nth(3)).toBeFocused();
    await expect(tabs.nth(3)).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("Home");
    await expect(tabs.nth(0)).toBeFocused();
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("ArrowLeft");
    await expect(tabs.nth(3)).toBeFocused();
    await expect(tabs.nth(3)).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("Tab");
    await expect(page.getByRole("tabpanel")).toBeFocused();

    // 3. Abertura e fechamento do SkillModal inteiramente via teclado
    const reactSkill = page.getByRole("button", {
      name: "Abrir detalhes da skill React",
    });
    await reactSkill.focus();
    await expect(reactSkill).toBeFocused();
    await expectElementNotObscuredByHeader(page, reactSkill);

    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog", { name: "React" });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: "Fechar modal" }),
    ).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(reactSkill).toBeFocused();
  });
});
