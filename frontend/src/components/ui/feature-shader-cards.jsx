import React from 'react';
import { Star, Zap, Package, Palette, Smartphone, CheckCircle } from 'lucide-react';

const features = [
  {
    title: "Elegant Design",
    description:
      "Beautiful shader effects that enhance your content without overwhelming it. Perfect for modern web experiences.",
    icon: Star,
  },
  {
    title: "High Performance",
    description: "Optimized WebGL shaders that run smoothly on all devices while maintaining stunning visual quality.",
    icon: Zap,
  },
  {
    title: "Easy Integration",
    description: "Simple React components that can be dropped into any project with minimal configuration required.",
    icon: Package,
  },
  {
    title: "Customizable",
    description: "Extensive customization options to match your brand colors, animations, and visual style perfectly.",
    icon: Palette,
  },
  {
    title: "Responsive",
    description: "Fully responsive design that looks great on desktop, tablet, and mobile devices of all sizes.",
    icon: Smartphone,
  },
  {
    title: "Modern Tech",
    description: "Built with the latest web technologies including WebGL, React, and TypeScript for reliability.",
    icon: CheckCircle,
  },
];

export default function FeaturesCards() {
  const getGradientConfig = (index) => {
    const configs = [
      {
        gradient: "from-purple-500 via-purple-600 to-pink-500",
        textGradient: "from-purple-400 to-pink-400",
      },
      {
        gradient: "from-blue-500 via-cyan-500 to-teal-500",
        textGradient: "from-blue-400 to-cyan-400",
      },
      {
        gradient: "from-green-500 via-emerald-500 to-lime-500",
        textGradient: "from-green-400 to-emerald-400",
      },
      {
        gradient: "from-orange-500 via-red-500 to-pink-500",
        textGradient: "from-orange-400 to-red-400",
      },
      {
        gradient: "from-indigo-500 via-purple-500 to-pink-500",
        textGradient: "from-indigo-400 to-purple-400",
      },
      {
        gradient: "from-rose-500 via-red-500 to-orange-500",
        textGradient: "from-rose-400 to-orange-400",
      },
    ];
    return configs[index % configs.length];
  };

  return (
    <section className="min-h-screen py-20 px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Everything you need to create stunning visual experiences with elegant shader backgrounds
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const config = getGradientConfig(index);
            return (
              <div
                key={index}
                className="group relative h-80 rounded-3xl overflow-hidden transition-transform duration-300 hover:scale-105"
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-70 group-hover:opacity-90 transition-opacity duration-300`}
                />

                {/* Animated Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Shine Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white to-transparent" />

                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                  <div className="text-white filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-12 h-12" />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-white">
                      {feature.title}
                    </h3>

                    <p className="leading-relaxed text-gray-100 font-medium mb-6">
                      {feature.description}
                    </p>

                    <div className="flex items-center text-sm font-bold text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="mr-2">Learn more</span>
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
