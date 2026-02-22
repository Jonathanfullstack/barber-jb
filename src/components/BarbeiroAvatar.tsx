"use client";

import { useState } from "react";
import Image from "next/image";
import { AVATAR_FUNCIONARIOS_FALLBACK } from "@/lib/mock-data";

const AVATAR_JPG = "/funcionarios/prv.jpg";

type Props = {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  fill?: boolean;
};

/**
 * Avatar do barbeiro: tenta a foto local (prv.png). Se falhar, tenta prv.jpg.
 * Se ambos falharem, usa imagem de fallback para não mostrar ícone quebrado.
 */
export default function BarbeiroAvatar({ src, alt, sizes = "96px", className, fill = true }: Props) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [triedJpg, setTriedJpg] = useState(false);

  const handleError = () => {
    if (src.startsWith("/funcionarios/") && !triedJpg) {
      setTriedJpg(true);
      setCurrentSrc(AVATAR_JPG);
    } else {
      setCurrentSrc(AVATAR_FUNCIONARIOS_FALLBACK);
    }
  };

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      unoptimized={currentSrc.startsWith("http") || currentSrc.startsWith("data:")}
      onError={handleError}
    />
  );
}
