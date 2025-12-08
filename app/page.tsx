'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Eye, ArrowRight, Shield, Sparkles, Zap } from 'lucide-react';

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    router.push("/login");
  };

  useEffect(() => {
    setIsVisible(true);

    // Native DOM MouseEvent
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-hidden relative">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-full blur-3xl animate-pulse"
          style={{
            top: '10%',
            left: '5%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        ></div>
        <div
          className="absolute w-80 h-80 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full blur-3xl animate-pulse"
          style={{
            top: '60%',
            right: '10%',
            animationDelay: '1s',
            transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.03}px)`
          }}
        ></div>
        <div
          className="absolute w-72 h-72 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse"
          style={{
            bottom: '15%',
            left: '15%',
            animationDelay: '2s',
            transform: `translate(${mousePosition.x * 0.025}px, ${mousePosition.y * 0.025}px)`
          }}
        ></div>
      </div>

      <div className={`relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Hero Section */}
        <div className="space-y-8 sm:space-y-10 lg:space-y-12 max-w-5xl mx-auto">
          {/* Logo with glassmorphism */}
          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl hover:shadow-emerald-500/50 transition-all duration-500 hover:scale-110 hover:rotate-6 backdrop-blur-sm border border-white/20 group">
            <Eye className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-white group-hover:scale-110 transition-transform duration-300" />
          </div>

          {/* Main heading with staggered animation */}
          <div className="space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/40 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/20 mb-4">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">AI-Powered Detection</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight px-4">
              Eye Disease Detection
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 font-light max-w-3xl mx-auto leading-relaxed px-4">
              Advanced fundus image analysis to identify eye diseases, monitor eye health, and provide personalized treatment recommendations
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 px-4">
            <Button
              size="lg"
              onClick={handleClick}
              className="w-full sm:w-auto h-14 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl group rounded-xl border-2 border-white/20"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-2" />
            </Button>
          </div>

          {/* Feature cards with glassmorphism */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 py-6 sm:py-8 px-4">
            <div className="group bg-white/50 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/30 hover:bg-white/60">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform duration-300">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Fundus Detection</h3>
              <p className="text-sm text-gray-600">Accurate retinal image analysis using advanced AI algorithms</p>
            </div>

            <div className="group bg-white/50 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/30 hover:bg-white/60">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Instant Results</h3>
              <p className="text-sm text-gray-600">Get your analysis results in seconds, not days</p>
            </div>

            <div className="group bg-white/50 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/30 hover:bg-white/60 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-6 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure & Private</h3>
              <p className="text-sm text-gray-600">Your health data is encrypted and protected</p>
            </div>
          </div>

          {/* Stats section */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 py-6 sm:py-8 px-4">
            <div className="text-center group cursor-pointer">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">95%</div>
              <div className="text-sm text-gray-600 mt-2">Accuracy Rate</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">10K+</div>
              <div className="text-sm text-gray-600 mt-2">Patients Helped</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">24/7</div>
              <div className="text-sm text-gray-600 mt-2">Available</div>
            </div>
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}