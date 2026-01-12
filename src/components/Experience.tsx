"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "../contexts/LanguageContext";
import { experiencesByLanguage } from "../data/experiences";
import { getLinkIcon } from "../types/ExperienceRelated/ActivityLink";

export default function Experience() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);

  const experiences = experiencesByLanguage[language];

  return (
    <section className="mb-12">
      <div className="bg-stone-800/50 backdrop-blur-md inset-ring-1 inset-ring-stone-600/40 p-4 sm:p-6 rounded-lg shadow-sm relative">
        <div className="flex justify-center">
          <div className="inline-block bg-stone-300/20 backdrop-blur-md inset-ring-1 inset-ring-stone-600 px-9 py-2 mb-4 rounded-full shadow-lg relative hover:bg-stone-300/30 transition-color">
            <h2 className="text-3xl font-bold text-emerald-400 p-1 text-center">
              {t.experience.title}
            </h2>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center mb-6 border-b border-emerald-500 gap-1 sm:gap-0">
          {experiences.map((exp, index) => (
            <button
              key={exp.company}
              onClick={() => setActiveTab(index)}
              className={`flex items-center gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors duration-200 min-w-0 flex-1 sm:flex-none ${
                activeTab === index
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "text-stone-400 hover:text-gray-200"
              }`}
            >
              <div className="bg-slate-200 inset-ring-1 inset-ring-stone-300 px-2 py-2 rounded-full shadow-md">
                <Image
                  src={exp.logo}
                  alt={`${exp.company} logo`}
                  width={30}
                  height={30}
                  className="flex-shrink-0 w-5 h-5 object-contain"
                  quality={100}
                />
              </div>
              <span className="truncate">{exp.company}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-stone-600/30 backdrop-blur-md inset-ring-1 inset-ring-stone-700/40 p-4 sm:p-6 rounded-xl shadow-xl relative mb-2 hover:bg-stone-600/20 transition-color">
          {/* Logo */}
          <div className="absolute top-4.5 left-5 sm:top-6 sm:left-6 bg-slate-200 inset-ring-1 inset-ring-stone-300 p-1.5 rounded-full shadow-md">
            <Image
              src={experiences[activeTab].logo}
              alt={`${experiences[activeTab].company} logo`}
              width={48}
              height={48}
              className="w-8 h-8 sm:w-12 sm:h-12 object-contain"
              quality={100}
            />
          </div>
          <div className="pl-16 sm:pl-20">
            <h3 className="text-lg sm:text-xl font-semibold text-emerald-300 mb-2 break-words">
              {experiences[activeTab].title}
            </h3>
            <p className="text-emerald-500/60 text-sm sm:text-base mb-4">
              {experiences[activeTab].company} | {experiences[activeTab].period}
            </p>
            <p className="text-emerald-400 mb-4 text-sm sm:text-base text-justify pr-10">
              {experiences[activeTab].description}
            </p>
            {experiences[activeTab].activities.length > 0 && (
              <>
                <p className="text-emerald-300 mb-3 text-sm sm:text-base">
                  {experiences[activeTab].extraActivities}
                </p>
                <ul className="text-emerald-300 ml-4 sm:ml-8 list-disc space-y-1 text-sm sm:text-base pr-8">
                  {experiences[activeTab].activities.map((activity) => {
                    const primaryLink = activity.links?.[0];
                    return (
                      <li
                        key={activity.title}
                        className="transition-colors hover:bg-stone-700/30 rounded px-1"
                      >
                        {primaryLink ? (
                          <div className="flex items-center gap-1">
                            <a
                              href={primaryLink.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-300 hover:text-emerald-200"
                            >
                              {activity.title}
                            </a>
                            <span className="text-emerald-400/70">↗</span>
                            <Image
                              src={getLinkIcon(primaryLink.type)}
                              alt={primaryLink.type}
                              width={20}
                              height={16}
                            />
                          </div>
                        ) : (
                          <span className="text-emerald-300">
                            {activity.title}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
