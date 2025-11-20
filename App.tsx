
import React, { useState, useEffect } from 'react';
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
  x: number; // relative to food center
  y: number;
  tx: string; // translate x css var
  ty: string; // translate y css var
  color: string;
}

const App: React.FC = () => {
  // App State
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  
  // Economy & Inventory State
  const [coins, setCoins] = useState<number>(5); // Start with some coins
  const [inventory, setInventory] = useState<string[]>(['bed_cardboard']); // Start with a box
  const [equipped, setEquipped] = useState<EquippedItems>({
    [ItemCategory.BED]: 'bed_cardboard'
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

  // Animation States
  const [catX, setCatX] = useState<number>(0);
  const [catDirection, setCatDirection] = useState<number>(1);
  const [isHopping, setIsHopping] = useState<boolean>(false);
  const [food, setFood] = useState<{ visible: boolean; x: number; y: number }>({ visible: false, x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);

  // Timer for stats decay
  useEffect(() => {
    if (mode === AppMode.GAME) return; // Pause decay during game

    const timer = setInterval(() => {
      setStats(prev => {
        // Warn if stats get critical
        const newHunger = Math.max(0, prev.hunger - HUNGER_DECAY);
        const newHappiness = Math.max(0, prev.happiness - HAPPINESS_DECAY);
        const newEnergy = Math.max(0, prev.energy - (prev.energy > 20 ? ENERGY_DECAY : 0)); // Sleep protects energy
        
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
    if (isAnimating) return; // Don't override animation moods

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

  // Generate thoughts periodically
  useEffect(() => {
    if (mode === AppMode.GAME) return;
    if (isAnimating) return;
    if (showShop) return;

    const shouldTalk = Math.random() > 0.9; // Less frequent
    
    if (shouldTalk && !showThought) {
      const fetchThought = async () => {
        const newThought = await generateCatThought(stats);
        setThought(newThought);
        setShowThought(true);
        setTimeout(() => setShowThought(false), 4000);
      };
      fetchThought();
    }
  }, [stats.hunger, stats.happiness, mode, isAnimating, showThought, stats, showShop]);

  const handlePet = () => {
    // If doing an uninterruptible animation (like eating), ignore unless it's sleeping (which we can wake from)
    if (isAnimating && mood !== CatMood.SLEEPING) return;

    if (mood === CatMood.SLEEPING) {
      setIsAnimating(false);
      setMood(CatMood.NEUTRAL);
      setThought("Yawn...");
      setShowThought(true);
      setTimeout(() => setShowThought(false), 2000);
      return;
    }

    // Petting logic
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
    
    // 1. Decide where food drops
    const randomOffset = Math.random() > 0.5 ? 150 : -150;
    let foodTargetX = catX + randomOffset;
    if (foodTargetX > 250) foodTargetX = 250;
    if (foodTargetX < -250) foodTargetX = -250;

    // 2. Spawn Food
    setFood({ visible: true, x: foodTargetX, y: 0 });

    // 3. Move Cat to Food
    setTimeout(() => {
        const distance = foodTargetX - catX;
        const direction = distance > 0 ? 1 : -1;
        const targetCatX = foodTargetX - (60 * direction);
        
        setCatDirection(direction);
        setCatX(targetCatX);
        
        // 4. Start Eating
        setTimeout(() => {
            setMood(CatMood.EATING);
            const eatInterval = setInterval(() => {
                setStats(prev => ({ ...prev, hunger: Math.min(MAX_STAT, prev.hunger + 2) }));
                spawnCrumbs(foodTargetX);
            }, 200);

            // 5. Finish Eating
            setTimeout(() => {
                clearInterval(eatInterval);
                setFood({ visible: false, x: 0, y: 0 });
                setMood(CatMood.HAPPY);
                setThought("Yummy!");
                setShowThought(true);
                
                setTimeout(() => {
                    setShowThought(false);
                    setIsAnimating(false);
                }, 1000);

            }, 2000);

        }, 1000);
    }, 400);
  };

  const spawnCrumbs = (originX: number) => {
      const id = Date.now() + Math.random();
      const angle = Math.random() * Math.PI;
      const velocity = 50 + Math.random() * 50;
      const tx = (Math.cos(angle) * velocity) + 'px';
      const ty = (-Math.sin(angle) * velocity) + 'px';
      const color = Math.random() > 0.5 ? '#fbbf24' : '#60a5fa';

      setParticles(prev => [...prev, { id, x: originX, y: 20, tx, ty, color }]);
      setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 800);
  };

  const handleSleep = () => {
    setIsAnimating(true);
    setMood(CatMood.SLEEPING);
    
    // Move cat to bed if one exists? 
    // For now, just sleep in place or maybe reset to 0 (center)
    // setCatX(0);

    setStats(prev => ({ ...prev, energy: Math.min(MAX_STAT, prev.energy + 30) }));
    
    setTimeout(() => {
        setIsAnimating(false);
    }, 3000);
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
    // Calculate coins earned: 1 coin per 100 points
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

  // --- Shop Handlers ---

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

        {/* Cat Area - Positioned absolutely within the room */}
        {/* Adjusted from 35% to 20% to bring cat closer to floor center */}
        <div className="absolute bottom-[20%] left-1/2 w-0 h-0 visible z-10">
             
             {/* Food Item */}
             <FoodItem x={food.x} y={food.y} visible={food.visible} />

             {/* Particles */}
             {particles.map(p => (
                 <div 
                    key={p.id}
                    className="absolute w-2 h-2 rounded-sm animate-crumb"
                    style={{
                        backgroundColor: p.color,
                        left: `calc(-50% + ${p.x}px)`,
                        bottom: p.y,
                        '--tx': p.tx,
                        '--ty': p.ty
                    } as React.CSSProperties}
                 />
             ))}

             {/* Cat Container */}
             <div 
                className="absolute bottom-0 flex flex-col items-center transition-transform duration-1000 ease-in-out"
                style={{ 
                    transform: `translateX(calc(-50% + ${catX}px))`,
                    zIndex: 20
                }}
             >
                <ChatBubble text={thought} visible={showThought} />
                
                <div 
                    onClick={handlePet}
                    className={mood === CatMood.SLEEPING ? 'opacity-90' : 'cursor-pointer'}
                >
                    <PixelCat mood={mood} direction={catDirection} isJumping={isHopping} />
                </div>
                
                {/* Shadow */}
                <div className="w-24 h-3 bg-black/40 rounded-[100%] mt-[-10px] blur-sm z-[-1]" />
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
