
import React, { useState, useEffect, useRef } from 'react';
import { AppMode, CatMood, CatState, EquippedItems, ItemCategory } from './types';
import { MAX_STAT, DECAY_RATE_MS, HUNGER_DECAY, HAPPINESS_DECAY, ENERGY_DECAY } from './constants';
import StatsBar from './components/StatsBar';
import PixelCat from './components/PixelCat';
import MiniGame from './components/MiniGame';
import ChatBubble from './components/ChatBubble';
import FoodItem from './components/FoodItem';
import Room from './components/Room';
import Shop from './components/Shop';
import { generateCatThought } from './services/geminiService';

interface Particle {
  id: number;
  x: number; // relative to center
  depth: number; // y pct
  tx: string; // translate x css var
  ty: string; // translate y css var
  color: string;
}

// Depth constants
const FLOOR_MIN_PCT = 5; // Front of screen
const FLOOR_MAX_PCT = 30; // Back near wall
const SCALE_MIN = 1.2; // Front scale
const SCALE_MAX = 0.8; // Back scale

const App: React.FC = () => {
  // App State
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  
  // Economy & Inventory State
  const [coins, setCoins] = useState<number>(10); 
  
  // Initialize with default items for Room and Skin
  const [inventory, setInventory] = useState<string[]>([
      'bed_cardboard', 
      'skin_default', 
      'wall_default', 
      'floor_default'
  ]); 
  
  const [equipped, setEquipped] = useState<EquippedItems>({
    [ItemCategory.BED]: 'bed_cardboard',
    [ItemCategory.SKIN]: 'skin_default',
    [ItemCategory.WALLPAPER]: 'wall_default',
    [ItemCategory.FLOOR]: 'floor_default'
  });

  const [stats, setStats] = useState<CatState>({
    hunger: 80,
    happiness: 80,
    energy: 90,
    lastInteraction: Date.now(),
  });
  
  const [mood, setMood] = useState<CatMood>(CatMood.NEUTRAL);
  const [thought, setThought] = useState<string>("");
  const [showThought, setShowThought] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showShop, setShowShop] = useState<boolean>(false);

  // Movement & Animation States
  const [catPos, setCatPos] = useState<{ x: number; y: number }>({ x: 0, y: 15 }); // x: px offset, y: % from bottom
  const [catDirection, setCatDirection] = useState<number>(1);
  const [isHopping, setIsHopping] = useState<boolean>(false);
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [food, setFood] = useState<{ visible: boolean; x: number; y: number }>({ visible: false, x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);

  // Helpers
  const getScale = (yPct: number) => {
    // Linear interpolation: yPct from MIN(5) to MAX(30) maps to Scale from MIN(1.2) to MAX(0.8)
    const pct = (yPct - FLOOR_MIN_PCT) / (FLOOR_MAX_PCT - FLOOR_MIN_PCT);
    const scale = SCALE_MIN - (pct * (SCALE_MIN - SCALE_MAX));
    return Math.max(SCALE_MAX, Math.min(SCALE_MIN, scale));
  };

  // Calculate bed position based on equipped item
  const getBedPosition = (bedId?: string) => {
      // Base X matching Room.tsx positioning (-280px from center)
      const baseX = -280;
      
      switch (bedId) {
          case 'bed_royal':
              return { x: baseX, y: 18 }; // Sit higher on throne
          case 'bed_cardboard':
          case 'bed_tent':
              return { x: baseX, y: 15 }; // Sit slightly back inside
          case 'bed_cushion':
          default:
              return { x: baseX, y: 14 }; // Sit on top
      }
  };

  // Timer for stats decay
  useEffect(() => {
    if (mode === AppMode.GAME) return; // Pause decay during game

    const timer = setInterval(() => {
      setStats(prev => {
        const newHunger = Math.max(0, prev.hunger - HUNGER_DECAY);
        const newHappiness = Math.max(0, prev.happiness - HAPPINESS_DECAY);
        const newEnergy = Math.max(0, prev.energy - (prev.energy > 20 ? ENERGY_DECAY : 0));
        
        return {
          hunger: newHunger,
          happiness: newHappiness,
          energy: newEnergy,
          lastInteraction: prev.lastInteraction
        };
      });
    }, DECAY_RATE_MS);

    return () => clearInterval(timer);
  }, [mode]);

  // Determine mood based on stats
  useEffect(() => {
    if (isAnimating) return;

    if (stats.energy < 20) {
      setMood(CatMood.SLEEPING);
    } else if (stats.hunger < 30 || stats.happiness < 30) {
      setMood(CatMood.SAD);
    } else if (stats.happiness > 70 && stats.hunger > 70) {
      setMood(CatMood.HAPPY);
    } else {
      setMood(CatMood.NEUTRAL);
    }
  }, [stats, isAnimating]);

  // Idle Behavior: Thoughts & Random Movement
  useEffect(() => {
    if (mode === AppMode.GAME) return;
    if (isAnimating) return;
    if (showShop) return;
    if (mood === CatMood.SLEEPING) return;

    const idleInterval = setInterval(() => {
        const action = Math.random();
        
        // 20% chance to move somewhere
        if (action < 0.2) {
            const targetX = (Math.random() * 400) - 200; // -200 to 200 px
            const targetY = FLOOR_MIN_PCT + Math.random() * (FLOOR_MAX_PCT - FLOOR_MIN_PCT);
            
            setCatDirection(targetX > catPos.x ? 1 : -1);
            setIsWalking(true);
            setCatPos({ x: targetX, y: targetY });
            
            setTimeout(() => {
                setIsWalking(false);
            }, 1500);
        } 
        // 10% chance to think
        else if (action > 0.8 && !showThought) {
            const fetchThought = async () => {
                const newThought = await generateCatThought(stats);
                setThought(newThought);
                setShowThought(true);
                setTimeout(() => setShowThought(false), 4000);
            };
            fetchThought();
        }
    }, 4000);

    return () => clearInterval(idleInterval);
  }, [stats, mode, isAnimating, showThought, showShop, mood, catPos]);

  const handlePet = () => {
    if (isAnimating && mood !== CatMood.SLEEPING) return;

    if (mood === CatMood.SLEEPING) {
      setIsAnimating(false);
      setMood(CatMood.NEUTRAL);
      setThought("Yawn...");
      setShowThought(true);
      setTimeout(() => setShowThought(false), 2000);
      return;
    }

    setIsHopping(true);
    setThought("❤️"); 
    setShowThought(true);
    
    setStats(prev => ({
      ...prev,
      happiness: Math.min(MAX_STAT, prev.happiness + 5)
    }));

    setTimeout(() => {
      setIsHopping(false);
      setShowThought(false);
    }, 600);
  };

  const handleFeed = () => {
    if (stats.hunger >= 100) {
        setThought("I'm full!");
        setShowThought(true);
        setTimeout(() => setShowThought(false), 2000);
        return;
    }
    if (mood === CatMood.SLEEPING) return;

    setIsAnimating(true);
    
    // 1. Decide where food drops (Random X and Random Depth Y)
    const foodTargetX = (Math.random() * 300) - 150;
    const foodTargetY = FLOOR_MIN_PCT + Math.random() * (FLOOR_MAX_PCT - FLOOR_MIN_PCT);

    // 2. Spawn Food
    setFood({ visible: true, x: foodTargetX, y: foodTargetY });

    // 3. Move Cat to Food
    const direction = foodTargetX > catPos.x ? 1 : -1;
    const stopOffset = 40 * direction; // Stop slightly before
    
    setCatDirection(direction);
    setIsWalking(true);
    setCatPos({ x: foodTargetX - stopOffset, y: foodTargetY });

    // 3b. Arrive at food
    setTimeout(() => {
        setIsWalking(false); 
        setMood(CatMood.EATING);
        
        // 4. Start Eating
        const eatInterval = setInterval(() => {
            setStats(prev => ({ ...prev, hunger: Math.min(MAX_STAT, prev.hunger + 2) }));
            // Pass correct depth
            spawnCrumbs(foodTargetX, foodTargetY);
        }, 200);

        // 5. Finish Eating
        setTimeout(() => {
            clearInterval(eatInterval);
            setFood({ visible: false, x: 0, y: 0 });
            setMood(CatMood.HAPPY);
            setThought("Yummy!");
            setShowThought(true);
            
            // 6. Return to centerish (or stay)
            setTimeout(() => {
                setShowThought(false);
                setMood(CatMood.NEUTRAL);
                setIsAnimating(false);
            }, 1000);

        }, 2000); // Duration of eating

    }, 1500); // Duration of walk
  };

  const spawnCrumbs = (originX: number, depthPct: number) => {
      const id = Date.now() + Math.random();
      const angle = Math.random() * Math.PI;
      const velocity = 50 + Math.random() * 50;
      const tx = (Math.cos(angle) * velocity) + 'px';
      const ty = (-Math.sin(angle) * velocity) + 'px';
      const color = Math.random() > 0.5 ? '#fbbf24' : '#60a5fa';

      setParticles(prev => [...prev, { id, x: originX, depth: depthPct, tx, ty, color }]);
      setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 800);
  };

  const handleSleep = () => {
    if (mood === CatMood.SLEEPING) return;
    
    setIsAnimating(true);
    
    const bedId = equipped[ItemCategory.BED];
    const bedPos = getBedPosition(bedId);

    if (bedId) {
        // Walk to bed first
        const direction = bedPos.x > catPos.x ? 1 : -1;
        setCatDirection(direction);
        setIsWalking(true);
        setCatPos({ x: bedPos.x, y: bedPos.y });
        
        // Time to walk
        setTimeout(() => {
            setIsWalking(false);
            startSleeping();
        }, 1500);
    } else {
        // Sleep where you stand
        startSleeping();
    }
  };

  const startSleeping = () => {
    setMood(CatMood.SLEEPING);
    
    // Restore energy logic
    const sleepInterval = setInterval(() => {
        setStats(prev => {
            const newEnergy = Math.min(MAX_STAT, prev.energy + 5);
            // Wake up if full
            if (newEnergy >= 100) {
                 clearInterval(sleepInterval);
                 setTimeout(() => {
                    setMood(CatMood.NEUTRAL);
                    setIsAnimating(false);
                    setThought("I'm awake!");
                    setShowThought(true);
                    setTimeout(() => setShowThought(false), 2000);
                 }, 1000);
            }
            return { ...prev, energy: newEnergy };
        });
    }, 500);
  };

  const handlePlay = () => {
    if (stats.energy < 15) {
        setThought("Too tired...");
        setShowThought(true);
        setTimeout(() => setShowThought(false), 2000);
        return;
    }
    setMode(AppMode.GAME);
  };

  const handleGameOver = (score: number) => {
    const coinsEarned = Math.floor(score / 100);
    setCoins(prev => prev + coinsEarned);

    const reward = Math.min(40, Math.floor(score / 2));
    setStats(prev => ({
      ...prev,
      happiness: Math.min(MAX_STAT, prev.happiness + reward),
      energy: Math.max(0, prev.energy - 15),
      hunger: Math.max(0, prev.hunger - 10)
    }));
  };

  const handleBuyItem = (itemId: string, cost: number) => {
    if (coins >= cost && !inventory.includes(itemId)) {
      setCoins(prev => prev - cost);
      setInventory(prev => [...prev, itemId]);
    }
  };

  const handleEquipItem = (itemId: string, category: ItemCategory) => {
    setEquipped(prev => ({
      ...prev,
      [category]: itemId
    }));
  };

  if (mode === AppMode.GAME) {
    return (
      <div className="w-screen h-screen overflow-hidden">
        <MiniGame onGameOver={handleGameOver} onExit={() => setMode(AppMode.HOME)} />
      </div>
    );
  }

  const currentScale = getScale(catPos.y);

  return (
    <div className="w-screen h-screen bg-gray-900 flex flex-col items-center justify-between p-6 text-white overflow-hidden font-sans select-none relative">
      
      {/* Shop Modal */}
      {showShop && (
        <Shop 
          coins={coins}
          inventory={inventory}
          equipped={equipped}
          onClose={() => setShowShop(false)}
          onBuy={handleBuyItem}
          onEquip={handleEquipItem}
        />
      )}

      {/* Header / Stats */}
      <header className="w-full flex justify-center mb-4 z-20">
        <StatsBar stats={stats} />
      </header>

      {/* Main Area - The "House" */}
      <main className="flex-1 w-full relative overflow-hidden rounded-2xl border-4 border-gray-700 shadow-2xl">
        
        {/* Room Background & Furniture */}
        <Room equipped={equipped} />

        {/* Cat Area & Dynamic Objects */}
        <div className="absolute inset-0 pointer-events-none">
             
             {/* Food Item */}
             <FoodItem 
                x={food.x} 
                bottomPct={food.y} 
                visible={food.visible} 
                scale={getScale(food.y)}
             />

             {/* Particles */}
             {particles.map(p => (
                 <div 
                    key={p.id}
                    className="absolute w-2 h-2 rounded-sm animate-crumb z-10"
                    style={{
                        backgroundColor: p.color,
                        left: `calc(50% + ${p.x}px)`,
                        bottom: `${p.depth}%`, 
                        transform: `scale(${getScale(p.depth)})`, // Scale crumbs with depth
                        '--tx': p.tx,
                        '--ty': p.ty
                    } as React.CSSProperties}
                 />
             ))}

             {/* Cat Container */}
             <div 
                className="absolute flex flex-col items-center pointer-events-auto"
                style={{ 
                    left: '50%',
                    bottom: `${catPos.y}%`,
                    transform: `translateX(calc(-50% + ${catPos.x}px)) scale(${currentScale})`,
                    zIndex: Math.floor(100 - catPos.y), // Depth sorting
                    transition: 'bottom 1.5s ease-in-out, transform 1.5s ease-in-out'
                }}
             >
                <ChatBubble text={thought} visible={showThought} />
                
                <div 
                    onClick={handlePet}
                    className={`relative ${mood === CatMood.SLEEPING ? 'opacity-90' : 'cursor-pointer'}`}
                >
                    <PixelCat 
                        mood={mood} 
                        direction={catDirection} 
                        isJumping={isHopping}
                        isWalking={isWalking}
                        skinId={equipped[ItemCategory.SKIN]}
                    />
                    
                    {/* Shadow - Pinned to bottom of feet */}
                    <div className="absolute bottom-[30px] left-1/2 transform -translate-x-1/2 w-24 h-3 bg-black/40 rounded-[100%] blur-sm z-[-1]" />
                </div>
             </div>
        </div>

      </main>

      {/* Controls */}
      <footer className="w-full max-w-3xl grid grid-cols-4 gap-4 mt-4 pb-2 z-20">
        <button 
          onClick={handleFeed}
          disabled={mood === CatMood.SLEEPING || isAnimating}
          className="group relative bg-orange-600 hover:bg-orange-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_4px_0_0_rgba(154,52,18,1)] active:shadow-none active:translate-y-1 transition-all flex flex-col items-center gap-1"
        >
           <span className="text-xl group-hover:scale-110 transition-transform">🍖</span>
           <span className="font-pixel text-xs tracking-widest">FEED</span>
        </button>

        <button 
          onClick={handlePlay}
          disabled={mood === CatMood.SLEEPING || isAnimating}
          className="group relative bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_4px_0_0_rgba(55,48,163,1)] active:shadow-none active:translate-y-1 transition-all flex flex-col items-center gap-1"
        >
           <span className="text-xl group-hover:scale-110 transition-transform">🎮</span>
           <span className="font-pixel text-xs tracking-widest">PLAY</span>
        </button>

        <button 
          onClick={handleSleep}
          disabled={mood === CatMood.SLEEPING || isAnimating}
          className="group relative bg-teal-600 hover:bg-teal-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_4px_0_0_rgba(13,148,136,1)] active:shadow-none active:translate-y-1 transition-all flex flex-col items-center gap-1"
        >
           <span className="text-xl group-hover:scale-110 transition-transform">💤</span>
           <span className="font-pixel text-xs tracking-widest">NAP</span>
        </button>

        <button 
          onClick={() => setShowShop(true)}
          disabled={mood === CatMood.SLEEPING || isAnimating}
          className="group relative bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_4px_0_0_rgba(161,98,7,1)] active:shadow-none active:translate-y-1 transition-all flex flex-col items-center gap-1"
        >
           <span className="text-xl group-hover:scale-110 transition-transform">🛍️</span>
           <span className="font-pixel text-xs tracking-widest">SHOP</span>
        </button>
      </footer>
    </div>
  );
};

export default App;
