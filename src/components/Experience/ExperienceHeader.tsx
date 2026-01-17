interface ExperienceHeaderProps {
  readonly title: string;
}

export function ExperienceHeader({ title }: ExperienceHeaderProps) {
  return (
    <div className="flex justify-center">
      <div className="inline-block bg-stone-300/10 backdrop-blur-sm inset-ring-1 inset-ring-stone-600 px-9 py-2 mb-4 rounded-full shadow-lg relative hover:bg-stone-300/20 transition-color">
        <h2 className="text-2xl sm:text-3xl font-bold text-emerald-400 p-1 text-center">
          {title}
        </h2>
      </div>
    </div>
  );
}
