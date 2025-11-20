import React from 'react';

interface FoodItemProps {
  x: number;
  y: number;
  visible: boolean;
}

const FoodItem: React.FC<FoodItemProps> = ({ x, y, visible }) => {
  if (!visible) return null;

  // Pixel art fish colors
  const fishBody = "#60a5fa"; // Blue-400
  const fishDark = "#1e40af"; // Blue-800
  const fishEye = "#ffffff";

  return (
    <div 
      className="absolute z-0"
      style={{ 
        left: '50%', 
        bottom: '0',
        transform: `translate(calc(-50% + ${x}px), ${-y}px)`,
        transition: y > 0 ? 'none' : 'transform 0.1s' // Snap when on ground, otherwise let animation handle it? Actually App handles Y
      }}
    >
      <div className="animate-drop-bounce">
        <svg width="32" height="32" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <g shapeRendering="crispEdges">
             {/* Tail */}
             <rect x="1" y="7" width="2" height="2" fill={fishDark} />
             {/* Body */}
             <rect x="3" y="6" width="8" height="4" fill={fishBody} />
             <rect x="4" y="5" width="6" height="1" fill={fishBody} />
             <rect x="4" y="10" width="6" height="1" fill={fishBody} />
             {/* Fins */}
             <rect x="6" y="4" width="2" height="1" fill={fishDark} />
             <rect x="6" y="11" width="2" height="1" fill={fishDark} />
             <rect x="9" y="8" width="2" height="1" fill={fishDark} />
             {/* Head */}
             <rect x="11" y="7" width="2" height="2" fill={fishBody} />
             {/* Eye */}
             <rect x="12" y="7" width="1" height="1" fill={fishEye} />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default FoodItem;