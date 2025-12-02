# Pokédex App

A modern, responsive Pokédex application built with Next.js that fetches real Pokémon data from the [PokéAPI](https://pokeapi.co/). Browse through all Pokémon with pagination, switch between display modes, and view detailed information for each Pokémon.

## Features

- **Browse Pokémon**: Paginated grid displaying Pokémon with their types and base stats
- **Display Modes**: Toggle between Comfortable (detailed cards) and Compact (more cards per row) views
- **Detailed View**: Click any Pokémon to open a modal with:
  - Pokédex description and category
  - Height and weight
  - Base stats with visual progress bars
  - Moves list
  - Abilities (including hidden abilities)
- **Responsive Design**: Optimized for desktop (6-8 cards) down to mobile (1-3 cards)
- **Type-colored UI**: Cards and modals feature accent colors based on Pokémon type

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/Greg-CS/pokemon-api.git
cd pokemon-api

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

This project follows **Atomic Design** principles for component organization:

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles & Tailwind
├── components/
│   ├── atoms/              # Basic UI primitives (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── pagination.tsx
│   │   ├── progress.tsx
│   │   ├── scroll-area.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   └── sonner.tsx
│   ├── molecule/           # Composed components
│   │   ├── Cards/
│   │   │   └── PokemonCard.tsx
│   │   ├── Grids/
│   │   │   └── PokedexGrid.tsx
│   │   └── Modals/
│   │       └── PokemonDetailModal.tsx
│   ├── organism/           # Complex UI sections (future)
│   └── template/           # Page layouts (future)
└── lib/
    ├── pokeapi.ts          # PokéAPI client & types
    └── utils.ts            # Utility functions (cn)
```

### Why Atomic Design?

- **Atoms**: Smallest, reusable UI elements (buttons, inputs, cards). These come from shadcn/ui and are customizable.
- **Molecules**: Combinations of atoms that form functional units (PokemonCard = Card + Image + Typography).
- **Organisms**: Complex sections composed of molecules (future: Header, Sidebar).
- **Templates**: Page-level layouts that arrange organisms.

This structure promotes:
- **Reusability**: Components can be used across different features
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new features without cluttering

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **API**: [PokéAPI](https://pokeapi.co/)
- **Language**: TypeScript

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
