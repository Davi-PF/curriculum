"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { Skill } from "@/src/types/skill";
import { useLanguage } from "../../contexts/LanguageContext";

interface SkillModalProps {
  readonly skill: Skill | null;
  readonly isOpen: boolean;
  readonly isClosing: boolean;
  readonly onClose: () => void;
}

export function SkillModal({
  skill,
  isOpen,
  isClosing,
  onClose,
}: SkillModalProps) {
  const { t } = useLanguage();
  const titleId = useId();
  const descriptionId = useId();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const closeRequestedRef = useRef(false);
  // Contabiliza chamadas programáticas de `dialog.close()` cujo evento `close`
  // assíncrono ainda não foi processado, evitando falsa detecção de fechamento externo.
  const pendingProgrammaticClosesRef = useRef(0);

  const hasSkill = skill !== null;

  const restoreFocus = useCallback(() => {
    const opener = openerRef.current;
    openerRef.current = null;
    if (opener?.isConnected) {
      opener.focus();
    }
  }, []);

  const closeDialogProgrammatically = useCallback(
    (dialog: HTMLDialogElement) => {
      if (dialog.open) {
        pendingProgrammaticClosesRef.current += 1;
        dialog.close();
      }
      restoreFocus();
    },
    [restoreFocus]
  );

  const requestClose = useCallback(() => {
    if (isClosing || closeRequestedRef.current) {
      return;
    }
    closeRequestedRef.current = true;
    onClose();
  }, [isClosing, onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!hasSkill || !dialog) return;

    if (isOpen && !isClosing) {
      closeRequestedRef.current = false;
      if (!dialog.open) {
        const activeElement = document.activeElement;
        if (
          activeElement instanceof HTMLElement &&
          !dialog.contains(activeElement)
        ) {
          openerRef.current = activeElement;
        }
        dialog.showModal();
        closeButtonRef.current?.focus();
      }
      return;
    }

    if (!isClosing && dialog.open) {
      closeDialogProgrammatically(dialog);
    }
  }, [hasSkill, isOpen, isClosing, closeDialogProgrammatically]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!hasSkill || !dialog) return;

    return () => {
      closeDialogProgrammatically(dialog);
    };
  }, [hasSkill, closeDialogProgrammatically]);

  const handleCancel = (event: React.SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault();
    requestClose();
  };

  const handleNativeClose = () => {
    if (pendingProgrammaticClosesRef.current > 0) {
      pendingProgrammaticClosesRef.current -= 1;
      return;
    }

    if (dialogRef.current?.open) {
      return;
    }

    requestClose();
    restoreFocus();
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) {
      requestClose();
    }
  };

  if (!skill) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={handleCancel}
      onClose={handleNativeClose}
      onClick={handleBackdropClick}
      className={`
        m-auto w-[calc(100%-2rem)] max-w-lg p-0
        rounded-xl border-0
        bg-stone-800/90 backdrop-blur-sm
        text-inherit
        inset-ring-1 inset-ring-emerald-500/40
        shadow-2xl
        backdrop:bg-stone-900/70 backdrop:backdrop-blur-sm
        backdrop:transition-opacity backdrop:duration-200
        transition-all duration-200
        ${
          isOpen && !isClosing
            ? "opacity-100 scale-100 backdrop:opacity-100"
            : "opacity-0 scale-95 backdrop:opacity-0"
        }
        ${isClosing ? "pointer-events-none" : ""}
      `}
    >
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3
            id={titleId}
            className="text-xl sm:text-2xl font-bold text-emerald-400"
          >
            {skill.label}
          </h3>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={requestClose}
            aria-label={t.skill.closeModalAriaLabel}
            className="
              text-emerald-400/70
              hover:text-emerald-300
              text-2xl leading-none
              transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 rounded
            "
          >
            ×
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-emerald-500/20 mb-4" />

        {/* Description */}
        <p
          id={descriptionId}
          className="text-left text-emerald-200/90 leading-relaxed text-sm sm:text-base"
        >
          {skill.description}
        </p>
      </div>
    </dialog>,
    document.body
  );
}
