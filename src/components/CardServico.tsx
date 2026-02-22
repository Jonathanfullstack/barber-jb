"use client";

import { useState } from "react";
import Image from "next/image";
import { FALLBACK_IMAGE } from "@/lib/mock-data";

type CardServicoProps = {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  imageUrl: string | null;
  onReservar: () => void;
};

export default function CardServico({ nome, descricao, preco, imageUrl, onReservar }: CardServicoProps) {
  const [src, setSrc] = useState(imageUrl || FALLBACK_IMAGE);
  return (
    <article className="bg-dark-800 rounded-xl overflow-hidden border border-gray-700 flex flex-col">
      <div className="relative aspect-square">
        <Image
          src={src}
          alt={nome}
          fill
          className="object-cover"
          sizes="280px"
          unoptimized
          onError={() => setSrc(FALLBACK_IMAGE)}
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-white">{nome}</h3>
        {descricao && <p className="text-gray-400 text-sm mt-1 line-clamp-2">{descricao}</p>}
        <p className="text-brand-purple font-semibold mt-2">R$ {preco.toFixed(2).replace(".", ",")}</p>
        <button
          type="button"
          onClick={onReservar}
          className="mt-3 w-full py-3 min-h-[44px] rounded-lg bg-dark-700 text-white text-sm font-medium hover:bg-brand-purple active:opacity-90 transition-colors touch-manipulation"
        >
          Reservar
        </button>
      </div>
    </article>
  );
}
