

import React, { useState, useRef, useEffect } from 'react';
import { FaApple, FaDiscord, FaGithub, FaWindows } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import AnoAI from './animated-shader-background';

function SocialButton({ icon, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center p-2 bg-white/5 border border-white/10 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {icon}
    </button>
  );
}

function VideoBackground({ videoUrl, imageUrl }) {
  const videoRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!imageUrl || !imageRef.current) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      imageRef.current.style.opacity = '1';
      return undefined;
    }

    const entranceAnimation = imageRef.current.animate(
      [
        { opacity: 0 },
        { opacity: 1 },
      ],
      {
        duration: 900,
        fill: 'forwards',
        easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)',
      }
    );

    const cinematicAnimation = imageRef.current.animate(
      [
        { transform: 'scale(1.05) translate3d(0%, 0%, 0)', filter: 'brightness(0.86) contrast(1.05) saturate(1.06)' },
        { transform: 'scale(1.1) translate3d(-1.4%, -0.9%, 0)', filter: 'brightness(0.92) contrast(1.08) saturate(1.1)' },
        { transform: 'scale(1.08) translate3d(1.2%, 0.8%, 0)', filter: 'brightness(0.88) contrast(1.06) saturate(1.08)' },
        { transform: 'scale(1.05) translate3d(0%, 0%, 0)', filter: 'brightness(0.86) contrast(1.05) saturate(1.06)' },
      ],
      {
        duration: 24000,
        iterations: Infinity,
        easing: 'ease-in-out',
      }
    );

    return () => {
      entranceAnimation.cancel();
      cinematicAnimation.cancel();
    };
  }, [imageUrl]);

  if (imageUrl) {
    return (
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Study DAO background"
          className="absolute inset-0 z-0 w-full h-full object-cover"
          style={{ transformOrigin: 'center center', willChange: 'transform, filter, opacity', opacity: 0 }}
        />
        <AnoAI className="pointer-events-none absolute inset-0 z-[5] opacity-40 mix-blend-screen" />
        <div className="absolute inset-0 bg-black/55 z-10" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <AnoAI className="pointer-events-none absolute inset-0 z-[5] opacity-40 mix-blend-screen" />
      <div className="absolute inset-0 bg-black/55 z-10" />
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 min-w-full min-h-full object-cover w-auto h-auto"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
}

function LoginForm({ onSubmit, onQuickAccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuickAccessLoading, setIsQuickAccessLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAccess = async () => {
    if (!onQuickAccess) {
      return;
    }

    setIsQuickAccessLoading(true);
    try {
      await onQuickAccess();
    } finally {
      setIsQuickAccessLoading(false);
    }
  };

  return (
    <div className="p-8 rounded-2xl backdrop-blur-sm bg-black/50 border border-white/10">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2 text-white">EduChainNP</h2>
        <p className="text-white/80">Learn smarter, earn on-chain, grow together.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-all duration-200 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          <FcGoogle className="text-lg" />
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-8">
        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 absolute w-full" />
          <div className="bg-transparent px-4 relative text-white/60 text-sm">quick access via</div>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-3">
          <SocialButton icon={<FaWindows className="text-xl" />} onClick={handleQuickAccess} disabled={isQuickAccessLoading} />
          <SocialButton icon={<FaGithub className="text-xl" />} onClick={handleQuickAccess} disabled={isQuickAccessLoading} />
          <SocialButton icon={<FaDiscord className="text-xl" />} onClick={handleQuickAccess} disabled={isQuickAccessLoading} />
          <SocialButton icon={<FaApple className="text-xl" />} onClick={handleQuickAccess} disabled={isQuickAccessLoading} />
        </div>
      </div>
    </div>
  );
}

const LoginPage = {
  LoginForm,
  VideoBackground,
};

export default LoginPage;
