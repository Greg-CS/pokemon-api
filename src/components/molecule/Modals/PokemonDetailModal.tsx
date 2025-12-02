"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/atoms/card";
import { Progress } from "@/components/atoms/progress";
import { ScrollArea } from "@/components/atoms/scroll-area";
import { Separator } from "@/components/atoms/separator";
import { Skeleton } from "@/components/atoms/skeleton";
import { cn } from "@/lib/utils";
import {
  fetchPokemonDetail,
  fetchPokemonSpecies,
  getEnglishDescription,
  getEnglishGenus,
  getOfficialArtwork,
  type PokemonDetail,
  type PokemonSpecies,
} from "@/lib/pokeapi";
import type { Pokemon } from "@/components/molecule/Cards/PokemonCard";

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

type Tab = "stats" | "moves" | "abilities";

interface PokemonDetailModalProps {
  pokemon: Pokemon;
  isOpen: boolean;
  onClose: () => void;
}

export function PokemonDetailModal({
  pokemon,
  isOpen,
  onClose,
}: PokemonDetailModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("stats");
  const [detail, setDetail] = useState<PokemonDetail | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && pokemon) {
      setLoading(true);
      Promise.all([
        fetchPokemonDetail(pokemon.id),
        fetchPokemonSpecies(pokemon.id),
      ])
        .then(([detailData, speciesData]) => {
          setDetail(detailData);
          setSpecies(speciesData);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen, pokemon]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const primaryType = pokemon.types[0] || "normal";
  const typeColor = typeColors[primaryType] || typeColors.normal;

  // All stats with max values for progress bars
  const allStats = detail
    ? [
        { name: "HP", value: detail.stats.find((s) => s.stat.name === "hp")?.base_stat ?? 0 },
        { name: "Attack", value: detail.stats.find((s) => s.stat.name === "attack")?.base_stat ?? 0 },
        { name: "Defense", value: detail.stats.find((s) => s.stat.name === "defense")?.base_stat ?? 0 },
        { name: "Sp. Atk", value: detail.stats.find((s) => s.stat.name === "special-attack")?.base_stat ?? 0 },
        { name: "Sp. Def", value: detail.stats.find((s) => s.stat.name === "special-defense")?.base_stat ?? 0 },
        { name: "Speed", value: detail.stats.find((s) => s.stat.name === "speed")?.base_stat ?? 0 },
      ]
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Modal */}
      <Card className="relative z-10 w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Type color accent */}
        <div className={cn("absolute top-0 left-0 right-0 h-2", typeColor)} />

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 pt-8 space-y-4">
              <div className="flex gap-6">
                <Skeleton className="h-40 w-40 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
              <Skeleton className="h-48 w-full" />
            </div>
          ) : (
            <ScrollArea className="max-h-[85vh]">
              <div className="p-6 pt-8">
                {/* Header section */}
                <div className="flex flex-col sm:flex-row gap-6 mb-6">
                  {/* Pokemon image */}
                  <div className="shrink-0 mx-auto sm:mx-0">
                    <div className="relative h-40 w-40 rounded-lg bg-muted flex items-center justify-center">
                      <Image
                        src={getOfficialArtwork(pokemon.id)}
                        alt={pokemon.name}
                        width={160}
                        height={160}
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Pokemon info */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                      <h2 className="text-2xl font-bold capitalize">
                        {pokemon.name}
                      </h2>
                      <span className="text-muted-foreground font-mono">
                        #{pokemon.id.toString().padStart(3, "0")}
                      </span>
                    </div>

                    {species && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {getEnglishGenus(species)}
                      </p>
                    )}

                    {/* Types */}
                    <div className="flex gap-2 justify-center sm:justify-start mb-4">
                      {pokemon.types.map((type) => (
                        <span
                          key={type}
                          className={cn(
                            "rounded-full px-3 py-1 text-white text-sm capitalize",
                            typeColors[type] || typeColors.normal
                          )}
                        >
                          {type}
                        </span>
                      ))}
                    </div>

                    {/* Description */}
                    {species && (
                      <p className="text-sm text-foreground leading-relaxed">
                        {getEnglishDescription(species)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Physical info */}
                {detail && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="rounded-lg bg-muted p-3 text-center">
                      <div className="text-lg font-semibold">
                        {(detail.height / 10).toFixed(1)} m
                      </div>
                      <div className="text-xs text-muted-foreground">Height</div>
                    </div>
                    <div className="rounded-lg bg-muted p-3 text-center">
                      <div className="text-lg font-semibold">
                        {(detail.weight / 10).toFixed(1)} kg
                      </div>
                      <div className="text-xs text-muted-foreground">Weight</div>
                    </div>
                  </div>
                )}

                <Separator className="mb-4" />

                {/* Tab navigation */}
                <div className="flex gap-1 mb-4 p-1 bg-muted rounded-lg">
                  {(["stats", "moves", "abilities"] as Tab[]).map((tab) => (
                    <Button
                      key={tab}
                      variant={activeTab === tab ? "default" : "ghost"}
                      size="sm"
                      className="flex-1 capitalize"
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </Button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="min-h-[200px]">
                  {activeTab === "stats" && (
                    <div className="space-y-3">
                      {allStats.map((stat) => (
                        <div key={stat.name} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{stat.name}</span>
                            <span className="font-medium">{stat.value}</span>
                          </div>
                          <Progress
                            value={(stat.value / 255) * 100}
                            className="h-2"
                          />
                        </div>
                      ))}
                      <div className="pt-2 text-center">
                        <span className="text-sm text-muted-foreground">
                          Total:{" "}
                          <span className="font-semibold text-foreground">
                            {allStats.reduce((sum, s) => sum + s.value, 0)}
                          </span>
                        </span>
                      </div>
                    </div>
                  )}

                  {activeTab === "moves" && detail && (
                    <ScrollArea className="h-[200px]">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {detail.moves.slice(0, 30).map((m) => (
                          <div
                            key={m.move.name}
                            className="rounded-md bg-muted px-3 py-2 text-sm capitalize text-center"
                          >
                            {m.move.name.replace("-", " ")}
                          </div>
                        ))}
                      </div>
                      {detail.moves.length > 30 && (
                        <p className="text-center text-xs text-muted-foreground mt-3">
                          +{detail.moves.length - 30} more moves
                        </p>
                      )}
                    </ScrollArea>
                  )}

                  {activeTab === "abilities" && detail && (
                    <div className="space-y-3">
                      {detail.abilities.map((a) => (
                        <div
                          key={a.ability.name}
                          className="rounded-lg bg-muted p-4"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium capitalize">
                              {a.ability.name.replace("-", " ")}
                            </span>
                            {a.is_hidden && (
                              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                                Hidden
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
