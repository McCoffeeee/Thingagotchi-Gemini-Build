
import React from 'react';
import { ItemCategory, ShopItem } from '../types';

// --- DEFINITIONS ---

export const SKIN_DEFINITIONS: Record<string, { body: string; dark: string; eye: string; cheek: string; type: 'standard' | 'pikachu' }> = {
  'skin_default': { body: "#fbbf24", dark: "#b45309", eye: "#1e293b", cheek: "#f472b6", type: 'standard' }, // Orange
  'skin_black': { body: "#1f2937", dark: "#000000", eye: "#fcd34d", cheek: "#4b5563", type: 'standard' }, // Black / Yellow Eye
  'skin_white': { body: "#f3f4f6", dark: "#d1d5db", eye: "#3b82f6", cheek: "#fca5a5", type: 'standard' }, // White / Blue Eye
  'skin_pink': { body: "#fbcfe8", dark: "#db2777", eye: "#831843", cheek: "#fce7f3", type: 'standard' }, // Pink
  'skin_pikachu': { body: "#facc15", dark: "#854d0e", eye: "#000000", cheek: "#ef4444", type: 'pikachu' }, // Pika
};

export const ROOM_STYLES: Record<string, { bg: string; pattern: string; size?: string; opacity: number }> = {
  // Walls
  'wall_default': { bg: '#334155', pattern: 'radial-gradient(#fff 1px, transparent 1px)', size: '20px 20px', opacity: 0.05 },
  'wall_brick': { bg: '#7f1d1d', pattern: 'repeating-linear-gradient(45deg, #991b1b 0, #991b1b 10px, transparent 10px, transparent 20px)', size: 'auto', opacity: 1 },
  'wall_wood': { bg: '#78350f', pattern: 'repeating-linear-gradient(90deg, #451a03 0, #451a03 2px, transparent 2px, transparent 20px)', size: 'auto', opacity: 0.5 },
  'wall_clouds': { bg: '#60a5fa', pattern: 'radial-gradient(#fff 4px, transparent 4px)', size: '40px 40px', opacity: 0.4 },
  'wall_space': { bg: '#1e1b4b', pattern: 'radial-gradient(#fff 1px, transparent 1px)', size: '50px 50px', opacity: 0.8 },

  // Floors
  'floor_default': { bg: '#475569', pattern: 'repeating-linear-gradient(90deg, transparent, transparent 48px, #000 48px, #000 50px)', size: 'auto', opacity: 0.1 },
  'floor_checkered': { bg: '#e2e8f0', pattern: 'repeating-linear-gradient(45deg, #475569 25%, transparent 25%, transparent 75%, #475569 75%, #475569), repeating-linear-gradient(45deg, #475569 25%, transparent 25%, transparent 75%, #475569 75%, #475569)', size: '40px 40px', opacity: 0.2 },
  'floor_wood': { bg: '#d97706', pattern: 'repeating-linear-gradient(0deg, transparent, transparent 10px, #92400e 10px, #92400e 11px)', size: 'auto', opacity: 0.5 },
  'floor_grass': { bg: '#4ade80', pattern: 'radial-gradient(#166534 2px, transparent 2px)', size: '10px 10px', opacity: 0.3 },
};

// --- ITEMS ---

export const ITEMS: ShopItem[] = [
  // SKINS
  { id: 'skin_default', name: 'Orange Tabby', cost: 0, category: ItemCategory.SKIN, description: 'The classic look.' },
  { id: 'skin_black', name: 'Void Cat', cost: 20, category: ItemCategory.SKIN, description: 'Stares back at you.' },
  { id: 'skin_white', name: 'Cloud Cat', cost: 20, category: ItemCategory.SKIN, description: 'Soft and fluffy.' },
  { id: 'skin_pink', name: 'Pinky', cost: 30, category: ItemCategory.SKIN, description: 'Magical.' },
  { id: 'skin_pikachu', name: 'Electric Mouse', cost: 100, category: ItemCategory.SKIN, description: 'Shockingly cute.' },

  // WALLPAPERS
  { id: 'wall_default', name: 'Grey Paint', cost: 0, category: ItemCategory.WALLPAPER, description: 'Basic wall.' },
  { id: 'wall_brick', name: 'Brick Wall', cost: 10, category: ItemCategory.WALLPAPER, description: 'Industrial vibe.' },
  { id: 'wall_wood', name: 'Wood Paneling', cost: 15, category: ItemCategory.WALLPAPER, description: 'Cozy cabin.' },
  { id: 'wall_clouds', name: 'Sky Wall', cost: 20, category: ItemCategory.WALLPAPER, description: 'Dreamy.' },
  { id: 'wall_space', name: 'Space Wall', cost: 50, category: ItemCategory.WALLPAPER, description: 'Far out.' },

  // FLOORS
  { id: 'floor_default', name: 'Grey Tiles', cost: 0, category: ItemCategory.FLOOR, description: 'Basic floor.' },
  { id: 'floor_wood', name: 'Hardwood', cost: 15, category: ItemCategory.FLOOR, description: 'Classic finish.' },
  { id: 'floor_checkered', name: 'Checkered', cost: 20, category: ItemCategory.FLOOR, description: 'Retro diner style.' },
  { id: 'floor_grass', name: 'Indoor Grass', cost: 25, category: ItemCategory.FLOOR, description: 'Touch grass inside.' },

  // DECOR (Wall)
  { id: 'poster_fish', name: 'Fish Poster', cost: 1, category: ItemCategory.DECOR, description: 'A boring picture of a fish.' },
  { id: 'window_basic', name: 'Sunny Window', cost: 5, category: ItemCategory.DECOR, description: 'Let some light in.' },
  { id: 'poster_cool', name: 'Neon Sign', cost: 15, category: ItemCategory.DECOR, description: 'Buzzing slightly.' },
  { id: 'decor_painting', name: 'Landscape', cost: 25, category: ItemCategory.DECOR, description: 'A nice view.' },

  // BED (Floor Left)
  { id: 'bed_cardboard', name: 'Cardboard Box', cost: 0, category: ItemCategory.BED, description: 'Cats actually love this.' },
  { id: 'bed_cushion', name: 'Blue Cushion', cost: 8, category: ItemCategory.BED, description: 'Soft and comfy.' },
  { id: 'bed_tent', name: 'Cat Tent', cost: 15, category: ItemCategory.BED, description: 'A private hideout.' },
  { id: 'bed_royal', name: 'Royal Throne', cost: 50, category: ItemCategory.BED, description: 'Fit for a king.' },

  // RUG (Floor Center)
  { id: 'rug_welcome', name: 'Welcome Mat', cost: 3, category: ItemCategory.RUG, description: 'Wipe your paws.' },
  { id: 'rug_round', name: 'Round Rug', cost: 8, category: ItemCategory.RUG, description: 'Soft on the beans.' },
  { id: 'rug_persian', name: 'Fancy Rug', cost: 12, category: ItemCategory.RUG, description: 'Really ties the room together.' },

  // PLANT (Floor Right)
  { id: 'plant_potted', name: 'Potted Plant', cost: 4, category: ItemCategory.PLANT, description: 'Please do not eat.' },
  { id: 'plant_cactus', name: 'Cactus', cost: 10, category: ItemCategory.PLANT, description: 'Spiky friend.' },
  { id: 'plant_tree', name: 'Cat Tree', cost: 20, category: ItemCategory.PLANT, description: 'Scratch heaven.' },
  
  { id: 'toy_ball', name: 'Yarn Ball', cost: 5, category: ItemCategory.PLANT, description: 'Endless fun.' },
];

interface VisualDef {
  viewBox: string;
  width: string;
  height: string;
  children: React.ReactNode;
}

const getVisualDef = (itemId: string): VisualDef | null => {
  switch (itemId) {
    // --- DECOR ---
    case 'poster_fish':
      return {
        viewBox: "0 0 20 25",
        width: "60", height: "80",
        children: React.createElement(React.Fragment, null,
          React.createElement('rect', { width: "20", height: "25", fill: "#e2e8f0", stroke: "#475569", strokeWidth: "1" }),
          React.createElement('path', { d: "M5 12 L15 12 M10 8 L10 16", stroke: "#94a3b8", strokeWidth: "2" }),
          React.createElement('rect', { x: "6", y: "10", width: "8", height: "5", fill: "#60a5fa" })
        )
      };
    case 'window_basic':
      return {
        viewBox: "0 0 30 30",
        width: "120", height: "120",
        children: React.createElement(React.Fragment, null,
          React.createElement('rect', { width: "30", height: "30", fill: "#bfdbfe", stroke: "#1e293b", strokeWidth: "2" }),
          React.createElement('line', { x1: "15", y1: "0", x2: "15", y2: "30", stroke: "#1e293b", strokeWidth: "2" }),
          React.createElement('line', { x1: "0", y1: "15", x2: "30", y2: "15", stroke: "#1e293b", strokeWidth: "2" }),
          React.createElement('rect', { x: "0", y: "28", width: "30", height: "2", fill: "#fff" })
        )
      };
    case 'poster_cool':
      return {
        viewBox: "0 0 20 20",
        width: "80", height: "80",
        children: React.createElement(React.Fragment, null,
          React.createElement('rect', { width: "20", height: "20", fill: "#171717", stroke: "#ec4899", strokeWidth: "2" }),
          React.createElement('path', { d: "M5 10 L10 5 L15 10", fill: "none", stroke: "#ec4899" }),
          React.createElement('circle', { cx: "10", cy: "15", r: "2", fill: "#ec4899" })
        )
      };
    case 'decor_painting':
      return {
        viewBox: "0 0 40 25",
        width: "100", height: "70",
        children: React.createElement(React.Fragment, null,
          React.createElement('rect', { width: "40", height: "25", fill: "#fcd34d", stroke: "#78350f", strokeWidth: "2" }),
          React.createElement('rect', { x: "2", y: "2", width: "36", height: "21", fill: "#60a5fa" }),
          React.createElement('path', { d: "M2 23 L15 10 L25 18 L40 8 L40 23 Z", fill: "#166534" }),
          React.createElement('circle', { cx: "30", cy: "8", r: "3", fill: "#fbbf24" })
        )
      };

    // --- BEDS ---
    case 'bed_cardboard':
      return {
        viewBox: "0 0 40 20",
        width: "160", height: "80",
        children: React.createElement(React.Fragment, null,
          React.createElement('rect', { x: "0", y: "5", width: "40", height: "15", fill: "#d97706", stroke: "#92400e" }),
          React.createElement('rect', { x: "5", y: "8", width: "30", height: "12", fill: "#78350f", opacity: "0.3" }),
          React.createElement('text', { x: "8", y: "16", fontSize: "4", fontFamily: "monospace", fill: "#78350f" }, "FRAGILE")
        )
      };
    case 'bed_cushion':
      return {
        viewBox: "0 0 35 15",
        width: "140", height: "60",
        children: React.createElement(React.Fragment, null,
          React.createElement('ellipse', { cx: "17.5", cy: "8", rx: "17", ry: "7", fill: "#1e3a8a" }),
          React.createElement('ellipse', { cx: "17.5", cy: "7", rx: "17", ry: "7", fill: "#3b82f6" }),
          React.createElement('ellipse', { cx: "17.5", cy: "6", rx: "14", ry: "5", fill: "#60a5fa" })
        )
      };
    case 'bed_tent':
      return {
        viewBox: "0 0 35 30",
        width: "140", height: "120",
        children: React.createElement(React.Fragment, null,
          React.createElement('path', { d: "M17.5 2 L33 28 L2 28 Z", fill: "#fca5a5" }),
          React.createElement('path', { d: "M17.5 2 L22 28 M17.5 2 L13 28", stroke: "#b91c1c", strokeWidth: "0.5" }),
          React.createElement('path', { d: "M17.5 8 L25 28 L10 28 Z", fill: "#1f2937" })
        )
      };
    case 'bed_royal':
      return {
        viewBox: "0 0 40 30",
        width: "160", height: "120",
        children: React.createElement(React.Fragment, null,
          React.createElement('path', { d: "M5 25 L35 25 L35 10 L5 10 Z", fill: "#dc2626" }),
          React.createElement('path', { d: "M5 10 L5 2 L35 2 L35 10", fill: "none", stroke: "#fbbf24", strokeWidth: "3" }),
          React.createElement('rect', { x: "0", y: "25", width: "40", height: "5", fill: "#fbbf24" }),
          React.createElement('circle', { cx: "5", cy: "2", r: "2", fill: "#fbbf24" }),
          React.createElement('circle', { cx: "35", cy: "2", r: "2", fill: "#fbbf24" })
        )
      };

    // --- RUGS ---
    case 'rug_welcome':
      return {
        viewBox: "0 0 40 20",
        width: "160", height: "80",
        children: React.createElement(React.Fragment, null,
          React.createElement('rect', { x: "2", y: "2", width: "36", height: "16", fill: "#a8a29e", stroke: "#44403c" }),
          React.createElement('rect', { x: "4", y: "4", width: "32", height: "12", fill: "none", stroke: "#44403c", strokeDasharray: "2 1" }),
          React.createElement('text', { x: "10", y: "13", fontSize: "5", fontFamily: "monospace", fill: "#44403c", fontWeight: "bold" }, "WIPE")
        )
      };
    case 'rug_round':
      return {
        viewBox: "0 0 40 20",
        width: "180", height: "100",
        children: React.createElement(React.Fragment, null,
          React.createElement('ellipse', { cx: "20", cy: "10", rx: "19", ry: "9", fill: "#f472b6", stroke: "#be185d" }),
          React.createElement('ellipse', { cx: "20", cy: "10", rx: "14", ry: "6", fill: "#fbcfe8", stroke: "#be185d", strokeDasharray: "2 2" })
        )
      };
    case 'rug_persian':
      return {
        viewBox: "0 0 50 25",
        width: "200", height: "100",
        children: React.createElement(React.Fragment, null,
          React.createElement('rect', { x: "0", y: "0", width: "50", height: "25", fill: "#7f1d1d" }),
          React.createElement('rect', { x: "3", y: "3", width: "44", height: "19", fill: "#b91c1c", stroke: "#fbbf24" }),
          React.createElement('circle', { cx: "25", cy: "12.5", r: "5", fill: "#fbbf24", stroke: "#7f1d1d", strokeWidth: "0.5" }),
          React.createElement('path', { d: "M5 3 L5 22 M45 3 L45 22", stroke: "#fbbf24", strokeWidth: "1", strokeDasharray: "1 1" })
        )
      };

    // --- PLANTS ---
    case 'plant_potted':
      return {
        viewBox: "0 0 20 30",
        width: "60", height: "90",
        children: React.createElement(React.Fragment, null,
          React.createElement('rect', { x: "5", y: "20", width: "10", height: "10", fill: "#ea580c" }),
          React.createElement('path', { d: "M10 20 L10 10 M10 15 L5 5 M10 12 L15 5", stroke: "#166534", strokeWidth: "2" }),
          React.createElement('circle', { cx: "5", cy: "5", r: "3", fill: "#22c55e" }),
          React.createElement('circle', { cx: "15", cy: "5", r: "3", fill: "#22c55e" }),
          React.createElement('circle', { cx: "10", cy: "8", r: "3", fill: "#22c55e" })
        )
      };
    case 'plant_cactus':
      return {
        viewBox: "0 0 20 30",
        width: "70", height: "90",
        children: React.createElement(React.Fragment, null,
          React.createElement('rect', { x: "6", y: "22", width: "8", height: "8", fill: "#78350f" }),
          React.createElement('rect', { x: "8", y: "5", width: "4", height: "20", fill: "#15803d", rx: "2" }),
          React.createElement('rect', { x: "4", y: "10", width: "4", height: "2", fill: "#15803d" }),
          React.createElement('rect', { x: "4", y: "7", width: "2", height: "5", fill: "#15803d" }),
          React.createElement('rect', { x: "12", y: "12", width: "4", height: "2", fill: "#15803d" }),
          React.createElement('rect', { x: "14", y: "9", width: "2", height: "5", fill: "#15803d" })
        )
      };
    case 'plant_tree':
      return {
        viewBox: "0 0 30 50",
        width: "100", height: "160",
        children: React.createElement(React.Fragment, null,
          React.createElement('rect', { x: "8", y: "45", width: "14", height: "5", fill: "#a8a29e" }),
          React.createElement('rect', { x: "13", y: "10", width: "4", height: "35", fill: "#d97706" }),
          React.createElement('rect', { x: "5", y: "20", width: "10", height: "3", fill: "#d97706", rx: "1" }),
          React.createElement('rect', { x: "15", y: "35", width: "10", height: "3", fill: "#d97706", rx: "1" })
        )
      };
    case 'toy_ball':
      return {
        viewBox: "0 0 20 20",
        width: "50", height: "50",
        children: React.createElement(React.Fragment, null,
          React.createElement('circle', { cx: "10", cy: "10", r: "8", fill: "#ef4444" }),
          React.createElement('path', { d: "M6 6 Q10 10 14 14 M6 14 Q10 10 14 6", stroke: "#b91c1c", strokeWidth: "1" })
        )
      };

    default:
      return null;
  }
};

// For Placing in Room (Large, specific scale)
export const renderItemVisual = (itemId: string) => {
  const def = getVisualDef(itemId);
  if (!def) return null;

  return React.createElement('svg', { 
    width: def.width, 
    height: def.height, 
    viewBox: def.viewBox 
  }, def.children);
};

// For Shop Icon (Responsive, fits container)
export const renderShopItemVisual = (itemId: string) => {
  // Handle Skins separately for preview
  if (SKIN_DEFINITIONS[itemId]) {
    const s = SKIN_DEFINITIONS[itemId];
    return React.createElement('svg', { width: "100%", height: "100%", viewBox: "0 0 16 16" },
      React.createElement('rect', { x: 2, y: 3, width: 8, height: 8, fill: s.body }),
      React.createElement('rect', { x: 2, y: 1, width: 1, height: 1, fill: s.dark }),
      React.createElement('rect', { x: 9, y: 2, width: 1, height: 1, fill: s.dark }),
      React.createElement('rect', { x: 3, y: 5, width: 1, height: 2, fill: s.eye }),
      React.createElement('rect', { x: 8, y: 5, width: 1, height: 2, fill: s.eye }),
      React.createElement('rect', { x: 2, y: 7, width: 1, height: 1, fill: s.cheek }),
      React.createElement('rect', { x: 9, y: 7, width: 1, height: 1, fill: s.cheek })
    );
  }

  // Handle Room Styles for preview
  if (ROOM_STYLES[itemId]) {
     const st = ROOM_STYLES[itemId];
     return React.createElement('div', { 
       style: { 
           width: '100%', height: '100%', 
           backgroundColor: st.bg, 
           backgroundImage: st.pattern, 
           backgroundSize: st.size || 'auto',
           borderRadius: '8px'
       } 
     });
  }

  const def = getVisualDef(itemId);
  if (!def) return null;

  return React.createElement('svg', { 
    width: "100%", 
    height: "100%", 
    viewBox: def.viewBox,
    style: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }
  }, def.children);
};
