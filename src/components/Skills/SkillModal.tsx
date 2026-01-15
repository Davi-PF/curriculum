import { Skill } from "@/src/types/skill";
import { createPortal } from 'react-dom';

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
  if (!skill) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Fechar modal"
        onClick={onClose}
        className={`
          absolute inset-0 bg-stone-900/70 backdrop-blur-sm
          transition-opacity duration-200
          ${isOpen && !isClosing ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* Modal */}
      <dialog
        open={isOpen && !isClosing}
        onCancel={onClose}
        className={`
          relative w-full max-w-lg
          rounded-xl
          bg-stone-800/90 backdrop-blur-md
          inset-ring-1 inset-ring-emerald-500/40
          shadow-2xl p-6 sm:p-8
          
          transition-all duration-200
          ${
            isOpen && !isClosing
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-emerald-400">
            {skill.label}
          </h3>

          <button
            onClick={onClose}
            aria-label="Fechar modal"
            className="
              text-emerald-400/70
              hover:text-emerald-300
              text-2xl leading-none
              transition-colors
            "
          >
            ×
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-emerald-500/20 mb-4" />

        {/* Description */}
        <p className="text-left text-emerald-200/90 leading-relaxed text-sm sm:text-base">
          {skill.description}
        </p>
      </dialog>
    </div>,
    document.body
  );
}
