"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "../contexts/LanguageContext";
import { experiencesByLanguage } from "../data/experiences";

export default function Experience() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);

  const experiences = experiencesByLanguage[language];

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        {t.experience.title}
      </h2>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center mb-6 border-b border-gray-200 gap-1 sm:gap-0">
        {experiences.map((exp, index) => (
          <button
            key={exp.company}
            onClick={() => setActiveTab(index)}
            className={`flex items-center gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors duration-200 min-w-0 flex-1 sm:flex-none ${
              activeTab === index
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Image
              src={exp.logo}
              alt={`${exp.company} logo`}
              width={20}
              height={20}
              className="flex-shrink-0 w-4 h-4 object-contain"
              quality={100}
            />
            <span className="truncate">{exp.company}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm relative">
        <div className="absolute top-4 right-4">
          <Image
            src={experiences[activeTab].logo}
            alt={`${experiences[activeTab].company} logo`}
            width={48}
            height={48}
            className="w-8 h-8 sm:w-12 sm:h-12 object-contain"
            quality={100}
          />
        </div>
        <div className="pr-12 sm:pr-16">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 break-words">
            {experiences[activeTab].title}
          </h3>
          <p className="text-gray-400 text-sm sm:text-base mb-4">
            {experiences[activeTab].company} | {experiences[activeTab].period}
          </p>
          <p className="text-gray-700 mb-4 text-sm sm:text-base leading-relaxed">
            {experiences[activeTab].description}
          </p>
          {experiences[activeTab].activities.length > 0 && (
            <>
              <p className="text-gray-800 mb-3 text-sm sm:text-base">
                Algumas outras atividades que realizei:
              </p>
              <ul className="text-gray-500 ml-4 sm:ml-8 list-disc space-y-1 text-sm sm:text-base">
                {experiences[activeTab].activities.map((activity) => (
                  <li key={activity}>{activity}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
