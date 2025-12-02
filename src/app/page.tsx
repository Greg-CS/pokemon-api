import { PokedexGrid } from "@/components/molecule/Grids/PokedexGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <PokedexGrid />
      </main>
    </div>
  );
}
