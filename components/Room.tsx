
import React from 'react';
import { EquippedItems, ItemCategory } from '../types';
import { renderItemVisual } from '../data/items';

interface RoomProps {
  equipped: EquippedItems;
}

const Room: React.FC<RoomProps> = ({ equipped }) => {
  return (
    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
      {/* Wall (Top 65%) */}
      <div className="absolute top-0 left-0 w-full h-[65%] bg-[#334155] border-b-4 border-black/20">
         {/* Pattern on wall */}
         <div className="w-full h-full opacity-5" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

         {/* Decor: Center-Right on Wall */}
         {equipped[ItemCategory.DECOR] && (
            <div 
              className="absolute top-16 left-1/2 opacity-100 shadow-md transition-transform"
              style={{ transform: 'translateX(calc(-50% + 200px))' }}
            >
                {renderItemVisual(equipped[ItemCategory.DECOR]!)}
            </div>
         )}
      </div>

      {/* Floor (Bottom 35%) */}
      <div className="absolute bottom-0 left-0 w-full h-[35%] bg-[#475569]">
          {/* Floorboards */}
          <div className="w-full h-full opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 48px, #000 48px, #000 50px)' }}></div>

          {/* Rug: Center Floor */}
          {equipped[ItemCategory.RUG] && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-90 z-0">
                {renderItemVisual(equipped[ItemCategory.RUG]!)}
            </div>
          )}

          {/* Bed: Left Floor (Centered at -280px) */}
          {equipped[ItemCategory.BED] && (
            <div 
              className="absolute bottom-12 left-1/2 opacity-100 drop-shadow-lg z-10 transition-transform"
              style={{ transform: 'translateX(calc(-50% - 280px))' }}
            >
                {renderItemVisual(equipped[ItemCategory.BED]!)}
            </div>
          )}

          {/* Plant: Right Floor (Centered at +280px) */}
          {equipped[ItemCategory.PLANT] && (
            <div 
              className="absolute bottom-12 left-1/2 opacity-100 drop-shadow-lg z-20 transition-transform"
              style={{ transform: 'translateX(calc(-50% + 280px))' }}
            >
                 {renderItemVisual(equipped[ItemCategory.PLANT]!)}
            </div>
          )}
      </div>
    </div>
  );
};

export default Room;
