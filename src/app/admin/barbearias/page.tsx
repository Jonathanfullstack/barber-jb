"use client";

import Image from "next/image";
import { BARBEARIA } from "@/lib/mock-data";

export default function AdminBarbeariasPage() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Dados da barbearia</h1>
        <button
          type="button"
          className="px-3 py-2 rounded-lg bg-brand-purple text-white text-xs md:text-sm font-medium hover:bg-brand-purple-dark min-h-[44px] w-full sm:w-auto"
        >
          Editar
        </button>
      </div>
      <article className="bg-dark-800 rounded-xl border border-gray-700 overflow-hidden max-w-2xl">
        <div className="relative aspect-video">
          <Image
            src={BARBEARIA.imageUrl}
            alt={BARBEARIA.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 640px"
            unoptimized
          />
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 rounded bg-brand-purple/90 text-white text-[10px] md:text-xs">★ {BARBEARIA.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="p-3 md:p-4">
          <h3 className="font-semibold text-white text-base md:text-lg">{BARBEARIA.name}</h3>
          <p className="text-gray-400 text-xs md:text-sm mt-0.5 break-words">{BARBEARIA.address}</p>
          {BARBEARIA.about && <p className="text-gray-500 text-xs md:text-sm mt-2 line-clamp-3 md:line-clamp-none">{BARBEARIA.about}</p>}
          <div className="mt-3 pt-3 border-t border-gray-700 flex flex-wrap gap-2 text-xs md:text-sm text-gray-400">
            <span>{BARBEARIA.phone1}</span>
            {BARBEARIA.phone2 && <span>{BARBEARIA.phone2}</span>}
          </div>
        </div>
      </article>
    </div>
  );
}
