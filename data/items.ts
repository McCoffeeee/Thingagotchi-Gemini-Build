
import React from 'react';
import { ItemCategory, ShopItem } from '../types';

export const ITEMS: ShopItem[] = [
  // --- DECOR (Wall) ---
  { id: 'poster_fish', name: 'Fish Poster', cost: 1, category: ItemCategory.DECOR, description: 'A boring picture of a fish.' },
  { id: 'window_basic', name: 'Small Window', cost: 5, category: ItemCategory.DECOR, description: 'Let some light in.' },
  { id: 'poster_cool', name: 'Neon Sign', cost: 15, category: ItemCategory.DECOR, description: 'Buzzing slightly.' },

  // --- BED (Floor Left) ---
  { id: 'bed_cardboard', name: 'Cardboard Box', cost: 2, category: ItemCategory.BED, description: 'Cats actually love this.' },
  { id: 'bed_cushion', name: 'Blue Cushion', cost: 8, category: ItemCategory.BED, description: 'Soft and comfy.' },
  { id: 'bed_royal', name: 'Royal Throne', cost: 50, category: ItemCategory.BED, description: 'Fit for a king.' },

  // --- RUG (Floor Center) ---
  { id: 'rug_welcome', name: 'Welcome Mat', cost: 3, category: ItemCategory.RUG, description: 'Wipe your paws.' },
  { id: 'rug_persian', name: 'Fancy Rug', cost: 12, category: ItemCategory.RUG, description: 'Really ties the room together.' },

  // --- PLANT (Floor Right) ---
  { id: 'plant_potted', name: 'Potted Plant', cost: 4, category: ItemCategory.PLANT, description: 'Please do not eat.' },
  { id: 'plant_tree', name: 'Cat Tree', cost: 20, category: ItemCategory.PLANT, description: 'Scratch heaven.' },
];

// Helper to render the item visuals
// Fix: Converted JSX to React.createElement because this file is .ts, not .tsx
export const renderItemVisual = (itemId: string) => {
  switch (itemId) {
    case 'poster_fish':
      return React.createElement('svg', { width: "40", height: "50", viewBox: "0 0 20 25" },
        React.createElement('rect', { width: "20", height: "25", fill: "#e2e8f0", stroke: "#475569", strokeWidth: "1" }),
        React.createElement('path', { d: "M5 12 L15 12 M10 8 L10 16", stroke: "#94a3b8", strokeWidth: "2" }),
        React.createElement('rect', { x: "6", y: "10", width: "8", height: "5", fill: "#60a5fa" })
      );
    case 'window_basic':
      return React.createElement('svg', { width: "60", height: "60", viewBox: "0 0 30 30" },
        React.createElement('rect', { width: "30", height: "30", fill: "#bfdbfe", stroke: "#1e293b", strokeWidth: "2" }),
        React.createElement('line', { x1: "15", y1: "0", x2: "15", y2: "30", stroke: "#1e293b", strokeWidth: "2" }),
        React.createElement('line', { x1: "0", y1: "15", x2: "30", y2: "15", stroke: "#1e293b", strokeWidth: "2" })
      );
    case 'poster_cool':
      return React.createElement('svg', { width: "40", height: "40", viewBox: "0 0 20 20" },
        React.createElement('rect', { width: "20", height: "20", fill: "#171717", stroke: "#ec4899", strokeWidth: "2" }),
        React.createElement('path', { d: "M5 10 L10 5 L15 10", fill: "none", stroke: "#ec4899" })
      );
    
    // Beds
    case 'bed_cardboard':
      return React.createElement('svg', { width: "80", height: "40", viewBox: "0 0 40 20" },
        React.createElement('rect', { x: "0", y: "5", width: "40", height: "15", fill: "#d97706", stroke: "#92400e" }),
        React.createElement('rect', { x: "5", y: "8", width: "30", height: "12", fill: "#78350f", opacity: "0.3" }),
        React.createElement('text', { x: "10", y: "16", fontSize: "4", fontFamily: "monospace", fill: "#78350f" }, "THIS SIDE UP")
      );
    case 'bed_cushion':
      return React.createElement('svg', { width: "70", height: "30", viewBox: "0 0 35 15" },
        React.createElement('ellipse', { cx: "17.5", cy: "7.5", rx: "17", ry: "7", fill: "#3b82f6", stroke: "#1e3a8a" }),
        React.createElement('ellipse', { cx: "17.5", cy: "6", rx: "14", ry: "5", fill: "#60a5fa" })
      );
    case 'bed_royal':
        return React.createElement('svg', { width: "80", height: "60", viewBox: "0 0 40 30" },
            React.createElement('path', { d: "M5 25 L35 25 L35 15 L5 15 Z", fill: "#dc2626" }),
            React.createElement('path', { d: "M5 15 L5 5 L35 5 L35 15", fill: "none", stroke: "#fbbf24", strokeWidth: "3" }),
            React.createElement('rect', { x: "0", y: "25", width: "40", height: "5", fill: "#fbbf24" })
        );

    // Rugs
    case 'rug_welcome':
      return React.createElement('svg', { width: "80", height: "40", viewBox: "0 0 40 20" },
           React.createElement('rect', { x: "2", y: "2", width: "36", height: "16", fill: "#a8a29e", stroke: "#44403c" }),
           React.createElement('text', { x: "8", y: "12", fontSize: "4", fontFamily: "monospace", fill: "#44403c" }, "MEOW")
      );
    case 'rug_persian':
       return React.createElement('svg', { width: "100", height: "50", viewBox: "0 0 50 25" },
            React.createElement('rect', { x: "0", y: "0", width: "50", height: "25", fill: "#7f1d1d" }),
            React.createElement('rect', { x: "5", y: "5", width: "40", height: "15", fill: "#b91c1c", stroke: "#fbbf24" }),
            React.createElement('circle', { cx: "25", cy: "12.5", r: "4", fill: "#fbbf24" })
       );

    // Plants
    case 'plant_potted':
      return React.createElement('svg', { width: "40", height: "60", viewBox: "0 0 20 30" },
           React.createElement('rect', { x: "5", y: "20", width: "10", height: "10", fill: "#ea580c" }),
           React.createElement('path', { d: "M10 20 L10 10 M10 15 L5 5 M10 12 L15 5", stroke: "#166534", strokeWidth: "2" }),
           React.createElement('circle', { cx: "5", cy: "5", r: "2", fill: "#22c55e" }),
           React.createElement('circle', { cx: "15", cy: "5", r: "2", fill: "#22c55e" }),
           React.createElement('circle', { cx: "10", cy: "8", r: "2", fill: "#22c55e" })
      );
    case 'plant_tree':
      return React.createElement('svg', { width: "60", height: "100", viewBox: "0 0 30 50" },
            React.createElement('rect', { x: "12", y: "45", width: "6", height: "5", fill: "#a8a29e" }),
            React.createElement('rect', { x: "13", y: "10", width: "4", height: "35", fill: "#d97706" }),
            React.createElement('rect', { x: "5", y: "20", width: "10", height: "2", fill: "#d97706" }),
            React.createElement('rect', { x: "15", y: "35", width: "10", height: "2", fill: "#d97706" })
      );
    
    default:
      return null;
  }
};
