"use client";

import Image from "next/image";

interface HeaderAvatarProps {
  readonly isScrolled: boolean;
}

export function HeaderAvatar({ isScrolled }: HeaderAvatarProps) {
  return (
    <div className="justify-self-end pr-4.5">
      <div
        className={`
          relative rounded-full overflow-hidden
          inset-ring-1 inset-ring-emerald-500 shadow-lg
          transition-all duration-300
          ${
            isScrolled
              ? "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
              : "w-16 h-16 sm:w-16 sm:h-16 md:w-20 md:h-20"
          }
        `}
      >
        <Image
          src="/images/profile.jpg"
          alt="Foto de perfil"
          fill
          className="object-cover object-[center_18%] border border-emerald-500 rounded-full"
          priority
        />
      </div>
    </div>
  );
}
