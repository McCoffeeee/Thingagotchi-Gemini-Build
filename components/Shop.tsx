
import React from 'react';
import { ITEMS, renderItemVisual } from '../data/items';
import { EquippedItems } from '../types';

interface ShopProps {
  coins: number;
  inventory: string[];
  equipped: EquippedItems;
  onClose: () => void;
  onBuy: (itemId: string, cost: number) => void;
  onEquip: (itemId: string, category: any) => void;
}

const Shop: React.FC<ShopProps> = ({ coins, inventory, equipped, onClose, onBuy, onEquip }) => {
  
  const isOwned = (id: string) => inventory.includes(id);
  const isEquipped = (id: string, cat: any) => equipped[cat] === id;

  return (
    <div className="absolute inset-0 z-50 bg-gray-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-6">
      
      <div className="w-full max-w-4xl bg-[#1a1b26] border-4 border-gray-700 rounded-xl shadow-2xl flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="p-4 border-b-4 border-gray-700 flex justify-between items-center bg-gray-800 rounded-t-lg">
          <h2 className="text-2xl font-pixel text-white">ITEM SHOP</h2>
          <div className="flex items-center gap-4">
            <div className="bg-yellow-900/50 text-yellow-400 px-4 py-1 rounded-full border border-yellow-600 font-pixel">
              COINS: {coins}
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white font-bold text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {ITEMS.map((item) => (
            <div 
              key={item.id} 
              className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                isOwned(item.id) 
                  ? 'bg-gray-800 border-gray-600' 
                  : 'bg-gray-800/50 border-gray-700 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Preview */}
              <div className="h-20 flex items-center justify-center mb-4 scale-150">
                {renderItemVisual(item.id)}
              </div>

              <div className="text-center mb-3 w-full">
                <h3 className="font-bold text-sm text-gray-200 truncate">{item.name}</h3>
                <p className="text-xs text-gray-500 italic truncate">{item.description}</p>
              </div>

              {/* Action Button */}
              {isOwned(item.id) ? (
                <button
                  onClick={() => onEquip(item.id, item.category)}
                  className={`w-full py-2 rounded font-pixel text-xs uppercase tracking-wider ${
                    isEquipped(item.id, item.category)
                      ? 'bg-green-600 text-white cursor-default'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  }`}
                  disabled={isEquipped(item.id, item.category)}
                >
                  {isEquipped(item.id, item.category) ? 'EQUIPPED' : 'EQUIP'}
                </button>
              ) : (
                <button
                  onClick={() => onBuy(item.id, item.cost)}
                  disabled={coins < item.cost}
                  className={`w-full py-2 rounded font-pixel text-xs uppercase tracking-wider flex items-center justify-center gap-2 ${
                    coins >= item.cost
                      ? 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-[0_2px_0_0_rgba(161,98,7,1)] active:translate-y-1 active:shadow-none'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>BUY</span>
                  <span className="text-yellow-200">{item.cost} ©</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
