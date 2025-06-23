import React from 'react';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white/20 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="text-center space-y-8 relative z-10">
        {/* Animated 404 */}
        <div className="relative">
          <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-pulse">
            404
          </h1>
          
          {/* Glowing effect */}
          <div className="absolute inset-0 text-9xl md:text-[12rem] font-bold text-cyan-400/20 blur-sm animate-pulse">
            404
          </div>
        </div>

        {/* Floating message */}
        <div className="space-y-4 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-semibold text-white/90 animate-slide-in-left">
            Oops! Page not found
          </h2>
          <p className="text-lg text-white/70 max-w-md mx-auto animate-slide-in-right">
            The page you're looking for seems to have drifted into the void.
          </p>
        </div>

        {/* Animated button */}
      
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out 0.2s both;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out 0.4s both;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out 0.6s both;
        }

        .animate-bounce-in {
          animation: bounce-in 0.8s ease-out 0.8s both;
        }
      `}</style>
    </div>
  );
}