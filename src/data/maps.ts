export interface GameMap {
  id: string
  name: string
  terrain: string
  scale: 'Small' | 'Balanced' | 'Sprawling'
  description: string
  accent: string
}

export const maps: GameMap[] = [
  {
    id: 'australia',
    name: 'Australia',
    terrain: 'Island continent, outback interior',
    scale: 'Balanced',
    description: 'One large island plus Tasmania to the south. The open interior favors land pushes once the coasts are secured.',
    accent: '#e07a3f',
  },
  {
    id: 'beringsea',
    name: 'Bering Sea',
    terrain: 'Arctic strait, ice floes',
    scale: 'Sprawling',
    description: 'Two frozen coastlines facing off across open water. Long travel times reward patient economy play over rushing.',
    accent: '#7fb8c4',
  },
  {
    id: 'iceland',
    name: 'Iceland',
    terrain: 'Mountainous, fjord-cut coastline',
    scale: 'Small',
    description: 'Mountainous terrain with a coastline riddled with fjords and inlets — suited for both land attacks and trade routes.',
    accent: '#5fb3a3',
  },
  {
    id: 'mars',
    name: 'Mars',
    terrain: 'Canyon rift, crater fields',
    scale: 'Balanced',
    description: "OpenFront's take on Mars if the planet had surface water — a rust-red canyon world where craters break sightlines and create natural fallback positions.",
    accent: '#c1440e',
  },
  {
    id: 'mena',
    name: 'Mena',
    terrain: 'Desert, scattered resource centers',
    scale: 'Balanced',
    description: 'Sparse resource centers spread across open desert force early alliances or a hard sprint to the richest tiles.',
    accent: '#f2c14e',
  },
  {
    id: 'montreal',
    name: 'Montreal',
    terrain: 'River island city, bridge chokepoints',
    scale: 'Small',
    description: 'A dense island city cut by the river and a handful of bridges. Whoever holds the crossings controls the whole match.',
    accent: '#3b9dff',
  },
  {
    id: 'niledelta',
    name: 'Nile Delta',
    terrain: 'Branching river delta, fertile banks',
    scale: 'Balanced',
    description: 'A fanning river delta cut into dozens of narrow, fertile strips. Whoever reads the branching waterways best wins the economy game.',
    accent: '#3fae6a',
  },
  {
    id: 'pluto',
    name: 'Pluto',
    terrain: 'Frozen plains, sparse resources',
    scale: 'Sprawling',
    description: "OpenFront's take on Pluto turned to water and land — resources are few and far between, with a cluster of islands up north that favor naval builds.",
    accent: '#a9b8c9',
  },
  {
    id: 'straitofgibraltar',
    name: 'Strait of Gibraltar',
    terrain: 'Narrow sea strait, two landmasses',
    scale: 'Small',
    description: 'Two coastlines separated by a razor-thin strait. Naval control of the crossing is worth more than any land push.',
    accent: '#2f6690',
  },
]

export function getMapById(id: string) {
  return maps.find((m) => m.id === id)
}
