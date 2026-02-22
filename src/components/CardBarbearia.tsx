"use client";

import Link from "next/link";
import Image from "next/image";

type CardBarbeariaProps = {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  rating: number;
};

export default function CardBarbearia({ id, name, address, imageUrl, rating }: CardBarbeariaProps) {
  return (
    <Link href={`/barbearia/${id}`} className="block group">
      <article className="bg-dark-800 rounded-xl overflow-hidden border border-gray-700 hover:border-brand-purple/50 transition-all duration-200 flex flex-col h-full">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 400px) 100vw, 320px"
            unoptimized
          />
          <div className="absolute top-2 left-2 bg-brand-purple text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
            <span>★</span> {rating.toFixed(1)}
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-white truncate">{name}</h3>
          <p className="text-gray-400 text-sm truncate mt-0.5">{address}</p>
          <div className="mt-3 pt-3 border-t border-gray-700">
            <span className="block w-full text-center py-2 rounded-lg bg-dark-700 text-white text-sm font-medium group-hover:bg-brand-purple transition-colors">
              Reservar
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
