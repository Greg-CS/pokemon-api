"use client";

// biome-ignore assist/source/organizeImports: false positive
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/atoms/button";
import { PokemonCard, type Pokemon } from "@/components/molecule/Cards/PokemonCard";
import { PokemonDetailModal } from "@/components/molecule/Modals/PokemonDetailModal";
import { Skeleton } from "@/components/atoms/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/atoms/pagination";
import { cn } from "@/lib/utils";
import {
  fetchPokemonList,
  fetchPokemonDetail,
  transformPokemonDetail,
} from "@/lib/pokeapi";

type DisplayMode = "comfortable" | "compact";

const ITEMS_PER_PAGE = 12;

export function PokedexGrid() {
  const [displayMode, setDisplayMode] = useState<DisplayMode>("comfortable");
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  const isCompact = displayMode === "compact";
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const loadPokemon = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const list = await fetchPokemonList(ITEMS_PER_PAGE, offset);
      setTotalCount(list.count);

      // Fetch details for each Pokemon in parallel
      const details = await Promise.all(
        list.results.map((p) => fetchPokemonDetail(p.name))
      );

      setPokemon(details.map(transformPokemonDetail));
    } catch (error) {
      console.error("Failed to load Pokemon:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPokemon(currentPage);
  }, [currentPage, loadPokemon]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showPages = 5; // Max page buttons to show

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="w-full">
      {/* Header with mode toggle */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pokédex</h1>
          <p className="text-muted-foreground text-sm">
            {totalCount > 0 ? `${totalCount} Pokémon found` : "Loading..."}
          </p>
        </div>

        {/* Display Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">Display:</span>
          <div className="flex rounded-lg border border-border p-1">
            <Button
              variant={displayMode === "comfortable" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDisplayMode("comfortable")}
              className="text-xs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
                aria-hidden="true"
              >
                <title>Comfortable view</title>
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
              <span className="hidden sm:inline">Comfortable</span>
            </Button>
            <Button
              variant={displayMode === "compact" ? "default" : "ghost"}
              size="sm"
              onClick={() => setDisplayMode("compact")}
              className="text-xs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
                aria-hidden="true"
              >
                <title>Compact view</title>
                <rect width="4" height="4" x="3" y="3" rx="1" />
                <rect width="4" height="4" x="10" y="3" rx="1" />
                <rect width="4" height="4" x="17" y="3" rx="1" />
                <rect width="4" height="4" x="3" y="10" rx="1" />
                <rect width="4" height="4" x="10" y="10" rx="1" />
                <rect width="4" height="4" x="17" y="10" rx="1" />
                <rect width="4" height="4" x="3" y="17" rx="1" />
                <rect width="4" height="4" x="10" y="17" rx="1" />
                <rect width="4" height="4" x="17" y="17" rx="1" />
              </svg>
              <span className="hidden sm:inline">Compact</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Pokemon Grid */}
      <div
        className={cn(
          "grid gap-4 transition-all",
          isCompact
            ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
        )}
      >
        {loading
          ? // Skeleton loading state
            Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <div key={`skeleton-${i}`} className="rounded-lg border bg-card p-4">
                <Skeleton className={cn("mx-auto mb-3", isCompact ? "h-16 w-16" : "h-28 w-28")} />
                <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-3 w-1/2 mx-auto" />
              </div>
            ))
          : pokemon.map((p) => (
              <PokemonCard
                key={p.id}
                pokemon={p}
                compact={isCompact}
                onClick={() => setSelectedPokemon(p)}
              />
            ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage - 1);
                  }}
                  className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                />
              </PaginationItem>

              {getPageNumbers().map((page, idx) =>
                page === "ellipsis" ? (
                  <PaginationItem key={`ellipsis-page-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(currentPage + 1);
                  }}
                  className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <p className="text-center text-sm text-muted-foreground mt-2">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      )}

      {/* Pokemon Detail Modal */}
      {selectedPokemon && (
        <PokemonDetailModal
          pokemon={selectedPokemon}
          isOpen={!!selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    </div>
  );
}
