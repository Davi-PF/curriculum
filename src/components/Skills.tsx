"use client";

import { useState, useEffect } from 'react';
import { skills, Skill } from '../utils/SkillsData';

export default function Skills() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsClosing(false);
    // Pequeno delay para garantir que o DOM seja renderizado antes da animação
    setTimeout(() => setIsOpen(true), 10);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsClosing(true);
  };

  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        setSelectedSkill(null);
        setIsClosing(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isClosing]);

  useEffect(() => {
    if (!selectedSkill) {
      setIsOpen(false);
    }
  }, [selectedSkill]);

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Skills</h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <button
            key={skill.name}
            type="button"
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
            onClick={() => handleOpen(skill)}
          >
            {skill.name}
          </button>
        ))}
      </div>

      {(selectedSkill || isClosing) && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-200 ${
            isClosing ? 'bg-stone-900/0' : 'bg-stone-900/50'
          }`}
          onClick={handleClose}
        >
          <div
            className={`bg-white p-6 rounded-lg max-w-md w-full mx-4 transition-all duration-200 ${
              isOpen && !isClosing ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {selectedSkill && (
              <>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{selectedSkill.name}</h3>
                  <button
                    onClick={handleClose}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-700 mb-4">{selectedSkill.description}</p>
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Nível de Proficiência</span>
                    <span>{selectedSkill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${selectedSkill.level}%` }}
                    ></div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}