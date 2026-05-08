import React, { useRef } from 'react';
import FullScreenScrollFX from '../components/FullScreenScrollFX';
const togetherImage = '/together-classroom.jpg';

const TutorHeroSection = () => {
  const apiRef = useRef(null);

  const sections = [
    {
      id: "silence",
      leftLabel: "Start",
      title: "Your Learning",
      rightLabel: "Start",
    },
    {
      id: "essence",
      leftLabel: "Growth",
      title: "Expert Guidance",
      rightLabel: "Growth",
    },
    {
      id: "rebirth",
      leftLabel: "Credentials",
      title: "Earn & Grow",
      rightLabel: "Credentials",
    },
    {
      id: "change",
      leftLabel: "Together",
      title: "Build Future",
      rightLabel: "Together",
      renderBackground: (isActive) => (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#000000',
            opacity: isActive ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          <img
            src={togetherImage}
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      ),
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
      showBackgrounds={true}
      durations={{ change: 0.7, snap: 800 }}
      colors={{
        text: "rgba(245,245,245,0.92)",
        overlay: "rgba(0,0,0,0.35)",
        pageBg: "#000000",
        stageBg: "#000000",
      }}
    />
  );
};

export default TutorHeroSection;

