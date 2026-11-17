import { StrictMode, useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SkillModal } from "../../components/Skills/SkillModal";
import { Skill } from "@/src/types/skill";
import { LanguageProvider, useLanguage } from "../../contexts/LanguageContext";
import { renderWithLanguage } from "../test-utils";
import { flushPendingDialogCloseEvents } from "../../../vitest.setup";

function SkillModalWithToggle({
  skill,
  onClose,
}: {
  readonly skill: Skill;
  readonly onClose: () => void;
}) {
  const { toggleLanguage } = useLanguage();

  return (
    <>
      <button type="button" onClick={toggleLanguage}>
        toggle
      </button>
      <SkillModal
        skill={skill}
        isOpen={true}
        isClosing={false}
        onClose={onClose}
      />
    </>
  );
}

function ModalLifecycleHarness({
  skill,
  includeToggle = false,
  onCloseSpy,
}: {
  readonly skill: Skill;
  readonly includeToggle?: boolean;
  readonly onCloseSpy?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);
  const { toggleLanguage } = useLanguage();

  const handleOpen = () => {
    setActiveSkill(skill);
    setIsClosing(false);
    setIsOpen(true);
  };

  const handleRequestClose = () => {
    onCloseSpy?.();
    setIsOpen(false);
    setIsClosing(true);
  };

  const handleFinishClose = () => {
    setIsClosing(false);
    setActiveSkill(null);
  };

  return (
    <div>
      <button type="button" onClick={handleOpen}>
        Abrir skill
      </button>
      {includeToggle && (
        <button type="button" onClick={toggleLanguage}>
          toggle
        </button>
      )}
      <button type="button" onClick={handleFinishClose}>
        Finalizar fechamento
      </button>
      <SkillModal
        skill={activeSkill}
        isOpen={isOpen}
        isClosing={isClosing}
        onClose={handleRequestClose}
      />
    </div>
  );
}

describe("SkillModal", () => {
  const mockSkill: Skill = {
    id: "react",
    label: "React",
    description: "Biblioteca para interfaces",
  };

  it("não renderiza nada quando skill é null", () => {
    const { container } = renderWithLanguage(
      <SkillModal
        skill={null}
        isOpen={false}
        isClosing={false}
        onClose={vi.fn()}
      />,
    );

    expect(container.firstChild).toBeNull();
    expect(document.querySelector("dialog")).toBeNull();
  });

  it("abre o modal por meio de showModal() e exibe título, descrição e semântica ARIA", () => {
    const showModalSpy = vi.spyOn(HTMLDialogElement.prototype, "showModal");

    renderWithLanguage(
      <SkillModal
        skill={mockSkill}
        isOpen={true}
        isClosing={false}
        onClose={vi.fn()}
      />,
    );

    expect(showModalSpy).toHaveBeenCalledTimes(1);

    const dialog = screen.getByRole("dialog", { name: "React" });
    expect(dialog).toHaveAttribute("open");
    expect(dialog).toHaveAttribute("aria-modal", "true");

    const heading = screen.getByRole("heading", { name: "React" });
    const description = screen.getByText("Biblioteca para interfaces");

    expect(dialog).toHaveAttribute("aria-labelledby", heading.id);
    expect(dialog).toHaveAttribute("aria-describedby", description.id);
    expect(dialog).toHaveAccessibleDescription("Biblioteca para interfaces");
  });

  it("mantém apenas um botão acessível de fechamento", () => {
    renderWithLanguage(
      <SkillModal
        skill={mockSkill}
        isOpen={true}
        isClosing={false}
        onClose={vi.fn()}
      />,
    );

    const closeButtons = screen.getAllByRole("button", {
      name: /fechar modal/i,
    });
    expect(closeButtons).toHaveLength(1);
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("direciona o foco inicial para o botão de fechamento ao abrir", () => {
    renderWithLanguage(<ModalLifecycleHarness skill={mockSkill} />);

    const trigger = screen.getByRole("button", { name: "Abrir skill" });
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    fireEvent.click(trigger);

    const closeButton = screen.getByRole("button", { name: "Fechar modal" });
    expect(document.activeElement).toBe(closeButton);
  });

  it("fecha via close(), preserva estado durante isClosing e restaura foco ao acionador somente após conclusão", () => {
    const closeSpy = vi.spyOn(HTMLDialogElement.prototype, "close");

    renderWithLanguage(<ModalLifecycleHarness skill={mockSkill} />);

    const trigger = screen.getByRole("button", { name: "Abrir skill" });
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog") as HTMLDialogElement;
    const closeButton = screen.getByRole("button", { name: "Fechar modal" });
    expect(document.activeElement).toBe(closeButton);

    fireEvent.click(closeButton);

    // Durante isClosing (animação de 200ms), o dialog permanece no top layer e o foco não retorna prematuramente
    expect(closeSpy).not.toHaveBeenCalled();
    expect(dialog.open).toBe(true);
    expect(dialog.className).toContain("opacity-0");
    expect(dialog.className).toContain("scale-95");
    expect(dialog.className).toContain("backdrop:opacity-0");
    expect(dialog.className).toContain("pointer-events-none");
    expect(document.activeElement).not.toBe(trigger);

    // Ao encerrar a transição, close() é chamado e o foco retorna ao acionador
    fireEvent.click(
      screen.getByRole("button", { name: "Finalizar fechamento" }),
    );

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(document.querySelector("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("fecha via close() quando props mudam diretamente para isOpen=false e isClosing=false", () => {
    const closeSpy = vi.spyOn(HTMLDialogElement.prototype, "close");

    const onClose = vi.fn();
    const { rerender } = renderWithLanguage(
      <div>
        <button type="button">Acionador</button>
        <SkillModal
          skill={mockSkill}
          isOpen={false}
          isClosing={false}
          onClose={onClose}
        />
      </div>,
    );

    const trigger = screen.getByRole("button", { name: "Acionador" });
    trigger.focus();

    rerender(
      <LanguageProvider>
        <div>
          <button type="button">Acionador</button>
          <SkillModal
            skill={mockSkill}
            isOpen={true}
            isClosing={false}
            onClose={onClose}
          />
        </div>
      </LanguageProvider>,
    );

    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Fechar modal" }),
    );

    rerender(
      <LanguageProvider>
        <div>
          <button type="button">Acionador</button>
          <SkillModal
            skill={mockSkill}
            isOpen={false}
            isClosing={false}
            onClose={onClose}
          />
        </div>
      </LanguageProvider>,
    );

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(document.querySelector("dialog")).not.toHaveAttribute("open");
    expect(document.activeElement).toBe(trigger);

    act(() => {
      flushPendingDialogCloseEvents();
    });

    expect(onClose).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(trigger);
  });

  it("não falha ao tentar restaurar foco se o acionador tiver sido desconectado do DOM", () => {
    const closeSpy = vi.spyOn(HTMLDialogElement.prototype, "close");

    const { rerender } = renderWithLanguage(
      <div>
        <button type="button">Acionador temporário</button>
        <SkillModal
          skill={mockSkill}
          isOpen={false}
          isClosing={false}
          onClose={vi.fn()}
        />
      </div>,
    );

    const trigger = screen.getByRole("button", {
      name: "Acionador temporário",
    });
    trigger.focus();

    rerender(
      <LanguageProvider>
        <div>
          <button type="button">Acionador temporário</button>
          <SkillModal
            skill={mockSkill}
            isOpen={true}
            isClosing={false}
            onClose={vi.fn()}
          />
        </div>
      </LanguageProvider>,
    );

    // Desmonta apenas o botão acionador mantendo o SkillModal montado na mesma posição
    rerender(
      <LanguageProvider>
        <div>
          {null}
          <SkillModal
            skill={mockSkill}
            isOpen={true}
            isClosing={false}
            onClose={vi.fn()}
          />
        </div>
      </LanguageProvider>,
    );
    expect(trigger.isConnected).toBe(false);

    rerender(
      <LanguageProvider>
        <div>
          {null}
          <SkillModal
            skill={mockSkill}
            isOpen={false}
            isClosing={false}
            onClose={vi.fn()}
          />
        </div>
      </LanguageProvider>,
    );

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(document.activeElement).not.toBe(trigger);
  });

  it("fecha ao receber evento cancel (tecla Escape) com preventDefault e sem duplicidade", () => {
    const onClose = vi.fn();

    renderWithLanguage(
      <SkillModal
        skill={mockSkill}
        isOpen={true}
        isClosing={false}
        onClose={onClose}
      />,
    );

    const dialog = screen.getByRole("dialog");
    const firstCancel = new Event("cancel", { cancelable: true });
    const secondCancel = new Event("cancel", { cancelable: true });

    fireEvent(dialog, firstCancel);
    fireEvent(dialog, secondCancel);
    fireEvent.click(screen.getByRole("button", { name: "Fechar modal" }));

    expect(firstCancel.defaultPrevented).toBe(true);
    expect(secondCancel.defaultPrevented).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("chama onClose apenas ao clicar no backdrop e não ao clicar no conteúdo interno", () => {
    const onClose = vi.fn();

    renderWithLanguage(
      <SkillModal
        skill={mockSkill}
        isOpen={true}
        isClosing={false}
        onClose={onClose}
      />,
    );

    fireEvent.click(screen.getByText("Biblioteca para interfaces"));
    expect(onClose).not.toHaveBeenCalled();

    const dialog = screen.getByRole("dialog");
    fireEvent.click(dialog);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("chama onClose ao clicar no botão de fechar (×) e bloqueia chamadas repetidas durante isClosing", () => {
    const onClose = vi.fn();

    const { rerender } = renderWithLanguage(
      <SkillModal
        skill={mockSkill}
        isOpen={true}
        isClosing={false}
        onClose={onClose}
      />,
    );

    const closeButton = screen.getByRole("button", { name: "Fechar modal" });
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(
      <LanguageProvider>
        <SkillModal
          skill={mockSkill}
          isOpen={false}
          isClosing={true}
          onClose={onClose}
        />
      </LanguageProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Fechar modal" }));
    fireEvent(screen.getByRole("dialog"), new Event("cancel", { cancelable: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("sincroniza onClose exatamente uma vez quando ocorre fechamento externo inesperado assíncrono", () => {
    const onClose = vi.fn();

    const { rerender } = renderWithLanguage(
      <div>
        <button type="button">Acionador externo</button>
        <SkillModal
          skill={mockSkill}
          isOpen={false}
          isClosing={false}
          onClose={onClose}
        />
      </div>,
    );

    const trigger = screen.getByRole("button", { name: "Acionador externo" });
    trigger.focus();

    rerender(
      <LanguageProvider>
        <div>
          <button type="button">Acionador externo</button>
          <SkillModal
            skill={mockSkill}
            isOpen={true}
            isClosing={false}
            onClose={onClose}
          />
        </div>
      </LanguageProvider>,
    );

    const dialog = screen.getByRole("dialog") as HTMLDialogElement;

    // Simula fechamento externo direto no elemento nativo sem passar por onClose do componente
    act(() => {
      dialog.close();
    });
    expect(dialog.open).toBe(false);
    expect(onClose).not.toHaveBeenCalled();

    // Evento assíncrono `close` chega depois que dialog.close() já retornou
    act(() => {
      flushPendingDialogCloseEvents();
    });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(trigger);
  });

  it("aplica estado fechado quando isOpen=false", () => {
    const showModalSpy = vi.spyOn(HTMLDialogElement.prototype, "showModal");

    renderWithLanguage(
      <SkillModal
        skill={mockSkill}
        isOpen={false}
        isClosing={false}
        onClose={vi.fn()}
      />,
    );

    expect(showModalSpy).not.toHaveBeenCalled();

    const dialog = document.querySelector("dialog");
    expect(dialog).toBeTruthy();
    expect(dialog?.hasAttribute("open")).toBe(false);
    expect(dialog?.className).toContain("scale-95");
    expect(dialog?.className).toContain("opacity-0");
    expect(dialog?.className).toContain("backdrop:opacity-0");
  });

  it("aplica classes de transição de saída quando isClosing=true", () => {
    renderWithLanguage(
      <SkillModal
        skill={mockSkill}
        isOpen={true}
        isClosing={true}
        onClose={vi.fn()}
      />,
    );

    const dialog = document.querySelector("dialog");
    expect(dialog).toBeTruthy();
    expect(dialog?.hasAttribute("open")).toBe(false);
    expect(dialog?.className).toContain("scale-95");
    expect(dialog?.className).toContain("opacity-0");
    expect(dialog?.className).toContain("backdrop:opacity-0");
    expect(dialog?.className).toContain("pointer-events-none");
  });

  it("atualiza aria-label do botão de fechamento para inglês ao alternar idioma", () => {
    renderWithLanguage(
      <SkillModalWithToggle skill={mockSkill} onClose={vi.fn()} />,
    );

    expect(
      screen.getAllByRole("button", { name: "Fechar modal" }),
    ).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: "toggle" }));

    expect(
      screen.getAllByRole("button", { name: "Close modal" }),
    ).toHaveLength(1);
    expect(
      screen.queryByRole("button", { name: "Fechar modal" }),
    ).not.toBeInTheDocument();
  });

  it("preserva abertura, fechamento por Escape e retorno de foco após alternância de idioma", () => {
    const showModalSpy = vi.spyOn(HTMLDialogElement.prototype, "showModal");
    const closeSpy = vi.spyOn(HTMLDialogElement.prototype, "close");
    const onCloseSpy = vi.fn();

    renderWithLanguage(
      <ModalLifecycleHarness
        skill={mockSkill}
        includeToggle={true}
        onCloseSpy={onCloseSpy}
      />,
    );

    const trigger = screen.getByRole("button", { name: "Abrir skill" });
    trigger.focus();
    fireEvent.click(trigger);

    expect(showModalSpy).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("button", { name: "Fechar modal" }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "toggle" }));

    // Re-render por idioma não chama showModal() novamente
    expect(showModalSpy).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("button", { name: "Close modal" }),
    ).toBeInTheDocument();

    const dialog = screen.getByRole("dialog");
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    expect(onCloseSpy).toHaveBeenCalledTimes(1);

    fireEvent.click(
      screen.getByRole("button", { name: "Finalizar fechamento" }),
    );
    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(trigger);

    // Reabre em inglês sem regressões
    fireEvent.click(trigger);
    expect(showModalSpy).toHaveBeenCalledTimes(2);
    expect(
      screen.getByRole("button", { name: "Close modal" }),
    ).toBeInTheDocument();
  });

  it("completa ciclo de Escape com dialog montado e não duplica onClose após evento nativo close assíncrono", async () => {
    const closeSpy = vi.spyOn(HTMLDialogElement.prototype, "close");
    const onClose = vi.fn();

    const { rerender } = renderWithLanguage(
      <SkillModal
        skill={mockSkill}
        isOpen={true}
        isClosing={false}
        onClose={onClose}
      />,
    );

    const dialog = screen.getByRole("dialog") as HTMLDialogElement;
    const nativeCloseListener = vi.fn();
    dialog.addEventListener("close", nativeCloseListener);
    const cancelEvent = new Event("cancel", { cancelable: true });
    fireEvent(dialog, cancelEvent);

    expect(cancelEvent.defaultPrevented).toBe(true);
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(
      <LanguageProvider>
        <SkillModal
          skill={mockSkill}
          isOpen={false}
          isClosing={true}
          onClose={onClose}
        />
      </LanguageProvider>,
    );
    expect(closeSpy).not.toHaveBeenCalled();

    rerender(
      <LanguageProvider>
        <SkillModal
          skill={mockSkill}
          isOpen={false}
          isClosing={false}
          onClose={onClose}
        />
      </LanguageProvider>,
    );
    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(dialog.open).toBe(false);

    // Aguarda processamento natural da task agendada com setTimeout(..., 0)
    await act(async () => {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    // Garantir que flush manual posterior não reexecute a mesma tarefa
    act(() => {
      flushPendingDialogCloseEvents();
    });

    expect(nativeCloseListener).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("completa ciclo pelo botão de fechar com dialog montado sem segunda chamada ao processar close assíncrono", async () => {
    const closeSpy = vi.spyOn(HTMLDialogElement.prototype, "close");
    const onClose = vi.fn();

    const { rerender } = renderWithLanguage(
      <SkillModal
        skill={mockSkill}
        isOpen={true}
        isClosing={false}
        onClose={onClose}
      />,
    );

    const dialog = screen.getByRole("dialog") as HTMLDialogElement;
    const nativeCloseListener = vi.fn();
    dialog.addEventListener("close", nativeCloseListener);

    fireEvent.click(screen.getByRole("button", { name: "Fechar modal" }));
    expect(onClose).toHaveBeenCalledTimes(1);

    rerender(
      <LanguageProvider>
        <SkillModal
          skill={mockSkill}
          isOpen={false}
          isClosing={true}
          onClose={onClose}
        />
      </LanguageProvider>,
    );

    rerender(
      <LanguageProvider>
        <SkillModal
          skill={mockSkill}
          isOpen={false}
          isClosing={false}
          onClose={onClose}
        />
      </LanguageProvider>,
    );
    expect(closeSpy).toHaveBeenCalledTimes(1);

    act(() => {
      flushPendingDialogCloseEvents();
    });

    // Aguardar ciclo de macrotask garante que o timeout cancelado não dispara novamente
    await act(async () => {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 0);
      });
    });

    expect(nativeCloseListener).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("fecha o diálogo ao desmontar e ignora evento close pendente sem acionar onClose", () => {
    const closeSpy = vi.spyOn(HTMLDialogElement.prototype, "close");
    const onClose = vi.fn();

    const { unmount } = renderWithLanguage(
      <SkillModal
        skill={mockSkill}
        isOpen={true}
        isClosing={false}
        onClose={onClose}
      />,
    );

    const dialog = screen.getByRole("dialog") as HTMLDialogElement;
    expect(dialog.open).toBe(true);

    unmount();

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(dialog.open).toBe(false);

    act(() => {
      flushPendingDialogCloseEvents();
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("reabre normalmente antes do processamento de close pendente do ciclo anterior e ignora evento obsoleto", () => {
    const showModalSpy = vi.spyOn(HTMLDialogElement.prototype, "showModal");
    const closeSpy = vi.spyOn(HTMLDialogElement.prototype, "close");
    const onClose = vi.fn();

    const { rerender } = renderWithLanguage(
      <div>
        <button type="button">Acionador reabertura</button>
        <SkillModal
          skill={mockSkill}
          isOpen={false}
          isClosing={false}
          onClose={onClose}
        />
      </div>,
    );

    const trigger = screen.getByRole("button", { name: "Acionador reabertura" });
    trigger.focus();

    // Ciclo 1: abre e fecha programaticamente sem ainda processar o `close` assíncrono
    rerender(
      <LanguageProvider>
        <div>
          <button type="button">Acionador reabertura</button>
          <SkillModal
            skill={mockSkill}
            isOpen={true}
            isClosing={false}
            onClose={onClose}
          />
        </div>
      </LanguageProvider>,
    );
    expect(showModalSpy).toHaveBeenCalledTimes(1);

    rerender(
      <LanguageProvider>
        <div>
          <button type="button">Acionador reabertura</button>
          <SkillModal
            skill={mockSkill}
            isOpen={false}
            isClosing={false}
            onClose={onClose}
          />
        </div>
      </LanguageProvider>,
    );
    expect(closeSpy).toHaveBeenCalledTimes(1);

    // Ciclo 2: reabre antes de o evento `close` pendente do Ciclo 1 ser processado
    trigger.focus();
    rerender(
      <LanguageProvider>
        <div>
          <button type="button">Acionador reabertura</button>
          <SkillModal
            skill={mockSkill}
            isOpen={true}
            isClosing={false}
            onClose={onClose}
          />
        </div>
      </LanguageProvider>,
    );
    expect(showModalSpy).toHaveBeenCalledTimes(2);

    const dialog = screen.getByRole("dialog") as HTMLDialogElement;
    const closeButton = screen.getByRole("button", { name: "Fechar modal" });
    expect(dialog.open).toBe(true);
    expect(document.activeElement).toBe(closeButton);

    // Evento `close` pendente do Ciclo 1 é processado durante a nova abertura
    act(() => {
      flushPendingDialogCloseEvents();
    });

    expect(dialog.open).toBe(true);
    expect(onClose).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(closeButton);

    // Também ignora evento `close` espúrio enquanto diálogo permanece aberto
    fireEvent(dialog, new Event("close"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("funciona corretamente sob React StrictMode sem chamadas indevidas de onClose", () => {
    const showModalSpy = vi.spyOn(HTMLDialogElement.prototype, "showModal");
    const closeSpy = vi.spyOn(HTMLDialogElement.prototype, "close");
    const onClose = vi.fn();

    render(
      <StrictMode>
        <LanguageProvider>
          <div>
            <button type="button">Acionador Strict</button>
            <SkillModal
              skill={mockSkill}
              isOpen={true}
              isClosing={false}
              onClose={onClose}
            />
          </div>
        </LanguageProvider>
      </StrictMode>,
    );

    act(() => {
      flushPendingDialogCloseEvents();
    });

    expect(showModalSpy).toHaveBeenCalledTimes(2);
    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toHaveAttribute("open");
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Fechar modal" }),
    );
  });
});
