import React from 'react';
import { CatMood } from '../types';

interface PixelCatProps {
  mood: CatMood;
  isJumping?: boolean;
  isWalking?: boolean;
  direction?: number; // 1 for right, -1 for left
}

const PixelCat: React.FC<PixelCatProps> = ({ mood, isJumping = false, isWalking = false, direction = 1 }) => {
  // Simple SVG pixel art construction
  
  // Colors
  const bodyColor = "#fbbf24"; // Amber-400
  const darkColor = "#b45309"; // Amber-700
  const eyeColor = "#1e293b"; // Slate-800
  const cheekColor = "#f472b6"; // Pink-400

  // Offset for jumping animation
  const jumpOffset = isJumping ? -20 : 0;

  // Animation Classes
  const getAnimationClass = () => {
    if (isJumping) return "";
    if (isWalking) return "animate-pixel-walk";
    
    switch (mood) {
      case CatMood.EATING:
        return "animate-pixel-eat";
      case CatMood.SLEEPING:
        return ""; // Sleeping is static body with animated Zzz
      case CatMood.HAPPY:
      case CatMood.NEUTRAL:
      case CatMood.SAD:
      default:
        return "animate-pixel-bounce";
    }
  };

  const getFace = () => {
    switch (mood) {
      case CatMood.SLEEPING:
        return (
          <g>
             {/* Closed Eyes */}
             <rect x="3" y="5" width="2" height="1" fill={eyeColor} />
             <rect x="7" y="5" width="2" height="1" fill={eyeColor} />
          </g>
        );
      case CatMood.SAD:
        return (
          <g>
            {/* Sad Eyes */}
            <rect x="3" y="5" width="1" height="1" fill={eyeColor} />
            <rect x="8" y="5" width="1" height="1" fill={eyeColor} />
            {/* Frown */}
            <rect x="5" y="8" width="2" height="1" fill={eyeColor} />
            <rect x="4" y="9" width="1" height="1" fill={eyeColor} />
            <rect x="7" y="9" width="1" height="1" fill={eyeColor} />
          </g>
        );
      case CatMood.EATING:
        return (
          <g>
             {/* Chewing Eyes Closed */}
             <rect x="3" y="5" width="2" height="1" fill={eyeColor} />
             <rect x="7" y="5" width="2" height="1" fill={eyeColor} />
             {/* Mouth Open */}
             <rect x="5" y="8" width="2" height="2" fill={eyeColor} />
          </g>
        );
      case CatMood.HAPPY:
      default:
        return (
          <g>
            {/* Eyes */}
            <rect x="3" y="5" width="1" height="2" fill={eyeColor} />
            <rect x="8" y="5" width="1" height="2" fill={eyeColor} />
            {/* Smile */}
            <rect x="5" y="8" width="2" height="1" fill={eyeColor} />
            <rect x="4" y="7" width="1" height="1" fill={eyeColor} />
            <rect x="7" y="7" width="1" height="1" fill={eyeColor} />
            {/* Cheeks */}
            <rect x="2" y="7" width="1" height="1" fill={cheekColor} />
            <rect x="9" y="7" width="1" height="1" fill={cheekColor} />
          </g>
        );
    }
  };

  return (
    <div className="relative">
      {/* Zzz Animation for Sleeping */}
      {mood === CatMood.SLEEPING && (
        <div className="absolute -top-8 right-0 animate-float">
           <span className="font-mono text-white text-xl">Zzz...</span>
        </div>
      )}

      <svg 
        width="160" 
        height="160" 
        viewBox="0 0 16 16" 
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-transform duration-200 ${isJumping ? '-translate-y-8' : ''} ${getAnimationClass()}`}
        style={{ 
          transform: `${isJumping ? `translateY(${jumpOffset}px)` : ''} scaleX(${direction})` 
        }}
      >
        <g shapeRendering="crispEdges">
          {/* Tail - Wags slightly in idle if we wanted, but sticking to body bounce */}
          <rect x="11" y="8" width="1" height="1" fill={darkColor} />
          <rect x="12" y="7" width="1" height="2" fill={darkColor} />
          <rect x="13" y="6" width="1" height="2" fill={darkColor} />

          {/* Ears */}
          <rect x="2" y="1" width="1" height="1" fill={darkColor} />
          <rect x="3" y="2" width="1" height="1" fill={darkColor} />
          <rect x="8" y="1" width="1" height="1" fill={darkColor} />
          <rect x="9" y="2" width="1" height="1" fill={darkColor} />

          {/* Body Base */}
          <rect x="2" y="3" width="8" height="8" fill={bodyColor} />
          <rect x="3" y="11" width="6" height="1" fill={bodyColor} />
          
          {/* Legs */}
          <rect x="3" y="12" width="1" height="1" fill={darkColor} />
          <rect x="8" y="12" width="1" height="1" fill={darkColor} />

          {/* Face Content */}
          {getFace()}
        </g>
      </svg>
    </div>
  );
};

export default PixelCat;