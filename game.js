/**
 * OPERATION: CAUGHT IN 4K 🤣
 * 3D Endless Bollywood Comedy Chase Game
 * Built with Three.js + Web Audio API + SpeechSynthesis
 */

(() => {
  'use strict';

  // ==================== CONFIGURATION & LANES ====================
  const LANES = [-5.5, -2.75, 0, 2.75, 5.5]; // 5 rich lanes across the Indian highway
  const ROAD_WIDTH = 16;
  const SEGMENT_LENGTH = 40;
  const NUM_SEGMENTS = 8;

  // ==================== SOUND & VOICE ENGINE ====================
  class BollywoodAudio {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.engineOsc = null;
      this.engineGain = null;
      this.bgmInterval = null;
      this.beatStep = 0;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleMute() {
      this.muted = !this.muted;
      if (this.muted) {
        this.stopEngine();
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      } else {
        this.startEngine();
      }
      return this.muted;
    }

    speak(text, pitch = 1.1, rate = 1.15) {
      if (this.muted || !('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.pitch = pitch;
        utter.rate = rate;
        utter.volume = 0.9;
        window.speechSynthesis.speak(utter);
      } catch (e) {
        // Fallback if speech synthesis blocked
      }
    }

    startEngine() {
      this.init();
      if (this.muted || !this.ctx || this.engineOsc) return;
      this.engineOsc = this.ctx.createOscillator();
      this.engineGain = this.ctx.createGain();
      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.value = 55;
      this.engineGain.gain.value = 0.035;
      this.engineOsc.connect(this.engineGain);
      this.engineGain.connect(this.ctx.destination);
      this.engineOsc.start();
    }

    updateEngine(speedRatio, isTurbo) {
      if (!this.engineOsc || !this.ctx || this.muted) return;
      const targetFreq = isTurbo ? 145 : 52 + speedRatio * 55;
      this.engineOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.08);
    }

    stopEngine() {
      if (this.engineOsc) {
        try { this.engineOsc.stop(); } catch (e) {}
        this.engineOsc.disconnect();
        this.engineOsc = null;
      }
    }

    startDholBGM() {
      this.init();
      if (this.bgmInterval) clearInterval(this.bgmInterval);
      // Fast-paced Bollywood Dhol & Tasha chase beat
      const bassNotes = [110, 110, 146.8, 110, 164.8, 146.8, 130.8, 98];
      const leadNotes = [440, 523.25, 587.33, 659.25, 587.33, 523.25, 493.88, 440];
      this.bgmInterval = setInterval(() => {
        if (this.muted || !this.ctx || state.mode !== 'PLAYING') return;
        const now = this.ctx.currentTime;
        const step = this.beatStep % 8;

        // Dhol Bass Kick
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(bassNotes[step], now);
        osc.frequency.exponentialRampToValueAtTime(42, now + 0.14);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);

        // High Shehnai / Synth Stabs on upbeat
        if (step % 2 === 1 || state.anger > 65) {
          const lead = this.ctx.createOscillator();
          const lGain = this.ctx.createGain();
          lead.type = 'square';
          lead.frequency.setValueAtTime(leadNotes[step], now);
          lGain.gain.setValueAtTime(0.025, now);
          lGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
          lead.connect(lGain);
          lGain.connect(this.ctx.destination);
          lead.start(now);
          lead.stop(now + 0.12);
        }

        this.beatStep++;
      }, 190);
    }

    stopDholBGM() {
      if (this.bgmInterval) {
        clearInterval(this.bgmInterval);
        this.bgmInterval = null;
      }
    }

    playCoin() {
      if (this.muted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now);
      osc.frequency.setValueAtTime(1318.51, now + 0.07);
      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    }

    playHorn() {
      if (this.muted || !this.ctx) return;
      const now = this.ctx.currentTime;
      [380, 480].forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      });
    }

    playChappalWhoosh() {
      if (this.muted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.28);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.31);
    }

    playCartoonSlip() {
      if (this.muted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(950, now + 0.16);
      osc.frequency.linearRampToValueAtTime(140, now + 0.42);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.44);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    }

    playSlapImpact() {
      if (this.muted || !this.ctx) return;
      const now = this.ctx.currentTime;
      // White noise burst + low punch for classic Bollywood slap ("PATAAAK!")
      const bufferSize = this.ctx.sampleRate * 0.22;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      noise.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);

      const punch = this.ctx.createOscillator();
      const pGain = this.ctx.createGain();
      punch.type = 'triangle';
      punch.frequency.setValueAtTime(160, now);
      punch.frequency.exponentialRampToValueAtTime(35, now + 0.2);
      pGain.gain.setValueAtTime(0.3, now);
      pGain.gain.exponentialRampToValueAtTime(0.001, now + 0.21);
      punch.connect(pGain);
      pGain.connect(this.ctx.destination);
      punch.start(now);
      punch.stop(now + 0.22);
    }
  }

  const audio = new BollywoodAudio();

  // ==================== STORY CUTSCENE DIALOGUES ====================
  const CUTSCENE_LINES = [
    {
      speaker: 'BOY ON SCOOTY 😎',
      img: 'assets/boy.png',
      text: '"Weather is awesome, Chai was kadak... and my scooty rides smoother than butter!"',
      voicePitch: 1.0
    },
    {
      speaker: 'GIRL SITTING BEHIND 😊',
      img: 'assets/boy.png',
      text: '"Haha! Thanks for giving me a lift from coaching class! Wait... why is that girl staring at us?!"',
      voicePitch: 1.4
    },
    {
      speaker: 'ACTUAL GIRLFRIEND 🤬🩴',
      img: 'assets/girl.png',
      text: '"STOP RIGHT THERE, YOU CHEATER!! Told me your scooty had a puncture?! AAJ TU GAYA BETA!!"',
      voicePitch: 1.25
    },
    {
      speaker: 'BOY ON SCOOTY 😱',
      img: 'assets/boy.png',
      text: '"AREYYYY! BABY! LISTEN! IT\'S NOT WHAT YOU THINK!!!"',
      voicePitch: 1.35
    },
    {
      speaker: 'GIRL SITTING BEHIND 😱',
      img: 'assets/boy.png',
      text: '"WHO IS THAT?! WHY HAS SHE UNLOCKED SNIPER MODE WITH A CHAPPAL?!"',
      voicePitch: 1.5
    }
  ];

  // ==================== LIVE IN-GAME COMIC BARKS ====================
  const BARKS = {
    boy: [
      "AREYYYY! BABY! LISTEN! IT'S NOT WHAT YOU THINK!!!",
      "SHE IS JUST DOUBT-CLEARING NOTES DIDI I SWEAR!",
      "MUMMY BACHAO! FLYING PARAGON CHAPPAL!",
      "SIDE DO BHAI! MERI JAAN KHATRE MEIN HAI!",
      "BABY PUT THE SLIPPER DOWN LET'S TALK OVER MOMOS!"
    ],
    gf: [
      "STOP RIGHT THERE, YOU CHEATER!!! 🩴",
      "PHONE SWITCHED OFF THA NA?! RUK ABHI BATATI HU!",
      "MY CHAPPAL HAS GPS LOCK-ON BETA!",
      "WHO IS THIS 'COACHING FRIEND'?! AAJ TU GAYA!",
      "EVEN USAIN BOLT CAN'T SAVE YOU TODAY!"
    ],
    otherGirl: [
      "WHO IS THAT?! DROP ME AT THE NEXT METRO STATION!!",
      "WHY IS SHE RUNNING FASTER THAN YOUR SCOOTY?!",
      "BRO YOUR GIRLFRIEND HAS OLYMPIC JAVELIN AIM!",
      "I JUST WANTED A LIFT TO THE BUS STOP AAAAAH!"
    ],
    npc: [
      "CHAIWALA: 'Arey bhai, live Bollywood shooting chal rahi hai!' ☕",
      "AUTO UNCLE: 'Meter down karu kya beta? Bhaag जोर से!' 🛺",
      " AUNTY JI: 'Caught in 4K Ultra HD! Aaj kal ke बच्चे!' 📸",
      "TRAFFIC POLICE: 'Overspeeding chhodo, pehle chappal se bacho!' 🚓"
    ]
  };

  // ==================== GAME STATE ====================
  const state = {
    mode: 'MENU', // MENU, CUTSCENE, PLAYING, PAUSED, GAMEOVER_ANIM, GAMEOVER
    cutsceneIdx: 0,
    laneIndex: 2, // Center lane (0..4)
    targetX: 0,
    playerX: 0,
    playerY: 0,
    playerVy: 0,
    isJumping: false,
    speed: 26,
    baseSpeed: 26,
    maxSpeed: 54,
    distance: 0,
    score: 0,
    coins: 0,
    chappalsDodged: 0,

    // Girlfriend Boss mechanics
    gfDistance: 17, // Meters behind player. 0 = Caught!
    anger: 30, // 0 to 100
    gfSlipTimer: 0,
    gfSlowTimer: 0,
    chappalCooldown: 2.5,

    // Power-up inventory & active timers
    inventory: {
      turbo: 2,
      oil: 2,
      apology: 1,
      shield: 1,
      chaos: 1
    },
    turboTimer: 0,
    shieldActive: false,
    shieldTimer: 0,
    invincibleTimer: 0,
    cameraShake: 0,
    barkCooldown: 3.5,
    gameoverReason: ''
  };

  // ==================== THREE.JS SCENE SETUP ====================
  const container = document.getElementById('game-container');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xff9e6d);
  scene.fog = new THREE.FogExp2(0xff9e6d, 0.0095);

  const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 240);
  camera.position.set(0, 5.4, 10.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Lighting: Vibrant Golden-Hour Indian Bazaar Atmosphere
  const ambientLight = new THREE.AmbientLight(0xffe8d6, 0.75);
  scene.add(ambientLight);

  const hemiLight = new THREE.HemisphereLight(0xfff0c2, 0x4a2545, 0.55);
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xfff3d1, 1.15);
  sunLight.position.set(25, 45, 20);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  sunLight.shadow.camera.near = 1;
  sunLight.shadow.camera.far = 120;
  const d = 35;
  sunLight.shadow.camera.left = -d;
  sunLight.shadow.camera.right = d;
  sunLight.shadow.camera.top = d;
  sunLight.shadow.camera.bottom = -d;
  scene.add(sunLight);

  // Load Uploaded Character Face Textures
  const textureLoader = new THREE.TextureLoader();
  const boyFaceTex = textureLoader.load('assets/boy.png');
  const girlFaceTex = textureLoader.load('assets/girl.png');

  // Helper to create canvas sign textures for Indian Shops & Billboards
  function makeSignTexture(text, bgColor, textColor = '#ffffff', borderColor = '#ffcc00') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, canvas.width - 14, canvas.height - 14);
    ctx.fillStyle = textColor;
    ctx.font = '900 44px "Nunito", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }

  // ==================== BUILD PLAYER SCOOTY & CHARACTERS ====================
  const playerGroup = new THREE.Group();
  scene.add(playerGroup);

  const scootyMeshGroup = new THREE.Group();
  playerGroup.add(scootyMeshGroup);

  // Scooty Body (Vibrant Mint-Teal / Retro Pink Indian Scooty)
  const scootyMat = new THREE.MeshStandardMaterial({ color: 0x00d2ff, roughness: 0.3, metalness: 0.2 });
  const seatMat = new THREE.MeshStandardMaterial({ color: 0x3b1d11, roughness: 0.7 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.15, metalness: 0.85 });
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.9 });

  // Floorboard & Rear Engine Cowl
  const floorboard = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.22, 2.2), scootyMat);
  floorboard.position.set(0, 0.45, 0);
  floorboard.castShadow = true;
  scootyMeshGroup.add(floorboard);

  const rearBody = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.75, 1.25), scootyMat);
  rearBody.position.set(0, 0.82, 0.48);
  rearBody.castShadow = true;
  scootyMeshGroup.add(rearBody);

  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.24, 1.35), seatMat);
  seat.position.set(0, 1.25, 0.42);
  scootyMeshGroup.add(seat);

  // Front Apron & Handlebar Stem
  const frontApron = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.3, 0.38), scootyMat);
  frontApron.position.set(0, 1.05, -0.88);
  frontApron.rotation.x = 0.2;
  frontApron.castShadow = true;
  scootyMeshGroup.add(frontApron);

  const handleBar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.45, 10), chromeMat);
  handleBar.rotation.z = Math.PI / 2;
  handleBar.position.set(0, 1.75, -0.75);
  scootyMeshGroup.add(handleBar);

  const headlight = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xffffaa })
  );
  headlight.position.set(0, 1.75, -0.92);
  scootyMeshGroup.add(headlight);

  // Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.3, 16);
  wheelGeo.rotateZ(Math.PI / 2);
  const frontWheel = new THREE.Mesh(wheelGeo, tireMat);
  frontWheel.position.set(0, 0.42, -0.95);
  scootyMeshGroup.add(frontWheel);

  const backWheel = new THREE.Mesh(wheelGeo, tireMat);
  backWheel.position.set(0, 0.42, 0.9);
  scootyMeshGroup.add(backWheel);

  // Turbo Exhaust Flame Meshes
  const turboFlame = new THREE.Mesh(
    new THREE.ConeGeometry(0.35, 1.6, 10),
    new THREE.MeshBasicMaterial({ color: 0xff5500 })
  );
  turboFlame.rotation.x = Math.PI / 2;
  turboFlame.position.set(0, 0.65, 1.75);
  turboFlame.visible = false;
  scootyMeshGroup.add(turboFlame);

  // --- BOY CHARACTER (Driving Scooty with Uploaded Face Cutout clearly visible!) ---
  const boyGroup = new THREE.Group();
  boyGroup.position.set(-0.26, 1.35, -0.22); // Seated at the front handlebar, slightly left so his look-back face is 100% unobstructed
  scootyMeshGroup.add(boyGroup);

  const boyTorso = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.85, 0.42),
    new THREE.MeshStandardMaterial({ color: 0xffbe0b, roughness: 0.5 }) // Cool Mustard Jacket
  );
  boyTorso.position.set(0, 0.45, 0);
  boyTorso.castShadow = true;
  boyGroup.add(boyTorso);

  // Expressive Uploaded Boy Face Cutout (No sphere blocking it, elevated & facing camera!)
  const boyHeadGroup = new THREE.Group();
  boyHeadGroup.position.set(-0.08, 1.48, 0.15);
  boyGroup.add(boyHeadGroup);

  const boyFaceMat = new THREE.MeshBasicMaterial({
    map: boyFaceTex,
    transparent: true,
    side: THREE.DoubleSide,
    alphaTest: 0.08
  });
  const boyFaceCard = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 1.45), boyFaceMat);
  boyFaceCard.position.set(0, 0, 0);
  boyHeadGroup.add(boyFaceCard);

  // Helmet Shield Dome (Visible when Helmet Shield Power-up is active)
  const helmetBubble = new THREE.Mesh(
    new THREE.SphereGeometry(2.1, 20, 20),
    new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.32,
      wireframe: false
    })
  );
  helmetBubble.position.set(0, 1.3, 0.3);
  helmetBubble.visible = false;
  scootyMeshGroup.add(helmetBubble);

  // --- OTHER GIRL CHARACTER (Sitting side-saddle behind him to the right, screaming!) ---
  const otherGirlGroup = new THREE.Group();
  otherGirlGroup.position.set(0.38, 1.28, 0.58); // Offset right & lower so she never blocks the Boy's face!
  scootyMeshGroup.add(otherGirlGroup);

  const ogTorso = new THREE.Mesh(
    new THREE.BoxGeometry(0.58, 0.75, 0.38),
    new THREE.MeshStandardMaterial({ color: 0xff4d94, roughness: 0.4 }) // Bright Pink Kurti
  );
  ogTorso.position.set(0, 0.38, 0);
  ogTorso.castShadow = true;
  otherGirlGroup.add(ogTorso);

  const ogHead = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 14, 14),
    new THREE.MeshStandardMaterial({ color: 0xf1c27d })
  );
  ogHead.position.set(0.08, 0.96, 0);
  otherGirlGroup.add(ogHead);

  // Ponytail hair that bounces to the side
  const ogHair = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0x1a1110 })
  );
  ogHair.position.set(0.12, 1.0, 0.08);
  otherGirlGroup.add(ogHair);

  // Screaming Arms waving in air
  const armGeo = new THREE.BoxGeometry(0.16, 0.68, 0.16);
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xf1c27d });
  const ogLeftArm = new THREE.Mesh(armGeo, skinMat);
  ogLeftArm.position.set(-0.38, 0.78, 0);
  ogLeftArm.rotation.z = 0.45;
  otherGirlGroup.add(ogLeftArm);

  const ogRightArm = new THREE.Mesh(armGeo, skinMat);
  ogRightArm.position.set(0.46, 0.82, 0);
  ogRightArm.rotation.z = -0.75;
  otherGirlGroup.add(ogRightArm);

  // ==================== ANGRY GIRLFRIEND FINAL BOSS (3D CHASER) ====================
  const gfGroup = new THREE.Group();
  gfGroup.position.set(0, 0, 8.5);
  scene.add(gfGroup);

  // Furious Red Aura Ring underneath her feet
  const gfAura = new THREE.Mesh(
    new THREE.RingGeometry(0.7, 1.35, 24),
    new THREE.MeshBasicMaterial({ color: 0xff0037, side: THREE.DoubleSide, transparent: true, opacity: 0.75 })
  );
  gfAura.rotation.x = -Math.PI / 2;
  gfAura.position.y = 0.06;
  gfGroup.add(gfAura);

  // Legs (Animated at supersonic speed)
  const legGeo = new THREE.BoxGeometry(0.28, 0.85, 0.28);
  const gfLegMat = new THREE.MeshStandardMaterial({ color: 0x1d3557 });
  const gfLeftLeg = new THREE.Mesh(legGeo, gfLegMat);
  gfLeftLeg.position.set(-0.24, 0.45, 0);
  gfGroup.add(gfLeftLeg);

  const gfRightLeg = new THREE.Mesh(legGeo, gfLegMat);
  gfRightLeg.position.set(0.24, 0.45, 0);
  gfGroup.add(gfRightLeg);

  // Torso (Red Salwar/Top)
  const gfTorso = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 1.05, 0.5),
    new THREE.MeshStandardMaterial({ color: 0xd90429, roughness: 0.4 })
  );
  gfTorso.position.set(0, 1.35, 0);
  gfTorso.castShadow = true;
  gfGroup.add(gfTorso);

  // Girlfriend Uploaded Face Cutout (Large & clear so player sees her chasing!)
  const gfFaceMat = new THREE.MeshBasicMaterial({
    map: girlFaceTex,
    transparent: true,
    side: THREE.DoubleSide,
    alphaTest: 0.15
  });
  const gfHeadCard = new THREE.Mesh(new THREE.PlaneGeometry(1.55, 1.55), gfFaceMat);
  gfHeadCard.position.set(0, 2.45, 0);
  gfGroup.add(gfHeadCard);

  // Right Arm wielding Giant Chappal (Slipper)
  const gfRightArmGroup = new THREE.Group();
  gfRightArmGroup.position.set(0.62, 1.75, 0);
  gfGroup.add(gfRightArmGroup);

  const gfArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.85, 0.24), skinMat);
  gfArmMesh.position.set(0, 0.35, 0);
  gfRightArmGroup.add(gfArmMesh);

  // 3D Chappal (Slipper) in her hand
  function createChappalMesh(scale = 1) {
    const chappal = new THREE.Group();
    const sole = new THREE.Mesh(
      new THREE.BoxGeometry(0.45 * scale, 0.12 * scale, 0.95 * scale),
      new THREE.MeshStandardMaterial({ color: 0xff0055, roughness: 0.6 })
    );
    chappal.add(sole);

    const strapL = new THREE.Mesh(
      new THREE.BoxGeometry(0.08 * scale, 0.14 * scale, 0.45 * scale),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    strapL.position.set(-0.1 * scale, 0.1 * scale, -0.05 * scale);
    strapL.rotation.y = 0.35;
    chappal.add(strapL);

    const strapR = new THREE.Mesh(
      new THREE.BoxGeometry(0.08 * scale, 0.14 * scale, 0.45 * scale),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    strapR.position.set(0.1 * scale, 0.1 * scale, -0.05 * scale);
    strapR.rotation.y = -0.35;
    chappal.add(strapR);

    return chappal;
  }

  const heldChappal = createChappalMesh(1.3);
  heldChappal.position.set(0, 0.85, -0.15);
  heldChappal.rotation.x = Math.PI / 3;
  gfRightArmGroup.add(heldChappal);

  // ==================== COLORFUL INDIAN CITY ENVIRONMENT ====================
  const roadSegments = [];
  const SHOP_SIGNS = [
    { name: 'SHARMA CHAI & SAMOSA ☕', bg: '#b5179e' },
    { name: 'PAPPU SCOOTY PUNCTURE 🔧', bg: '#0077b6' },
    { name: 'ROYAL BIRYANI DARBAR 🍲', bg: '#d90429' },
    { name: 'BUNTY MOBILE REPAIR 📱', bg: '#2b9348' },
    { name: '4K CCTV MARRIAGE DETECTIVE 🕵️', bg: '#7209b7' },
    { name: 'PARAGON CHAPPAL EMPORIUM 🩴', bg: '#e85d04' },
    { name: 'GOLGAPPA KING & CHAT 🌶️', bg: '#c9184a' },
    { name: 'BOLLYWOOD HAIR SALON 💇‍♂️', bg: '#0096c7' }
  ];

  const SHOP_COLORS = [0xff595e, 0xffca3a, 0x8ac926, 0x1982c4, 0x6a4c93, 0xff924c];

  function createCitySegment(zPos, index) {
    const segGroup = new THREE.Group();
    segGroup.position.z = zPos;

    // 1. Main Asphalt Road
    const roadMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(ROAD_WIDTH, SEGMENT_LENGTH),
      new THREE.MeshStandardMaterial({ color: 0x2b2d42, roughness: 0.85 })
    );
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.receiveShadow = true;
    segGroup.add(roadMesh);

    // 2. Sidewalks (Indian Yellow/Black Curb & Dusty Footpath)
    [-1, 1].forEach(side => {
      const sidewalk = new THREE.Mesh(
        new THREE.BoxGeometry(10, 0.35, SEGMENT_LENGTH),
        new THREE.MeshStandardMaterial({ color: 0xc29b61, roughness: 0.9 })
      );
      sidewalk.position.set(side * (ROAD_WIDTH / 2 + 5), 0.17, 0);
      sidewalk.receiveShadow = true;
      segGroup.add(sidewalk);

      // Curb stripes
      for (let k = -SEGMENT_LENGTH / 2 + 2; k < SEGMENT_LENGTH / 2; k += 4) {
        const curbColor = ((k / 4) % 2 === 0) ? 0xffbe0b : 0x111111;
        const curb = new THREE.Mesh(
          new THREE.BoxGeometry(0.45, 0.4, 2),
          new THREE.MeshBasicMaterial({ color: curbColor })
        );
        curb.position.set(side * (ROAD_WIDTH / 2 + 0.2), 0.2, k);
        segGroup.add(curb);
      }
    });

    // 3. White Lane Striping
    [-4.125, -1.375, 1.375, 4.125].forEach(lx => {
      for (let z = -SEGMENT_LENGTH / 2 + 3; z < SEGMENT_LENGTH / 2; z += 8) {
        const dash = new THREE.Mesh(
          new THREE.PlaneGeometry(0.18, 3.6),
          new THREE.MeshBasicMaterial({ color: 0xedf2f4 })
        );
        dash.rotation.x = -Math.PI / 2;
        dash.position.set(lx, 0.02, z);
        segGroup.add(dash);
      }
    });

    // 4. Colorful Indian Shops, Vendors & Reacting Spectators along Both Sides
    [-1, 1].forEach(side => {
      for (let zOffset = -14; zOffset <= 14; zOffset += 14) {
        const bWidth = 7 + Math.random() * 2;
        const bHeight = 7 + Math.random() * 7;
        const bDepth = 10;
        const bColor = SHOP_COLORS[Math.floor(Math.random() * SHOP_COLORS.length)];

        const building = new THREE.Mesh(
          new THREE.BoxGeometry(bWidth, bHeight, bDepth),
          new THREE.MeshStandardMaterial({ color: bColor, roughness: 0.7 })
        );
        const bx = side * (ROAD_WIDTH / 2 + 5.5);
        building.position.set(bx, bHeight / 2 + 0.35, zOffset);
        building.castShadow = true;
        segGroup.add(building);

        // Shop Signboard facing road
        const signData = SHOP_SIGNS[(index + Math.abs(zOffset)) % SHOP_SIGNS.length];
        const signTex = makeSignTexture(signData.name, signData.bg);
        const signBoard = new THREE.Mesh(
          new THREE.BoxGeometry(0.25, 1.8, 7.5),
          new THREE.MeshBasicMaterial({ map: signTex })
        );
        signBoard.position.set(
          side * (ROAD_WIDTH / 2 + 1.85),
          4.2,
          zOffset
        );
        segGroup.add(signBoard);

        // Roadside Tapri / Street Vendor Umbrella or Palm Tree
        if (Math.random() > 0.35) {
          const vendorX = side * (ROAD_WIDTH / 2 + 1.6);
          const umbrellaPole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.08, 2.6, 8),
            chromeMat
          );
          umbrellaPole.position.set(vendorX, 1.5, zOffset + 4);
          segGroup.add(umbrellaPole);

          const umbrellaTop = new THREE.Mesh(
            new THREE.ConeGeometry(1.7, 0.9, 8),
            new THREE.MeshStandardMaterial({ color: Math.random() > 0.5 ? 0xff0055 : 0xffbe0b })
          );
          umbrellaTop.position.set(vendorX, 2.9, zOffset + 4);
          segGroup.add(umbrellaTop);

          // Jumping Background Spectator cheering at the chase
          const npc = new THREE.Group();
          const npcBody = new THREE.Mesh(
            new THREE.BoxGeometry(0.55, 0.9, 0.4),
            new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff })
          );
          npcBody.position.y = 0.85;
          npc.add(npcBody);
          const npcHead = new THREE.Mesh(
            new THREE.SphereGeometry(0.28, 10, 10),
            skinMat
          );
          npcHead.position.y = 1.55;
          npc.add(npcHead);
          npc.position.set(vendorX, 0.35, zOffset + 2.5);
          segGroup.add(npc);
        }
      }
    });

    // 5. Overhead Festive Bollywood Marigold / Bunting Banner across the street
    if (index % 2 === 0) {
      const rope = new THREE.Mesh(
        new THREE.BoxGeometry(ROAD_WIDTH + 4, 0.12, 0.12),
        new THREE.MeshBasicMaterial({ color: 0xffbe0b })
      );
      rope.position.set(0, 7.2, 0);
      segGroup.add(rope);

      for (let fx = -7; fx <= 7; fx += 1.4) {
        const flag = new THREE.Mesh(
          new THREE.ConeGeometry(0.45, 0.95, 4),
          new THREE.MeshBasicMaterial({ color: fx % 2 === 0 ? 0xff0055 : 0x00f5d4 })
        );
        flag.rotation.x = Math.PI;
        flag.position.set(fx, 6.7, 0);
        segGroup.add(flag);
      }
    }

    scene.add(segGroup);
    return segGroup;
  }

  for (let i = 0; i < NUM_SEGMENTS; i++) {
    roadSegments.push(createCitySegment(-i * SEGMENT_LENGTH, i));
  }

  // ==================== OBSTACLES, COINS, POWERUPS & CHAPPALS ====================
  const obstacles = [];
  const collectibles = [];
  const flyingChappals = [];
  const droppedHazards = []; // Oil slicks, fake apologies, chaos autos behind player

  // 1. Auto-Rickshaw Builder (Classic Green & Yellow Kali-Peeli / Green Auto)
  function buildAutoRickshaw() {
    const auto = new THREE.Group();
    const lowerBody = new THREE.Mesh(
      new THREE.BoxGeometry(1.75, 0.95, 2.7),
      new THREE.MeshStandardMaterial({ color: 0x2b9348, roughness: 0.5 })
    );
    lowerBody.position.y = 0.72;
    lowerBody.castShadow = true;
    auto.add(lowerBody);

    const canopy = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 1.0, 2.4),
      new THREE.MeshStandardMaterial({ color: 0xffbe0b, roughness: 0.4 })
    );
    canopy.position.set(0, 1.65, 0.1);
    canopy.castShadow = true;
    auto.add(canopy);

    const windshield = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 0.75),
      new THREE.MeshBasicMaterial({ color: 0x90e0ef, side: THREE.DoubleSide })
    );
    windshield.position.set(0, 1.6, -1.12);
    auto.add(windshield);

    return { mesh: auto, width: 1.8, height: 2.2, depth: 2.7, speed: 9, type: 'Auto-Rickshaw 🛺', jumpable: false };
  }

  // 2. Colorful Indian City Bus ("HORN OK PLEASE")
  function buildIndianBus() {
    const bus = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(2.35, 2.9, 6.2),
      new THREE.MeshStandardMaterial({ color: 0xe63946, roughness: 0.5 })
    );
    body.position.y = 1.75;
    body.castShadow = true;
    bus.add(body);

    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.45, 6.25),
      new THREE.MeshBasicMaterial({ color: 0xffbe0b })
    );
    stripe.position.y = 1.4;
    bus.add(stripe);

    return { mesh: bus, width: 2.35, height: 3.2, depth: 6.2, speed: 12, type: 'BEST City Bus 🚌', jumpable: false };
  }

  // 3. Street Dog / Chill Gaiya on Road (Jumpable or Dodgeable)
  function buildStreetDog() {
    const dog = new THREE.Group();
    const dogMat = new THREE.MeshStandardMaterial({ color: 0xc68b59 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.55, 1.25), dogMat);
    body.position.y = 0.55;
    body.castShadow = true;
    dog.add(body);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.55), dogMat);
    head.position.set(0, 0.9, -0.55);
    dog.add(head);

    return { mesh: dog, width: 1.1, height: 1.1, depth: 1.3, speed: 2, type: 'Street Doggy 🐕', jumpable: true };
  }

  // 4. Giant Chai / Samosa Thela Cart (Jumpable with high wheelie or lane switch)
  function buildChaiCart() {
    const cart = new THREE.Group();
    const table = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 0.9, 1.8),
      new THREE.MeshStandardMaterial({ color: 0x8d5524 })
    );
    table.position.y = 0.75;
    table.castShadow = true;
    cart.add(table);

    const kettle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.32, 0.55, 12),
      chromeMat
    );
    kettle.position.set(0, 1.45, 0);
    cart.add(kettle);

    return { mesh: cart, width: 1.9, height: 1.5, depth: 1.8, speed: 0, type: 'Garam Chai Thela ☕', jumpable: true };
  }

  // 5. Indian Road Pothole / Open Manhole (Jumpable!)
  function buildPothole() {
    const pothole = new THREE.Group();
    const hole = new THREE.Mesh(
      new THREE.CircleGeometry(1.05, 18),
      new THREE.MeshBasicMaterial({ color: 0x0b090a })
    );
    hole.rotation.x = -Math.PI / 2;
    hole.position.y = 0.03;
    pothole.add(hole);

    const puddle = new THREE.Mesh(
      new THREE.RingGeometry(0.95, 1.25, 18),
      new THREE.MeshBasicMaterial({ color: 0xffbe0b, side: THREE.DoubleSide })
    );
    puddle.rotation.x = -Math.PI / 2;
    puddle.position.y = 0.04;
    pothole.add(puddle);

    return { mesh: pothole, width: 1.7, height: 0.4, depth: 1.7, speed: 0, type: 'Municipal Pothole 🕳️', jumpable: true };
  }

  function spawnObstacleRow(zPos) {
    // Pick 1 to 3 lanes to populate so there is ALWAYS a clear escape route
    const usedLanes = new Set();
    const count = state.distance > 400 ? (Math.random() > 0.45 ? 3 : 2) : (Math.random() > 0.4 ? 2 : 1);

    for (let i = 0; i < count; i++) {
      const laneIdx = Math.floor(Math.random() * LANES.length);
      if (usedLanes.has(laneIdx)) continue;
      usedLanes.add(laneIdx);

      const roll = Math.random();
      let obsData;
      if (roll < 0.30) obsData = buildAutoRickshaw();
      else if (roll < 0.48) obsData = buildIndianBus();
      else if (roll < 0.68) obsData = buildStreetDog();
      else if (roll < 0.84) obsData = buildChaiCart();
      else obsData = buildPothole();

      obsData.lane = laneIdx;
      obsData.mesh.position.set(LANES[laneIdx], 0, zPos - Math.random() * 8);
      scene.add(obsData.mesh);
      obstacles.push(obsData);
    }

    // Spawn Coins or Power-up in one of the free lanes
    const freeLanes = [0, 1, 2, 3, 4].filter(l => !usedLanes.has(l));
    if (freeLanes.length > 0) {
      const coinLane = freeLanes[Math.floor(Math.random() * freeLanes.length)];
      if (Math.random() < 0.25) {
        // Spawn Floating Power-Up Box
        const types = ['turbo', 'oil', 'apology', 'shield', 'chaos'];
        const pType = types[Math.floor(Math.random() * types.length)];
        const colors = { turbo: 0xff0055, oil: 0x9b5de5, apology: 0xff85a1, shield: 0x00f5d4, chaos: 0xffbe0b };
        const puMesh = new THREE.Mesh(
          new THREE.OctahedronGeometry(0.75, 0),
          new THREE.MeshStandardMaterial({ color: colors[pType], emissive: colors[pType], emissiveIntensity: 0.45 })
        );
        puMesh.position.set(LANES[coinLane], 1.2, zPos);
        scene.add(puMesh);
        collectibles.push({ mesh: puMesh, kind: 'powerup', powerType: pType });
      } else {
        // Line of 4 Gold Coins
        for (let c = 0; c < 4; c++) {
          const coinMesh = new THREE.Mesh(
            new THREE.CylinderGeometry(0.48, 0.48, 0.14, 16),
            new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 })
          );
          coinMesh.rotation.z = Math.PI / 2;
          coinMesh.position.set(LANES[coinLane], 1.05, zPos - c * 3.5);
          scene.add(coinMesh);
          collectibles.push({ mesh: coinMesh, kind: 'coin' });
        }
      }
    }
  }

  // ==================== FLYING CHAPPAL ATTACK SYSTEM ====================
  const chappalWarnEl = document.getElementById('chappal-warning');

  function throwFlyingChappal() {
    if (state.mode !== 'PLAYING' || state.gfSlipTimer > 0) return;

    audio.playChappalWhoosh();
    const chappalMesh = createChappalMesh(1.85);
    const startX = gfGroup.position.x;
    const targetLaneX = LANES[state.laneIndex];

    chappalMesh.position.set(startX, 2.1, gfGroup.position.z - 0.5);
    scene.add(chappalMesh);

    flyingChappals.push({
      mesh: chappalMesh,
      vx: (targetLaneX - startX) * 1.35,
      vz: -(state.speed + 22), // Flies past the player from behind!
      dodgedCounted: false
    });

    chappalWarnEl.classList.remove('hidden');
    setTimeout(() => chappalWarnEl.classList.add('hidden'), 1150);
  }

  // ==================== POWER-UP EXECUTION (ALL 5 FUNNY POWER-UPS) ====================
  const bannerEl = document.getElementById('powerup-banner');
  const bannerTextEl = document.getElementById('powerup-banner-text');
  const speedLinesEl = document.getElementById('speed-lines');
  const shieldIndEl = document.getElementById('shield-indicator');

  function showPowerBanner(text) {
    bannerTextEl.textContent = text;
    bannerEl.classList.remove('hidden');
    clearTimeout(showPowerBanner._timer);
    showPowerBanner._timer = setTimeout(() => bannerEl.classList.add('hidden'), 2200);
  }

  function updatePowerupHUD() {
    ['turbo', 'oil', 'apology', 'shield', 'chaos'].forEach(key => {
      const countEl = document.getElementById(`count-${key}`);
      const btnEl = document.getElementById(`pu-${key}`);
      if (countEl) countEl.textContent = state.inventory[key];
      if (btnEl) {
        if (state.inventory[key] <= 0 && state.coins < 5) {
          btnEl.classList.add('disabled');
        } else {
          btnEl.classList.remove('disabled');
        }
      }
    });
  }

  function activatePowerup(type) {
    if (state.mode !== 'PLAYING') return;

    // Can use from inventory OR spend 5 coins on the fly!
    if (state.inventory[type] > 0) {
      state.inventory[type]--;
    } else if (state.coins >= 5) {
      state.coins -= 5;
    } else {
      triggerBark('boy', "NO POWER-UP LEFT! LOOT MORE COINS! 🪙");
      return;
    }

    updatePowerupHUD();

    if (type === 'turbo') {
      // 1. TURBO BOOST: Scooty flies forward with nitro wheelie!
      state.turboTimer = 3.6;
      state.gfDistance = Math.min(34, state.gfDistance + 8);
      turboFlame.visible = true;
      speedLinesEl.classList.remove('hidden');
      showPowerBanner('🚀 TURBO DHOOM BOOST ACTIVATED!');
      triggerBark('boy', "DHOOM MACHALE MODE ON!! HOLD TIGHT!!");
      audio.playHorn();
    } else if (type === 'oil') {
      // 2. OIL SLICK: Drops slippery puddle behind scooty, girlfriend slips & spins!
      const slick = new THREE.Mesh(
        new THREE.CircleGeometry(1.9, 18),
        new THREE.MeshBasicMaterial({ color: 0x1a1423 })
      );
      slick.rotation.x = -Math.PI / 2;
      slick.position.set(playerGroup.position.x, 0.05, playerGroup.position.z + 2.5);
      scene.add(slick);
      droppedHazards.push({ mesh: slick, life: 2.5 });

      state.gfSlipTimer = 3.0;
      state.gfDistance = Math.min(34, state.gfDistance + 7.5);
      state.anger = Math.min(100, state.anger + 10);
      audio.playCartoonSlip();
      showPowerBanner('🛢️ OIL SLICK! GIRLFRIEND SLIPPED!');
      triggerBark('gf', "AAAAH! SARSO KA TEL ON THE ROAD?! CHEATER!!");
    } else if (type === 'apology') {
      // 3. FAKE APOLOGY: Throws bouquet & "SORRY BABY" heart, slowing her down!
      const heart = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.9, 1),
        new THREE.MeshBasicMaterial({ color: 0xff4d94 })
      );
      heart.position.set(playerGroup.position.x, 1.5, playerGroup.position.z + 3);
      scene.add(heart);
      droppedHazards.push({ mesh: heart, life: 2.5 });

      state.gfSlowTimer = 4.2;
      state.anger = Math.max(10, state.anger - 24);
      state.gfDistance = Math.min(34, state.gfDistance + 6);
      showPowerBanner('💐 FAKE APOLOGY! SHE IS CONFUSED!');
      triggerBark('boy', "BABY SHE IS MY COUSIN SISTER FROM KANPUR I PROMISE!!");
    } else if (type === 'shield') {
      // 4. HELMET SHIELD: Protects against flying slippers & 1 traffic crash
      state.shieldActive = true;
      state.shieldTimer = 8.0;
      helmetBubble.visible = true;
      shieldIndEl.classList.remove('hidden');
      showPowerBanner('🪖 ISI MARK HELMET SHIELD ACTIVE!');
      triggerBark('otherGirl', "FINALLY SOME PROTECTION FROM THOSE FLYING CHAPPALS!");
    } else if (type === 'chaos') {
      // 5. TRAFFIC CHAOS: Random auto-rickshaws swerve behind player to block her path!
      for (let k = -1; k <= 1; k++) {
        const blockade = buildAutoRickshaw();
        blockade.mesh.position.set(playerGroup.position.x + k * 2.4, 0, playerGroup.position.z + 4.2);
        blockade.mesh.rotation.y = Math.PI / 2;
        scene.add(blockade.mesh);
        droppedHazards.push({ mesh: blockade.mesh, life: 3.0 });
      }
      state.gfSlipTimer = 2.8;
      state.gfDistance = Math.min(35, state.gfDistance + 9.5);
      audio.playHorn();
      showPowerBanner('🛺 TRAFFIC CHAOS! AUTOS BLOCKED HER!');
      triggerBark('npc', "AUTO UNION: 'Madam ji meter se aage nahi jaane denge!' 🛺");
    }
  }

  // ==================== LIVE COMIC BARKS (SPEECH BUBBLES) ====================
  const barksContainer = document.getElementById('live-barks-container');

  function triggerBark(who, customText = null) {
    const pool = BARKS[who] || BARKS.boy;
    const text = customText || pool[Math.floor(Math.random() * pool.length)];

    barksContainer.innerHTML = '';
    const div = document.createElement('div');
    let classExtra = '';
    let imgSrc = 'assets/boy.png';
    let speakerTitle = 'PANICKED BOY 😱';

    if (who === 'gf') {
      classExtra = 'gf-bark';
      imgSrc = 'assets/girl.png';
      speakerTitle = 'FURIOUS GIRLFRIEND 🤬🩴';
    } else if (who === 'otherGirl') {
      classExtra = 'other-bark';
      imgSrc = 'assets/boy.png';
      speakerTitle = 'GIRL ON BACKSEAT 😱';
    } else if (who === 'npc') {
      classExtra = 'npc-bark';
      imgSrc = 'assets/boy.png';
      speakerTitle = 'ROADSIDE PUBLIC 🤣';
    }

    div.className = `comic-bark ${classExtra}`;
    div.innerHTML = `
      <img src="${imgSrc}" alt="${speakerTitle}" />
      <div>
        <span class="bark-speaker">${speakerTitle}</span>
        <span>${text}</span>
      </div>
    `;
    barksContainer.appendChild(div);

    // Optional short voice synthesis
    if (customText && state.mode === 'PLAYING') {
      audio.speak(text.replace(/[^\w\s!'?,.-]/g, ''), who === 'gf' ? 1.3 : 1.1, 1.25);
    }

    clearTimeout(triggerBark._t);
    triggerBark._t = setTimeout(() => {
      if (div.parentNode) div.remove();
    }, 3100);
  }

  // ==================== CONTROLS (KEYBOARD + TOUCH SWIPE + BUTTONS) ====================
  function moveLeft() {
    if (state.mode !== 'PLAYING') return;
    if (state.laneIndex > 0) {
      state.laneIndex--;
      state.targetX = LANES[state.laneIndex];
    }
  }

  function moveRight() {
    if (state.mode !== 'PLAYING') return;
    if (state.laneIndex < LANES.length - 1) {
      state.laneIndex++;
      state.targetX = LANES[state.laneIndex];
    }
  }

  function jumpScooty() {
    if (state.mode !== 'PLAYING') return;
    if (!state.isJumping) {
      state.isJumping = true;
      state.playerVy = 12.5;
      audio.playHorn();
    }
  }

  window.addEventListener('keydown', e => {
    if (state.mode === 'CUTSCENE' && (e.key === ' ' || e.key === 'Enter')) {
      advanceCutscene();
      return;
    }
    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
      togglePause();
      return;
    }
    if (state.mode !== 'PLAYING') return;

    switch (e.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        moveLeft();
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        moveRight();
        break;
      case 'ArrowUp':
      case 'w':
      case 'W':
      case ' ':
        jumpScooty();
        break;
      case '1':
        activatePowerup('turbo');
        break;
      case '2':
        activatePowerup('oil');
        break;
      case '3':
        activatePowerup('apology');
        break;
      case '4':
        activatePowerup('shield');
        break;
      case '5':
        activatePowerup('chaos');
        break;
    }
  });

  // Mobile Swipe Gestures on Canvas
  let touchStartX = 0;
  let touchStartY = 0;
  renderer.domElement.addEventListener('touchstart', e => {
    if (!e.touches.length) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  renderer.domElement.addEventListener('touchend', e => {
    if (!e.changedTouches.length || state.mode !== 'PLAYING') return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 28) {
      if (dx < 0) moveLeft();
      else moveRight();
    } else if (dy < -30) {
      jumpScooty();
    }
  }, { passive: true });

  // On-Screen Touch & Power-Up Buttons
  document.getElementById('btn-left').addEventListener('click', moveLeft);
  document.getElementById('btn-right').addEventListener('click', moveRight);
  document.getElementById('btn-jump').addEventListener('click', jumpScooty);

  document.querySelectorAll('.powerup-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pType = btn.getAttribute('data-power');
      activatePowerup(pType);
    });
  });

  // ==================== UI & GAME LIFECYCLE MANAGEMENT ====================
  const mainMenuEl = document.getElementById('main-menu');
  const cutsceneEl = document.getElementById('cutscene-overlay');
  const hudEl = document.getElementById('hud');
  const pauseEl = document.getElementById('pause-menu');
  const gameoverEl = document.getElementById('gameover-menu');
  const damageFlashEl = document.getElementById('damage-flash');

  function clearWorldEntities() {
    obstacles.forEach(o => scene.remove(o.mesh));
    obstacles.length = 0;
    collectibles.forEach(c => scene.remove(c.mesh));
    collectibles.length = 0;
    flyingChappals.forEach(fc => scene.remove(fc.mesh));
    flyingChappals.length = 0;
    droppedHazards.forEach(dh => scene.remove(dh.mesh));
    droppedHazards.length = 0;
  }

  function resetGameState() {
    clearWorldEntities();

    state.laneIndex = 2;
    state.targetX = LANES[2];
    state.playerX = 0;
    state.playerY = 0;
    state.playerVy = 0;
    state.isJumping = false;

    state.baseSpeed = 26;
    state.speed = 26;
    state.distance = 0;
    state.score = 0;
    state.coins = 5; // Start with 5 bonus coins
    state.chappalsDodged = 0;

    state.gfDistance = 18;
    state.anger = 32;
    state.gfSlipTimer = 0;
    state.gfSlowTimer = 0;
    state.chappalCooldown = 2.8;

    state.inventory = { turbo: 2, oil: 1, apology: 1, shield: 1, chaos: 1 };
    state.turboTimer = 0;
    state.shieldActive = false;
    state.shieldTimer = 0;
    state.invincibleTimer = 0;
    state.cameraShake = 0;

    turboFlame.visible = false;
    helmetBubble.visible = false;
    speedLinesEl.classList.add('hidden');
    shieldIndEl.classList.add('hidden');
    chappalWarnEl.classList.add('hidden');

    playerGroup.position.set(0, 0, 0);
    playerGroup.rotation.set(0, 0, 0);
    scootyMeshGroup.rotation.set(0, 0, 0);
    gfGroup.position.set(0, 0, 9);
    gfGroup.rotation.set(0, 0, 0);

    // Pre-populate obstacle rows ahead
    for (let z = -45; z >= -260; z -= 34) {
      spawnObstacleRow(z);
    }

    updatePowerupHUD();
  }

  function startCutscene() {
    audio.init();
    mainMenuEl.classList.add('hidden');
    gameoverEl.classList.add('hidden');
    pauseEl.classList.add('hidden');
    hudEl.classList.add('hidden');
    cutsceneEl.classList.remove('hidden');

    resetGameState();
    state.mode = 'CUTSCENE';
    state.cutsceneIdx = 0;
    renderCutsceneLine();
  }

  function renderCutsceneLine() {
    const line = CUTSCENE_LINES[state.cutsceneIdx];
    document.getElementById('cutscene-speaker-img').src = line.img;
    document.getElementById('cutscene-speaker-name').textContent = line.speaker;
    document.getElementById('cutscene-text').textContent = line.text;
    audio.speak(line.text.replace(/"/g, ''), line.voicePitch, 1.18);
  }

  function advanceCutscene() {
    state.cutsceneIdx++;
    if (state.cutsceneIdx >= CUTSCENE_LINES.length) {
      startGameplay();
    } else {
      renderCutsceneLine();
    }
  }

  function startGameplay() {
    audio.init();
    mainMenuEl.classList.add('hidden');
    cutsceneEl.classList.add('hidden');
    gameoverEl.classList.add('hidden');
    pauseEl.classList.add('hidden');
    hudEl.classList.remove('hidden');

    resetGameState();
    state.mode = 'PLAYING';
    audio.startEngine();
    audio.startDholBGM();

    triggerBark('boy', "AREYYYY! BABY! LISTEN! IT'S NOT WHAT YOU THINK!!!");
  }

  function togglePause() {
    if (state.mode === 'PLAYING') {
      state.mode = 'PAUSED';
      pauseEl.classList.remove('hidden');
      audio.stopEngine();
    } else if (state.mode === 'PAUSED') {
      state.mode = 'PLAYING';
      pauseEl.classList.add('hidden');
      audio.startEngine();
    }
  }

  function triggerDamageFlash() {
    damageFlashEl.classList.remove('hidden');
    damageFlashEl.style.animation = 'none';
    void damageFlashEl.offsetWidth;
    damageFlashEl.style.animation = 'flashPulse 0.45s ease-out forwards';
    setTimeout(() => damageFlashEl.classList.add('hidden'), 460);
  }

  function triggerCaughtGameOver(reason) {
    if (state.mode === 'GAMEOVER_ANIM' || state.mode === 'GAMEOVER') return;
    state.mode = 'GAMEOVER_ANIM';
    state.gameoverReason = reason;
    audio.stopEngine();
    audio.stopDholBGM();
    audio.playSlapImpact();

    triggerBark('gf', "STOP RIGHT THERE, YOU CHEATER!! PATAAAK!! 🩴💥");

    // Move GF right next to the scooty for the dramatic 3D chappal smackdown animation
    gfGroup.position.set(playerGroup.position.x + 1.1, 0, playerGroup.position.z + 0.5);

    setTimeout(() => {
      audio.playSlapImpact();
      state.mode = 'GAMEOVER';
      hudEl.classList.add('hidden');
      gameoverEl.classList.remove('hidden');

      document.getElementById('gameover-reason').textContent = state.gameoverReason;
      document.getElementById('go-distance').textContent = `${Math.floor(state.distance)} m`;
      document.getElementById('go-score').textContent = Math.floor(state.score);
      document.getElementById('go-coins').textContent = state.coins;
      document.getElementById('go-chappals').textContent = state.chappalsDodged;
    }, 1500);
  }

  // Button Bindings
  document.getElementById('btn-start-story').addEventListener('click', startCutscene);
  document.getElementById('btn-quick-play').addEventListener('click', startGameplay);
  document.getElementById('btn-next-dialogue').addEventListener('click', advanceCutscene);
  document.getElementById('btn-skip-cutscene').addEventListener('click', startGameplay);

  document.getElementById('btn-pause').addEventListener('click', togglePause);
  document.getElementById('btn-resume').addEventListener('click', togglePause);
  document.getElementById('btn-restart-hud').addEventListener('click', startGameplay);
  document.getElementById('btn-pause-restart').addEventListener('click', startGameplay);
  document.getElementById('btn-try-again').addEventListener('click', startGameplay);

  const goHome = () => {
    state.mode = 'MENU';
    audio.stopEngine();
    audio.stopDholBGM();
    hudEl.classList.add('hidden');
    pauseEl.classList.add('hidden');
    gameoverEl.classList.add('hidden');
    cutsceneEl.classList.add('hidden');
    mainMenuEl.classList.remove('hidden');
  };
  document.getElementById('btn-pause-home').addEventListener('click', goHome);
  document.getElementById('btn-go-menu').addEventListener('click', goHome);

  document.getElementById('btn-mute').addEventListener('click', e => {
    const muted = audio.toggleMute();
    e.currentTarget.textContent = muted ? '🔇' : '🔊';
  });

  // ==================== HUD DOM REFERENCES ====================
  const hudDistEl = document.getElementById('hud-distance');
  const hudScoreEl = document.getElementById('hud-score');
  const hudCoinsEl = document.getElementById('hud-coins');
  const hudSpeedEl = document.getElementById('hud-speed');
  const angerFillEl = document.getElementById('anger-bar-fill');
  const gfDistTextEl = document.getElementById('gf-distance-text');

  // ==================== MAIN GAME LOOP ====================
  let lastTime = performance.now();

  function animate(now) {
    requestAnimationFrame(animate);
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    const t = now * 0.001;

    // Idle Menu / Cutscene Camera Orbit
    if (state.mode === 'MENU' || state.mode === 'CUTSCENE') {
      playerGroup.position.x = Math.sin(t * 1.5) * 1.2;
      scootyMeshGroup.rotation.z = -Math.cos(t * 1.5) * 0.08;
      gfGroup.position.x = playerGroup.position.x;
      gfGroup.position.z = 5.5 + Math.sin(t * 3) * 0.5;
      gfLeftLeg.rotation.x = Math.sin(t * 16) * 0.8;
      gfRightLeg.rotation.x = -Math.sin(t * 16) * 0.8;
      gfRightArmGroup.rotation.x = Math.sin(t * 12) * 0.6;
      camera.position.set(Math.sin(t * 0.5) * 3.2, 4.5, 9.8);
      camera.lookAt(0, 1.4, -2);
      renderer.render(scene, camera);
      return;
    }

    // Caught Chappal Beatdown Animation before Game Over card
    if (state.mode === 'GAMEOVER_ANIM') {
      gfRightArmGroup.rotation.x = Math.sin(t * 35) * 1.35;
      boyHeadGroup.rotation.y = Math.sin(t * 30) * 0.7;
      scootyMeshGroup.rotation.z = Math.sin(t * 25) * 0.25;
      camera.position.lerp(new THREE.Vector3(playerGroup.position.x, 3.4, 5.8), 0.1);
      camera.lookAt(playerGroup.position.x, 1.5, 0);
      renderer.render(scene, camera);
      return;
    }

    if (state.mode !== 'PLAYING') {
      renderer.render(scene, camera);
      return;
    }

    // 1. DIFFICULTY & SPEED PROGRESSION
    state.baseSpeed = Math.min(state.maxSpeed, 26 + state.distance * 0.015);
    if (state.turboTimer > 0) {
      state.turboTimer -= dt;
      state.speed = state.baseSpeed * 1.75;
      scootyMeshGroup.rotation.x = THREE.MathUtils.lerp(scootyMeshGroup.rotation.x, 0.28, 0.15); // Wheelie!
      if (state.turboTimer <= 0) {
        turboFlame.visible = false;
        speedLinesEl.classList.add('hidden');
      }
    } else {
      state.speed = THREE.MathUtils.lerp(state.speed, state.baseSpeed, 0.1);
      scootyMeshGroup.rotation.x = THREE.MathUtils.lerp(scootyMeshGroup.rotation.x, 0, 0.15);
    }

    // Shield Timer
    if (state.shieldActive) {
      state.shieldTimer -= dt;
      helmetBubble.rotation.y += dt * 2.5;
      if (state.shieldTimer <= 0) {
        state.shieldActive = false;
        helmetBubble.visible = false;
        shieldIndEl.classList.add('hidden');
      }
    }

    if (state.invincibleTimer > 0) state.invincibleTimer -= dt;

    const moveZ = state.speed * dt;
    state.distance += moveZ * 0.45;
    state.score += moveZ * 1.2;

    audio.updateEngine((state.speed - 20) / 35, state.turboTimer > 0);

    // 2. SCOOTY STEERING, JUMPING & FUNNY CHARACTER ANIMATIONS
    const prevX = state.playerX;
    state.playerX = THREE.MathUtils.lerp(state.playerX, state.targetX, Math.min(1, dt * 13));
    playerGroup.position.x = state.playerX;

    // Banking tilt when turning
    const tilt = (prevX - state.playerX) * 0.55;
    scootyMeshGroup.rotation.z = THREE.MathUtils.lerp(scootyMeshGroup.rotation.z, tilt, 0.2);

    // Jump physics
    if (state.isJumping) {
      state.playerY += state.playerVy * dt;
      state.playerVy -= 32 * dt;
      if (state.playerY <= 0) {
        state.playerY = 0;
        state.playerVy = 0;
        state.isJumping = false;
      }
    }
    playerGroup.position.y = state.playerY;

    // Spin Scooty wheels & animate panicked boy & screaming passenger girl
    frontWheel.rotation.x -= moveZ * 1.4;
    backWheel.rotation.x -= moveZ * 1.4;
    boyHeadGroup.rotation.y = Math.sin(t * 7) * 0.35; // Looking back in panic
    ogLeftArm.rotation.z = 0.65 + Math.sin(t * 18) * 0.35;
    ogRightArm.rotation.z = -0.65 - Math.sin(t * 18) * 0.35;

    // 3. GIRLFRIEND ANGER, CHASE PROXIMITY & FLYING CHAPPAL LOGIC
    state.anger = Math.min(100, state.anger + dt * 1.85);

    if (state.gfSlipTimer > 0) {
      state.gfSlipTimer -= dt;
      gfGroup.rotation.y += dt * 14; // Cartoon spin out on oil slick!
    } else {
      gfGroup.rotation.y = THREE.MathUtils.lerp(gfGroup.rotation.y, 0, 0.2);
      const angerMultiplier = 1 + (state.anger / 100) * 0.85;
      const slowFactor = state.gfSlowTimer > 0 ? 0.35 : 1.0;
      if (state.gfSlowTimer > 0) state.gfSlowTimer -= dt;

      // Girlfriend gradually closes distance unless player collects boosts or dodges cleanly
      if (state.turboTimer <= 0) {
        const creepRate = (0.55 * angerMultiplier * slowFactor) - 0.15;
        state.gfDistance = Math.max(0, state.gfDistance - creepRate * dt);
      }
    }

    // Visual position of Girlfriend behind the scooty
    const visualGfZ = 2.1 + (state.gfDistance / 30) * 8.2;
    gfGroup.position.z = THREE.MathUtils.lerp(gfGroup.position.z, visualGfZ, 0.12);
    gfGroup.position.x = THREE.MathUtils.lerp(gfGroup.position.x, state.playerX, dt * 4.5);

    // Hilarious high-speed running legs & chappal waving
    const runFreq = 20 + (state.anger * 0.15);
    gfLeftLeg.rotation.x = Math.sin(t * runFreq) * 1.05;
    gfRightLeg.rotation.x = -Math.sin(t * runFreq) * 1.05;
    gfRightArmGroup.rotation.x = Math.sin(t * (runFreq * 0.7)) * 0.85;
    gfAura.scale.setScalar(1 + Math.sin(t * 10) * 0.15);

    // Check if Girlfriend caught the scooty!
    if (state.gfDistance <= 0.4) {
      triggerCaughtGameOver('She sprinted faster than your 110cc Scooty and delivered a mortal Chappal combo!');
      return;
    }

    // Girlfriend throws flying slippers more frequently as her anger rises
    state.chappalCooldown -= dt;
    if (state.chappalCooldown <= 0) {
      throwFlyingChappal();
      state.chappalCooldown = Math.max(1.45, 4.2 - (state.anger / 100) * 2.4);
    }

    // Periodic random hilarious voice/comic barks
    state.barkCooldown -= dt;
    if (state.barkCooldown <= 0) {
      const speakers = ['boy', 'gf', 'otherGirl', 'npc'];
      triggerBark(speakers[Math.floor(Math.random() * speakers.length)]);
      state.barkCooldown = 4.8 + Math.random() * 2.5;
    }

    // 4. ENDLESS CITY SEGMENT RECYCLING
    roadSegments.forEach(seg => {
      seg.position.z += moveZ;
      if (seg.position.z > SEGMENT_LENGTH) {
        seg.position.z -= NUM_SEGMENTS * SEGMENT_LENGTH;
      }
    });

    // 5. UPDATE OBSTACLES & COLLISION DETECTION
    let minObsZ = 0;
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i];
      obs.mesh.position.z += (state.speed - obs.speed) * dt;
      if (obs.mesh.position.z < minObsZ) minObsZ = obs.mesh.position.z;

      // Collision check with player scooty
      const dz = Math.abs(obs.mesh.position.z - playerGroup.position.z);
      const dx = Math.abs(obs.mesh.position.x - playerGroup.position.x);

      if (dz < (obs.depth / 2 + 0.95) && dx < (obs.width / 2 + 0.48)) {
        const jumpedOver = obs.jumpable && state.playerY > 0.75;
        if (!jumpedOver && state.invincibleTimer <= 0 && state.turboTimer <= 0) {
          if (state.shieldActive) {
            // Helmet Shield absorbs the crash!
            state.shieldActive = false;
            helmetBubble.visible = false;
            shieldIndEl.classList.add('hidden');
            state.invincibleTimer = 1.2;
            audio.playSlapImpact();
            showPowerBanner('🪖 HELMET SHIELD SAVED YOU!');
          } else {
            // Crash slows scooty and lets angry GF jump closer!
            state.invincibleTimer = 1.3;
            state.cameraShake = 0.45;
            state.gfDistance -= 5.8;
            state.anger = Math.min(100, state.anger + 15);
            triggerDamageFlash();
            audio.playSlapImpact();
            triggerBark('boy', `CRASHED INTO ${obs.type.toUpperCase()}! SHE'S RIGHT BEHIND US!!`);

            if (state.gfDistance <= 0.5) {
              triggerCaughtGameOver(`You crashed into a ${obs.type} and your girlfriend caught you red-handed!`);
              return;
            }
          }
          scene.remove(obs.mesh);
          obstacles.splice(i, 1);
          continue;
        }
      }

      if (obs.mesh.position.z > 18) {
        scene.remove(obs.mesh);
        obstacles.splice(i, 1);
      }
    }

    // Keep spawning fresh obstacle rows on the horizon
    if (minObsZ > -225) {
      spawnObstacleRow(minObsZ - (29 + Math.random() * 10));
    }

    // 6. UPDATE COLLECTIBLES (COINS & ROAD POWER-UPS)
    for (let i = collectibles.length - 1; i >= 0; i--) {
      const col = collectibles[i];
      col.mesh.position.z += moveZ;
      col.mesh.rotation.y += dt * 3.5;

      const dz = Math.abs(col.mesh.position.z - playerGroup.position.z);
      const dx = Math.abs(col.mesh.position.x - playerGroup.position.x);

      if (dz < 1.35 && dx < 1.25) {
        if (col.kind === 'coin') {
          state.coins++;
          state.score += 25;
          audio.playCoin();
          updatePowerupHUD();
        } else if (col.kind === 'powerup') {
          state.inventory[col.powerType]++;
          audio.playCoin();
          updatePowerupHUD();
          showPowerBanner(`🎁 LOOTED ${col.powerType.toUpperCase()} POWER-UP!`);
        }
        scene.remove(col.mesh);
        collectibles.splice(i, 1);
        continue;
      }

      if (col.mesh.position.z > 16) {
        scene.remove(col.mesh);
        collectibles.splice(i, 1);
      }
    }

    // 7. UPDATE FLYING CHAPPALS (SLIPPERS)
    for (let i = flyingChappals.length - 1; i >= 0; i--) {
      const fc = flyingChappals[i];
      fc.mesh.position.z += (state.speed + fc.vz) * dt;
      fc.mesh.position.x += fc.vx * dt;
      fc.mesh.rotation.x += dt * 18;
      fc.mesh.rotation.z += dt * 12;

      const dz = Math.abs(fc.mesh.position.z - playerGroup.position.z);
      const dx = Math.abs(fc.mesh.position.x - playerGroup.position.x);

      if (dz < 1.1 && dx < 0.95 && state.playerY < 1.1) {
        if (state.shieldActive) {
          state.shieldActive = false;
          helmetBubble.visible = false;
          shieldIndEl.classList.add('hidden');
          audio.playSlapImpact();
          showPowerBanner('🪖 HELMET DEFLECTED FLYING CHAPPAL!');
        } else if (state.invincibleTimer <= 0 && state.turboTimer <= 0) {
          state.invincibleTimer = 1.0;
          state.cameraShake = 0.35;
          state.gfDistance -= 4.2;
          triggerDamageFlash();
          audio.playSlapImpact();
          triggerBark('boy', "OUCH!! HEADSHOT BY FLYING PARAGON CHAPPAL!! 🩴💥");
          if (state.gfDistance <= 0.5) {
            triggerCaughtGameOver('A precision-guided flying Chappal knocked you off balance and she caught up!');
            return;
          }
        }
        scene.remove(fc.mesh);
        flyingChappals.splice(i, 1);
        continue;
      }

      // Count dodged chappal once it passes in front of player
      if (!fc.dodgedCounted && fc.mesh.position.z < -2) {
        fc.dodgedCounted = true;
        state.chappalsDodged++;
        state.score += 50;
      }

      if (fc.mesh.position.z < -65) {
        scene.remove(fc.mesh);
        flyingChappals.splice(i, 1);
      }
    }

    // 8. CLEANUP DROPPED HAZARDS (OIL SLICKS / FAKE APOLOGIES)
    for (let i = droppedHazards.length - 1; i >= 0; i--) {
      const dh = droppedHazards[i];
      dh.life -= dt;
      dh.mesh.position.z += moveZ * 0.4;
      if (dh.life <= 0) {
        scene.remove(dh.mesh);
        droppedHazards.splice(i, 1);
      }
    }

    // 9. THIRD-PERSON DYNAMIC CHASE CAMERA
    let shakeX = 0;
    let shakeY = 0;
    if (state.cameraShake > 0) {
      state.cameraShake -= dt;
      shakeX = (Math.random() - 0.5) * 0.7;
      shakeY = (Math.random() - 0.5) * 0.7;
    }

    const camTargetX = state.playerX * 0.65 + shakeX;
    const camTargetY = 5.2 + state.playerY * 0.35 + shakeY;
    const camTargetZ = state.turboTimer > 0 ? 11.8 : 10.2;
    camera.position.lerp(new THREE.Vector3(camTargetX, camTargetY, camTargetZ), 0.14);
    camera.lookAt(state.playerX * 0.4, 1.6, -6);

    // 10. UPDATE HUD STATS
    hudDistEl.textContent = Math.floor(state.distance);
    hudScoreEl.textContent = Math.floor(state.score);
    hudCoinsEl.textContent = state.coins;
    hudSpeedEl.textContent = Math.floor(state.speed * 2.2);

    const proximityDanger = Math.min(100, Math.max(8, ((28 - state.gfDistance) / 28) * 100));
    angerFillEl.style.width = `${proximityDanger}%`;
    gfDistTextEl.textContent = state.gfDistance < 6
      ? `⚠️ ${state.gfDistance.toFixed(1)}m! CHAPPAL RANGE!`
      : `${Math.ceil(state.gfDistance)}m BEHIND!`;

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  updatePowerupHUD();
  requestAnimationFrame(animate);
})();
