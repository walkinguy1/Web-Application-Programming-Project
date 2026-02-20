import React from 'react';
import { useCartStore } from '../store/useCartStore';

// NEW: Importing your actual photos from the assets folder
import AlishImg from '../assets/founders/alish.jpg';
import AnurodhImg from '../assets/founders/anurodh.jpg';
import NischalImg from '../assets/founders/nischal.jpg';
import TusharImg from '../assets/founders/tushar.jpg';

export default function About() {
  const { selectedCategory } = useCartStore();
  const isLiquorMode = selectedCategory === "Liquor";

  const founders = [
    {
      name: "Alish Adhikari",
      role: "The Visionary (Total Guffadi)",
      image: AlishImg,
      description: "Alish is the guy who convinced the rest of the team that 'JhyappStore' was a professional business idea. He spends 10% of his time on strategy and 90% of his time explaining why his Instagram handle is 'umm__alish'."
    },
    {
      name: "Anurodh Parajuli",
      role: "The Backend Beast",
      image: AnurodhImg,
      description: "Anurodh talks to servers more than he talks to humans. If the website is fast, thank him. If the website is down, he’s probably sleeping after a 48-hour coding marathon powered purely by black coffee and sheer stubbornness."
    },
    {
      name: "Nischal KC",
      role: "The Pixel Perfect Perfectionist",
      image: NischalImg,
      description: "Nischal will literally cry if a button is 1 pixel off-center. He’s responsible for the 'Night Mode' transition, mostly because he hasn't seen actual sunlight since 2023. He thinks everything looks better in purple."
    },
    {
      name: "Tushar Khatiwada",
      role: "The Logistic Legend",
      image: TusharImg,
      description: "Tushar is the only reason your orders actually show up at your house and not in a random river. He knows every shortcut in Nepal and can calculate shipping costs faster than Anurodh's backend code."
    }
  ];

  return (
    <div className={`min-h-screen pt-32 pb-20 transition-colors duration-700 ${isLiquorMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Page Header */}
        <div className="mb-20 text-center">
          <h1 className={`text-6xl font-black italic tracking-tighter uppercase mb-4 transition-colors ${isLiquorMode ? 'text-purple-400' : 'text-blue-600'}`}>
            The <span className={isLiquorMode ? 'text-white' : 'text-black'}>Culprits</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-500 text-lg font-medium italic">
            {isLiquorMode 
              ? "Meet the guys responsible for your hangover." 
              : "Four guys trying to build an empire while arguing about where to order lunch."}
          </p>
        </div>

        {/* Founders List */}
        <div className="space-y-24">
          {founders.map((founder, index) => (
            <div 
              key={index} 
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}
            >
              {/* Image Container */}
              <div className="w-full md:w-1/2">
                <div className={`relative group overflow-hidden rounded-3xl transition-all duration-500 shadow-2xl ${isLiquorMode ? 'shadow-purple-500/20' : 'shadow-blue-500/20'}`}>
                  <img 
                    src={founder.image} 
                    alt={founder.name} 
                    className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                    <p className="text-white font-bold italic">Actual photo of {founder.name.split(' ')[0]} being serious.</p>
                  </div>
                </div>
              </div>

              {/* Text Container */}
              <div className="w-full md:w-1/2 text-center md:text-left">
                <span className={`text-xs font-black uppercase tracking-[0.3em] mb-4 block ${isLiquorMode ? 'text-purple-500' : 'text-blue-600'}`}>
                  {founder.role}
                </span>
                <h2 className="text-4xl font-black mb-6 tracking-tight">
                  {founder.name}
                </h2>
                <p className={`text-xl leading-relaxed font-medium ${isLiquorMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {founder.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}