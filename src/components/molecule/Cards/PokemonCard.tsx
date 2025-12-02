"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { cn } from "@/lib/utils";

// Pokemon type colors
const typeColors: Record<string, string> = {
  fire: "bg-orange-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-400",
  psychic: "bg-pink-500",
  ice: "bg-cyan-300",
  dragon: "bg-purple-600",
  dark: "bg-gray-700",
  fairy: "bg-pink-300",
  normal: "bg-gray-400",
  fighting: "bg-red-700",
  flying: "bg-indigo-300",
  poison: "bg-purple-500",
  ground: "bg-amber-600",
  rock: "bg-amber-800",
  bug: "bg-lime-500",
  ghost: "bg-violet-700",
  steel: "bg-slate-400",
};

export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  hp: number;
  attack: number;
  defense: number;
  imageUrl?: string;
}

interface PokemonCardProps {
  pokemon: Pokemon;
  compact?: boolean;
  onClick?: () => void;
}

export function PokemonCard({ pokemon, compact = false, onClick }: PokemonCardProps) {
  const primaryType = pokemon.types[0] || "normal";
  const typeColor = typeColors[primaryType] || typeColors.normal;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]",
        compact ? "p-2" : "p-0",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
    >
      {/* Type color accent */}
      <div className={cn("absolute top-0 left-0 right-0 h-1", typeColor)} />

      <CardHeader className={cn(compact ? "p-2 pb-1" : "p-4 pb-2")}>
        <div className="flex items-center justify-between">
          <CardTitle className={cn("capitalize", compact ? "text-sm" : "text-lg")}>
            {pokemon.name}
          </CardTitle>
          <span className="text-muted-foreground text-xs font-mono">
            #{pokemon.id.toString().padStart(3, "0")}
          </span>
        </div>
      </CardHeader>

      <CardContent className={cn(compact ? "p-2 pt-0" : "p-4 pt-0")}>
        {/* Pokemon Image Placeholder */}
        <div
          className={cn(
            "mx-auto flex items-center justify-center rounded-lg bg-muted mb-3",
            compact ? "h-16 w-16" : "h-28 w-28"
          )}
        >
          {pokemon.imageUrl && (
            <Image
              src={pokemon.imageUrl}
              alt={pokemon.name}
              width={compact ? 64 : 128}
              height={compact ? 64 : 128}
              className="object-contain p-1"
            />
          )}
        </div>

        {/* Types */}
        <div className={cn("flex gap-1 justify-center", compact ? "mb-1" : "mb-3")}>
          {pokemon.types.map((type) => (
            <span
              key={type}
              className={cn(
                "rounded-full px-2 py-0.5 text-white text-xs capitalize",
                typeColors[type] || typeColors.normal
              )}
            >
              {type}
            </span>
          ))}
        </div>

        {/* Stats - hidden in compact mode */}
        {!compact && (
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-md bg-muted p-2">
              <div className="font-semibold text-foreground">{pokemon.hp}</div>
              <div className="text-muted-foreground">HP</div>
            </div>
            <div className="rounded-md bg-muted p-2">
              <div className="font-semibold text-foreground">{pokemon.attack}</div>
              <div className="text-muted-foreground">ATK</div>
            </div>
            <div className="rounded-md bg-muted p-2">
              <div className="font-semibold text-foreground">{pokemon.defense}</div>
              <div className="text-muted-foreground">DEF</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
