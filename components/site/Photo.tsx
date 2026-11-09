"use client";

import Image from "next/image";
import { useState } from "react";
import { Stethoscope } from "lucide-react";

/**
 * Imagine care umple containerul părinte (care trebuie să fie `relative` și să aibă înălțime).
 * Dacă fișierul lipsește încă, afișează un fundal discret în locul iconiței de imagine stricată.
 */
export default function Photo({
  src,
  alt,
  sizes,
  className = "",
  preload = false,
  unoptimized = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  preload?: boolean;
  /** Servește fișierul original, fără recomprimare (pentru imagini mici, ca să nu-și piardă claritatea). */
  unoptimized?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-container via-deep to-forest"
      >
        <Stethoscope className="text-white/25" size={56} strokeWidth={1.25} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      preload={preload}
      unoptimized={unoptimized}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
