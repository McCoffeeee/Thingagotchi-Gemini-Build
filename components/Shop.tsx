
import React, { useState } from 'react';
import { ITEMS, renderShopItemVisual } from '../data/items';
import { EquippedItems, ItemCategory } from '../types';

interface ShopProps {
  coins: number;
  inventory: string[];
  equipped: EquippedItems;
  onClose: () => void;
  onBuy: (itemId: string, cost: number) => void;
  onEquip: (itemId: string, category: any) => void;
}

type Tab = 'ALL' | 'CAT' | 'ROOM' | 'FURNITURE';

const Shop: React.FC<ShopProps> = ({ coins, inventory, equipped, onClose, onBuy, onEquip }) => {
  const [activeTab, setActiveTab] = useState<Tab>('ALL');
  
  const isOwned = (id: string) => inventory.includes(id);
  const isEquipped = (id: string, cat: any) => equipped[cat] === id;

  const filteredItems = ITEMS.filter(item => {
      if (activeTab === 'ALL') return true;
      if (activeTab === 'CAT') return item.category === ItemCategory.SKIN;
      if (activeTab === 'ROOM') return item.category === ItemCategory.WALLPAPER || item.category === ItemCategory.FLOOR;
      if (activeTab === 'FURNITURE') {
          return item.category === ItemCategory.BED || 
                 item.category === ItemCategory.RUG || 
                 item.category === ItemCategory.DECOR || 
                 item.category === ItemCategory.PLANT;
      }
      return true;
  });

  return (
    <div className="absolute inset-0 z-[200] bg-gray-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-6">
      
      <div className="w-full max-w-4xl bg-[#1a1b26] border-4 border-gray-700 rounded-xl shadow-2xl flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="p-4 border-b-4 border-gray-700 bg-gray-800 rounded-t-lg">
            <div className="flex justify-between items-center mb-4">
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

            {/* Tabs */}
            <div className="flex gap-2">
                {['ALL', 'CAT', 'ROOM', 'FURNITURE'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as Tab)}
                        className={`px-4 py-2 rounded-t-lg font-pixel text-xs tracking-wider transition-colors ${
                            activeTab === tab 
                            ? 'bg-gray-700 text-white border-t-2 border-x-2 border-gray-600' 
                            : 'bg-gray-900 text-gray-500 hover:bg-gray-800'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>

        {/* Scrollable Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 bg-gray-900/50">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                isOwned(item.id) 
                  ? 'bg-gray-800 border-gray-600' 
                  : 'bg-gray-800/50 border-gray-700 opacity-80 hover:opacity-100'
              }`}
            >
              {/* Preview */}
              <div className="w-24 h-24 flex items-center justify-center mb-2 bg-black/20 rounded-lg p-2">
                {renderShopItemVisual(item.id)}
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
