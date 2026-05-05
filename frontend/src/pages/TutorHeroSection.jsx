import React, { useRef } from 'react';
import FullScreenScrollFX from '../components/FullScreenScrollFX';

const TutorHeroSection = () => {
  const apiRef = useRef(null);

  const sections = [
    {
      id: "silence",
      leftLabel: "Start",
      title: "Your Learning",
      rightLabel: "Start",
      background: "https://images.unsplash.com/photo-1516321318423-f06f70d504d0?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "essence",
      leftLabel: "Growth",
      title: "Expert Guidance",
      rightLabel: "Growth",
      background: "https://images.unsplash.com/photo-1522202176988-696ce0213ce3?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "rebirth",
      leftLabel: "Credentials",
      title: "Earn & Grow",
      rightLabel: "Credentials",
      background: "https://images.unsplash.com/photo-1500595046891-0573fa0b1d7d?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "change",
      leftLabel: "Together",
      title: "Build Future",
      rightLabel: "Together",
      background: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1600&auto=format&fit=crop",
    },
  ];

  return (
    <FullScreenScrollFX
      ref={apiRef}
      sections={sections}
      header={
        <>
          <div>EduChain</div>
          <div>NP</div>
        </>
      }
      footer={<div>Excellence in Learning</div>}
      showProgress={true}
      durations={{ change: 0.7, snap: 800 }}
      colors={{
        text: "rgba(245,245,245,0.92)",
        overlay: "rgba(0,0,0,0.35)",
        pageBg: "#ffffff",
        stageBg: "#000000",
      }}
    />
  );
};

export default TutorHeroSection;

