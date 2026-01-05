import { Skill } from '@/src/types/skill';

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
  if (!skill && !isClosing) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <button
        className={`absolute inset-0 bg-stone-900 transition-opacity duration-200 ${
          isOpen && !isClosing ? "opacity-50" : "opacity-0"
        }`}
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        aria-label="Fechar modal"
        type="button"
      />

      {/* Modal Content */}
      <dialog
        className={`relative bg-white p-6 rounded-lg max-w-md w-full mx-4 transition-all duration-200 ${
          isOpen && !isClosing ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        open={isOpen && !isClosing}
        onCancel={onClose}
      >
        {skill && (
          <>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">{skill.label}</h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                aria-label="Fechar modal"
              >
                ×
              </button>
            </div>
            <p className="text-gray-700 mb-4">{skill.description}</p>
            <div className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Nível de Proficiência</span>
                <span>{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="skill-bar bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${skill.level}%`,
                  }}
                ></div>
              </div>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
