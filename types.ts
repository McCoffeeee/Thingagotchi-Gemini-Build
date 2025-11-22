
export enum AppMode {
  HOME = 'HOME',
  GAME = 'GAME',
  SHOP = 'SHOP',
}

export enum CatMood {
  HAPPY = 'HAPPY',
  NEUTRAL = 'NEUTRAL',
  SAD = 'SAD',
  SLEEPING = 'SLEEPING',
  EATING = 'EATING',
}

export interface CatState {
  hunger: number; // 0-100
  happiness: number; // 0-100
  energy: number; // 0-100
  lastInteraction: number;
}

export interface ChatMessage {
  text: string;
  timestamp: number;
}

export enum ItemCategory {
  SKIN = 'SKIN',
  WALLPAPER = 'WALLPAPER',
  FLOOR = 'FLOOR',
  BED = 'BED',
  RUG = 'RUG',
  DECOR = 'DECOR', // Wall items like posters/windows
  PLANT = 'PLANT', // Floor items like plants
}

export interface ShopItem {
  id: string;
  name: string;
  cost: number;
  category: ItemCategory;
  description: string;
}

// Which item is currently active per category
export type EquippedItems = Partial<Record<ItemCategory, string>>;
