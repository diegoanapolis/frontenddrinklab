export const BEVERAGE_TYPES = [
  "Vodka",
  "Cachaça branca",
  "Whisky",
  "Aguardente de cana",
  "Rum branco",
  "Gin seco",
  "Tequila blanca",
  "Pisco",
  "Tiquira",
  "Etanol comercial*",
] as const;

export type BeverageType = typeof BEVERAGE_TYPES[number];