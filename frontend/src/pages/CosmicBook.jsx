import { useEffect, useRef } from "react";

const chapters = [
  {
    title: "Origins",
    text: [
      "In the beginning, there was nothing but potential.",
      "The universe waited in silence, suspended between being and nothingness.",
      "Then came the first spark, an explosion of light and energy.",
      "Time itself was born in that moment of creation.",
      "Everything that would ever exist emerged from that single point.",
      "The laws of physics crystallized like ice forming on glass.",
      "Matter coalesced from pure energy, gathering and spinning.",
      "Galaxies began their slow dance across the void.",
      "Stars ignited one by one, each a tiny sun.",
      "And in the darkness between them, mystery remained.",
      "We are made of stardust, remnants of ancient suns.",
      "Our story began long before we learned to tell it."
    ]
  },
  {
    title: "The Cosmos Awakens",
    text: [
      "Billions of years passed in silent formation.",
      "Planets cooled and solidified beneath new suns.",
      "Meteorites brought water to barren worlds.",
      "Chemical reactions began their intricate dance.",
      "Simple molecules combined into complex patterns.",
      "In some deep ocean, beneath ancient skies,",
      "Life stirred for the first time.",
      "Single-celled creatures drifted through primordial seas.",
      "They were humble, almost invisible, yet revolutionary.",
      "From them would come all diversity of life.",
      "Dinosaurs would walk across continents.",
      "And eventually, creatures that could wonder at the stars."
    ]
  },
  {
    title: "The Rise of Life",
    text: [
      "Life was tenacious, spreading across the planet.",
      "Fish evolved fins to navigate rivers and oceans.",
      "Some ventured onto land, developing limbs.",
      "Plants conquered the continents before animals.",
      "Green canopies provided shelter and oxygen.",
      "Insects buzzed through ancient forests.",
      "Reptiles dominated the earth for millions of years.",
      "Then came the mammals, small and careful.",
      "Some grew larger, more adventurous, more clever.",
      "Primates swung through trees, developing keen eyes.",
      "Hands evolved that could grasp, manipulate, create.",
      "And from them came a species that could dream."
    ]
  },
  {
    title: "The Gift of Language",
    text: [
      "Our ancestors communicated with grunts and gestures.",
      "But something shifted in their developing brains.",
      "Sounds became more refined, more expressive.",
      "Words were invented to describe what they felt.",
      "Names were given to objects, concepts, emotions.",
      "Stories were told around fires under stars.",
      "Ideas could now be preserved and passed down.",
      "Language became the bridge between minds.",
      "Entire worlds of meaning could be shared.",
      "One person's experience became another's knowledge.",
      "We could teach without being present.",
      "We could dream together across vast distances."
    ]
  },
  {
    title: "Writing and Memory",
    text: [
      "Speech faded with the speaker, lost to time.",
      "But then humans invented a remarkable tool.",
      "Marks on stone, clay, papyrus, paper.",
      "Symbols that could capture speech for eternity.",
      "Mesopotamians pressed wedges into clay.",
      "Egyptians painted hieroglyphics on tomb walls.",
      "Memory was no longer bound to individual minds.",
      "Libraries accumulated the wisdom of ages.",
      "Knowledge could be preserved unchanged.",
      "One generation could build upon another's work.",
      "The past became present through written word.",
      "Humanity gained continuity across centuries."
    ]
  },
  {
    title: "Science and Method",
    text: [
      "For millennia, people relied on authority and faith.",
      "But some dared to question and observe directly.",
      "Galileo looked through a telescope at Jupiter.",
      "Newton dropped an apple and watched it fall.",
      "They asked not what was believed, but what was true.",
      "They developed a method: observe, hypothesize, test.",
      "Each experiment brought new understanding.",
      "Failures were as valuable as successes.",
      "The universe revealed its secrets to patient inquiry.",
      "We learned we were not at the center of all things.",
      "Yet this humility brought profound liberation.",
      "We could understand ourselves and our cosmos."
    ]
  },
  {
    title: "Mathematics the Language",
    text: [
      "Numbers and equations emerged as nature's code.",
      "They described motion, energy, gravity itself.",
      "Math could predict where a planet would be.",
      "It could explain the arc of a thrown stone.",
      "Pure abstractions somehow matched physical reality.",
      "This seemed miraculous, yet it worked.",
      "Einstein wrote E=mc² and changed everything.",
      "The universe spoke in mathematical language.",
      "We were decoding that language bit by bit.",
      "Each equation revealed a new layer of truth.",
      "And in the patterns emerged strange beauty.",
      "Reality was elegant, if only we could see it."
    ]
  },
  {
    title: "Today and Beyond",
    text: [
      "We now understand our origin and history.",
      "We map our genes and measure distant galaxies.",
      "Yet mysteries remain at every horizon.",
      "What lies at the heart of a black hole?",
      "Is consciousness a cosmic phenomenon?",
      "Are we alone in these vast universes?",
      "What will humanity become in a million years?",
      "Our tools grow more powerful each decade.",
      "The questions we can ask grow more profound.",
      "We stand now at the threshold of wonder.",
      "Looking back at the journey from stardust to mind.",
      "And forward toward possibilities we cannot yet imagine."
    ]
  }
];

export default function CosmicBook() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Star colors palette
    const colors = [
      "#ff00ff", "#ff69b4", "#ff1493", "#c71585",
      "#00ffff", "#00ced1", "#20b2aa", "#40e0d0",
      "#0000ff", "#4169e1", "#1e90ff", "#87ceeb",
      "#ffd700", "#ffa500", "#ff6347", "#ffffff",
      "#b0e0e6", "#e6e6fa", "#dda0dd", "#da70d6"
    ];

    // Particles
    const particles = [];
    let lastParticleTime = 0;

    // Book state
    let currentChapter = 0;
    let pageFlipStart = 0;
    let isFlipping = false;
    const flipDuration = 3600; // 3.6 seconds in ms
    const flipInterval = 5500; // 5.5 seconds

    const getChapterData = (chapterIndex) => {
      return chapters[chapterIndex % chapters.length];
    };

    const drawBook = (time, flipProgress) => {
      const centerX = canvas.width / 2 - 80;
      const centerY = canvas.height / 2 + 50;

      // Book float animation
      const bobOffset = Math.sin(time * 0.013) * 7;

      // Draw spine
      ctx.fillStyle = "#3a2808";
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 15;
      ctx.shadowOffsetY = 10;

      // Book container
      const bookX = centerX;
      const bookY = centerY + bobOffset;

      // Left page
      const leftPageX = bookX - 140;
      const leftPageY = bookY;

      ctx.fillStyle = "#f0ead8";
      ctx.fillRect(leftPageX, leftPageY, 140, 200);
      ctx.strokeStyle = "#d4cfc0";
      ctx.lineWidth = 1;
      ctx.strokeRect(leftPageX, leftPageY, 140, 200);

      // Draw left page content
      drawPageContent(
        ctx,
        leftPageX + 10,
        leftPageY + 10,
        120,
        180,
        currentChapter,
        false
      );

      // Right page
      const rightPageX = bookX + 70;
      ctx.fillStyle = "#f0ead8";
      ctx.fillRect(rightPageX, leftPageY, 140, 200);
      ctx.strokeStyle = "#d4cfc0";
      ctx.lineWidth = 1;
      ctx.strokeRect(rightPageX, leftPageY, 140, 200);

      // Draw right page content (mirrored)
      drawPageContent(
        ctx,
        rightPageX + 10,
        leftPageY + 10,
        120,
        180,
        currentChapter,
        true
      );

      // Spine
      ctx.fillStyle = "#3a2808";
      ctx.fillRect(bookX + 60, bookY, 20, 200);

      // Reset shadow
      ctx.shadowColor = "transparent";
    };

    const drawPageContent = (
      ctx,
      x,
      y,
      width,
      height,
      chapterIndex,
      mirror
    ) => {
      const chapter = getChapterData(chapterIndex);
      const lineHeight = 12;

      // Chapter label
      ctx.font = "bold 8px Georgia";
      ctx.fillStyle = "#a68564";
      if (mirror) {
        ctx.textAlign = "right";
        ctx.fillText(chapter.title.toUpperCase(), x + width, y);
      } else {
        ctx.textAlign = "left";
        ctx.fillText(chapter.title.toUpperCase(), x, y);
      }

      // Title
      ctx.font = "bold 18px Georgia";
      ctx.fillStyle = "#1a1a1a";
      if (mirror) {
        ctx.textAlign = "right";
        ctx.fillText(chapter.title, x + width, y + 25);
      } else {
        ctx.textAlign = "left";
        ctx.fillText(chapter.title, x, y + 25);
      }

      // Body text with ruled lines
      ctx.font = "7.5px Georgia";
      ctx.fillStyle = "#333333";
      ctx.strokeStyle = "#e0e0e0";
      ctx.lineWidth = 0.5;

      const startY = y + 45;
      for (let i = 0; i < 12; i++) {
        const lineY = startY + i * lineHeight;

        // Ruled line
        ctx.beginPath();
        ctx.moveTo(x, lineY + 8);
        ctx.lineTo(x + width, lineY + 8);
        ctx.stroke();

        // Text
        if (mirror) {
          ctx.textAlign = "right";
          ctx.fillText(chapter.text[i], x + width, lineY);
        } else {
          ctx.textAlign = "left";
          ctx.fillText(chapter.text[i], x, lineY);
        }
      }

      ctx.textAlign = "left";
    };

    const spawnParticles = (time) => {
      const centerX = canvas.width / 2 - 80;
      const centerY = canvas.height / 2 + 50;

      const bobOffset = Math.sin(time * 0.013) * 7;

      if (time - lastParticleTime > 75) {
        lastParticleTime = time;

        for (let i = 0; i < 5; i++) {
          const pageX =
            centerX -
            140 +
            10 +
            Math.random() * 240;
          const pageY = centerY + bobOffset + 10 + Math.random() * 180;

          const color = colors[Math.floor(Math.random() * colors.length)];
          const shapes = ["circle", "star5", "star4"];
          const shape = shapes[Math.floor(Math.random() * shapes.length)];
          const size = 1.4 + Math.random() * 4.1;
          const speed = 0.1 + Math.random() * 0.2;

          particles.push({
            x: pageX,
            y: pageY,
            vx: (Math.random() - 0.5) * 0.05,
            vy: -speed,
            color,
            shape,
            size,
            age: 0,
            maxAge: 400 + Math.random() * 360
          });
        }
      }
    };

    const drawParticles = () => {
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.age++;

        if (p.age > p.maxAge) {
          particles.splice(idx, 1);
          return;
        }

        // Fade in over 55 frames, fade out over last 32% of lifespan
        let alpha = 1;
        const fadeInFrames = 55;
        const fadeOutStart = p.maxAge * 0.68;

        if (p.age < fadeInFrames) {
          alpha = p.age / fadeInFrames;
        } else if (p.age > fadeOutStart) {
          alpha = 1 - (p.age - fadeOutStart) / (p.maxAge - fadeOutStart);
        }

        // Twinkling effect
        alpha *= 0.5 + 0.5 * Math.sin(p.age * 0.1);

        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "star5") {
          drawStar(ctx, p.x, p.y, 5, p.size / 2, p.size / 4);
        } else if (p.shape === "star4") {
          drawStar(ctx, p.x, p.y, 4, p.size / 2, p.size / 4);
        }

        ctx.globalAlpha = 1;
      });
    };

    const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius) => {
      let rot = (Math.PI / 2) * 3;
      let step = (Math.PI / spikes);

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        ctx.lineTo(
          cx + Math.cos(rot) * outerRadius,
          cy + Math.sin(rot) * outerRadius
        );
        rot += step;

        ctx.lineTo(
          cx + Math.cos(rot) * innerRadius,
          cy + Math.sin(rot) * innerRadius
        );
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();
    };

    const drawBackgroundStars = () => {
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 100; i++) {
        const x = Math.sin(i * 12.9898) * 43758.5453 * canvas.width;
        const y = Math.cos(i * 78.233) * 43758.5453 * canvas.height;
        const size = (Math.sin(i * 45.164) * 10 + 10) % 3;
        const actualX = x % canvas.width;
        const actualY = y % canvas.height;

        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(Date.now() * 0.001 + i) * 0.7})`;
        ctx.fillRect(actualX, actualY, size, size);
      }
    };

    const drawAuroraGlow = (time) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 + 100;

      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        50,
        centerX,
        centerY,
        400
      );
      gradient.addColorStop(0, "rgba(0, 255, 200, 0.15)");
      gradient.addColorStop(0.5, "rgba(0, 150, 150, 0.05)");
      gradient.addColorStop(1, "rgba(0, 100, 150, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const animate = (time) => {
      // Clear background
      ctx.fillStyle = "#0b0f1e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw aurora glow
      drawAuroraGlow(time);

      // Draw background stars
      drawBackgroundStars();

      // Update chapter
      const flipState = (time / flipInterval) % 1;
      if (flipState < 0.01 && !isFlipping) {
        isFlipping = true;
        pageFlipStart = time;
        currentChapter++;
      }
      if (isFlipping && time - pageFlipStart > flipDuration) {
        isFlipping = false;
      }

      const flipProgress = isFlipping
        ? (time - pageFlipStart) / flipDuration
        : 0;

      // Draw book
      drawBook(time, flipProgress);

      // Spawn and draw particles
      spawnParticles(time);
      drawParticles();

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%"
        }}
      />
    </div>
  );
}
