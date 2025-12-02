const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

// PokeAPI types
export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface NamedAPIResourceList {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
}

export interface PokemonSprites {
  front_default: string | null;
  other?: {
    "official-artwork"?: {
      front_default: string | null;
    };
  };
}

export interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

export interface PokemonAbility {
  ability: NamedAPIResource;
  is_hidden: boolean;
  slot: number;
}

export interface PokemonMove {
  move: NamedAPIResource;
}

export interface PokemonDetail {
  id: number;
  name: string;
  sprites: PokemonSprites;
  types: PokemonType[];
  stats: PokemonStat[];
  height: number;
  weight: number;
  abilities: PokemonAbility[];
  moves: PokemonMove[];
}

// Pokemon Species (for description/flavor text)
export interface FlavorTextEntry {
  flavor_text: string;
  language: NamedAPIResource;
  version: NamedAPIResource;
}

export interface PokemonSpecies {
  flavor_text_entries: FlavorTextEntry[];
  genera: { genus: string; language: NamedAPIResource }[];
}

// Fetch paginated list of Pokemon
export async function fetchPokemonList(
  limit = 20,
  offset = 0
): Promise<NamedAPIResourceList> {
  const res = await fetch(
    `${POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokemon list: ${res.status}`);
  }
  return res.json();
}

// Fetch single Pokemon details
export async function fetchPokemonDetail(
  nameOrId: string | number
): Promise<PokemonDetail> {
  const res = await fetch(`${POKEAPI_BASE_URL}/pokemon/${nameOrId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokemon ${nameOrId}: ${res.status}`);
  }
  return res.json();
}

// Fetch Pokemon species (for description)
export async function fetchPokemonSpecies(
  nameOrId: string | number
): Promise<PokemonSpecies> {
  const res = await fetch(`${POKEAPI_BASE_URL}/pokemon-species/${nameOrId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokemon species ${nameOrId}: ${res.status}`);
  }
  return res.json();
}

// Get English description from species
export function getEnglishDescription(species: PokemonSpecies): string {
  const entry = species.flavor_text_entries.find(
    (e) => e.language.name === "en"
  );
  return entry?.flavor_text.replace(/\f|\n/g, " ") ?? "No description available.";
}

// Get English genus (category)
export function getEnglishGenus(species: PokemonSpecies): string {
  const genus = species.genera.find((g) => g.language.name === "en");
  return genus?.genus ?? "Unknown";
}

// Helper to extract Pokemon ID from URL
export function extractIdFromUrl(url: string): number {
  const match = url.match(/\/pokemon\/(\d+)\//);
  return match ? parseInt(match[1], 10) : 0;
}

// Helper to get official artwork URL
export function getOfficialArtwork(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

// Transform API response to our Pokemon type
export function transformPokemonDetail(detail: PokemonDetail) {
  const hp = detail.stats.find((s) => s.stat.name === "hp")?.base_stat ?? 0;
  const attack = detail.stats.find((s) => s.stat.name === "attack")?.base_stat ?? 0;
  const defense = detail.stats.find((s) => s.stat.name === "defense")?.base_stat ?? 0;

  return {
    id: detail.id,
    name: detail.name,
    types: detail.types.map((t) => t.type.name),
    hp,
    attack,
    defense,
    imageUrl: getOfficialArtwork(detail.id),
  };
}
