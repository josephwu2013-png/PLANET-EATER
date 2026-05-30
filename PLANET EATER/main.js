(function () {
  const STORAGE_KEY = "planet-eater-save-v2";
  const TWO_PI = Math.PI * 2;
  const SCENE_PIXEL_SCALE = 0.42;

  const PLANET_TYPES = [
    {
      id: "verdant",
      label: "Verdant Garden",
      intro: "Mossy hills and cloudy rivers. Soft, gentle, delicious.",
      difficultyWord: "Soft",
      massMult: 0.92,
      toughness: 1.02,
      valueMult: 1.02,
      ringChance: 0.12,
      unlockWave: 1,
      palette: {
        base: "#1b6f5b",
        shadow: "#0f3f34",
        highlight: "#c6ffcd",
        atmosphere: "#8bffd3",
        ring: "#d6ffe4"
      },
      patches: ["#2a8d6c", "#65d89d", "#b6ff8a"],
      craters: ["rgba(7, 42, 30, 0.42)", "rgba(17, 74, 52, 0.32)"],
      glows: ["rgba(223, 255, 184, 0.26)"]
    },
    {
      id: "oceanic",
      label: "Oceanic Drift",
      intro: "Blue swells, bright reefs, and sleepy white storms.",
      difficultyWord: "Smooth",
      massMult: 0.98,
      toughness: 1.14,
      valueMult: 1.06,
      ringChance: 0.16,
      unlockWave: 1,
      palette: {
        base: "#136aa8",
        shadow: "#0c3564",
        highlight: "#d8fbff",
        atmosphere: "#88e2ff",
        ring: "#c4f3ff"
      },
      patches: ["#1a87c7", "#4ab7f0", "#90f3ff"],
      craters: ["rgba(5, 28, 56, 0.36)", "rgba(5, 51, 88, 0.24)"],
      glows: ["rgba(186, 244, 255, 0.22)"]
    },
    {
      id: "ember",
      label: "Ember Forge",
      intro: "Warm crust, lava veins, and a crunchier core.",
      difficultyWord: "Crunchy",
      massMult: 1.08,
      toughness: 1.28,
      valueMult: 1.16,
      ringChance: 0.1,
      unlockWave: 2,
      palette: {
        base: "#7b2f1f",
        shadow: "#38130b",
        highlight: "#ffd08f",
        atmosphere: "#ffaf6f",
        ring: "#ffca97"
      },
      patches: ["#ad4127", "#ff7b39", "#f5c86b"],
      craters: ["rgba(31, 8, 4, 0.42)", "rgba(84, 21, 11, 0.28)"],
      glows: ["rgba(255, 170, 90, 0.22)", "rgba(255, 109, 37, 0.18)"]
    },
    {
      id: "frost",
      label: "Frost Halo",
      intro: "Glassy ice sheets and crisp crystal seams.",
      difficultyWord: "Cold",
      massMult: 1.02,
      toughness: 1.32,
      valueMult: 1.18,
      ringChance: 0.34,
      unlockWave: 3,
      palette: {
        base: "#77d0ee",
        shadow: "#225d84",
        highlight: "#f6ffff",
        atmosphere: "#d1ffff",
        ring: "#efffff"
      },
      patches: ["#8fe7ff", "#d7fcff", "#98baff"],
      craters: ["rgba(22, 83, 110, 0.3)", "rgba(35, 113, 154, 0.22)"],
      glows: ["rgba(229, 255, 255, 0.3)"]
    },
    {
      id: "toxic",
      label: "Toxic Bloom",
      intro: "Glowing pools and prickly fumes. Worth the mess.",
      difficultyWord: "Spiky",
      massMult: 1.14,
      toughness: 1.46,
      valueMult: 1.24,
      ringChance: 0.14,
      unlockWave: 4,
      palette: {
        base: "#4f8d12",
        shadow: "#213c05",
        highlight: "#f5ff94",
        atmosphere: "#d0ff6e",
        ring: "#ecff9d"
      },
      patches: ["#85d826", "#d2ff66", "#2fa65c"],
      craters: ["rgba(22, 44, 5, 0.32)", "rgba(29, 66, 4, 0.24)"],
      glows: ["rgba(200, 255, 98, 0.18)", "rgba(99, 255, 133, 0.15)"]
    },
    {
      id: "crystal",
      label: "Crystal Choir",
      intro: "Faceted crust and shimmering seams. Rich but stubborn.",
      difficultyWord: "Dense",
      massMult: 1.16,
      toughness: 1.58,
      valueMult: 1.34,
      ringChance: 0.26,
      unlockWave: 5,
      palette: {
        base: "#6953c8",
        shadow: "#241752",
        highlight: "#f2d5ff",
        atmosphere: "#ce99ff",
        ring: "#e0b8ff"
      },
      patches: ["#8f74ff", "#d895ff", "#5be4ff"],
      craters: ["rgba(26, 12, 64, 0.34)", "rgba(74, 22, 107, 0.24)"],
      glows: ["rgba(236, 190, 255, 0.2)", "rgba(91, 228, 255, 0.16)"]
    },
    {
      id: "dune",
      label: "Dune Warden",
      intro: "Dusty ridges and soft gold ridgelines hiding a weighty center.",
      difficultyWord: "Heavy",
      massMult: 1.2,
      toughness: 1.67,
      valueMult: 1.4,
      ringChance: 0.18,
      unlockWave: 6,
      palette: {
        base: "#b87d32",
        shadow: "#563611",
        highlight: "#ffe4b3",
        atmosphere: "#ffd68a",
        ring: "#ffe8be"
      },
      patches: ["#d59641", "#ffcf75", "#f5a65a"],
      craters: ["rgba(67, 34, 7, 0.32)", "rgba(112, 64, 18, 0.22)"],
      glows: ["rgba(255, 222, 123, 0.18)"]
    }
  ];

  const UPGRADE_DEFS = [
    { id: "bitePower", label: "Bite Power", description: "Each chew removes more planet mass.", baseCost: 18, growth: 1.55 },
    { id: "chewTempo", label: "Chew Tempo", description: "Hold-to-eat damage flows faster.", baseCost: 28, growth: 1.62 },
    { id: "coreDrill", label: "Core Drill", description: "Dense worlds feel softer on your teeth.", baseCost: 42, growth: 1.7 },
    { id: "cargoScoop", label: "Cargo Scoop", description: "Every chunk is worth more credits.", baseCost: 36, growth: 1.66 }
  ];

  const GADGET_DEFS = [
    { id: "orbitalDrone", label: "Orbit Drone", description: "Tiny helper drone that nibbles automatically.", baseCost: 90, growth: 1.92, max: 4 },
    { id: "zenGarden", label: "Zen Garden", description: "Passive credits drip in while you stay calm.", baseCost: 80, growth: 1.88, max: 5 },
    { id: "crewLink", label: "Crew Link", description: "Your bots chew harder in Bot Crew mode.", baseCost: 110, growth: 1.96, max: 4 },
    { id: "scannerLens", label: "Scanner Lens", description: "Adds a bonus payout whenever a planet is finished.", baseCost: 100, growth: 1.86, max: 4 }
  ];

  const BOT_CREW = [
    { name: "Miso", color: "#ffb27b", phase: 0.2, speed: 0.65, base: 5.6 },
    { name: "Pebble", color: "#8de8ff", phase: 2.1, speed: 0.52, base: 4.9 },
    { name: "Luma", color: "#d9ff91", phase: 4.15, speed: 0.74, base: 6.2 }
  ];

  const NAME_PREFIX = ["Hush", "Cinder", "Bloom", "Velvet", "Cobalt", "Opal", "Drowse", "Amber", "Mint", "Nova"];
  const NAME_SUFFIX = ["Minor", "Delta", "Crown", "Bastion", "Halo", "Nectar", "Grove", "Keep", "Drift", "Nest"];

  const bgCanvas = document.getElementById("sceneBg");
  const glCanvas = document.getElementById("scene");
  const fxCanvas = document.getElementById("sceneFx");
  const bg = bgCanvas.getContext("2d");
  const fx = fxCanvas.getContext("2d");
  const sceneFrame = document.getElementById("sceneFrame");
  const sceneStage = document.getElementById("sceneStage");
  const homeOverlay = document.getElementById("homeOverlay");
  const resumeButton = document.getElementById("resumeButton");
  const toastEl = document.getElementById("toast");
  const upgradeList = document.getElementById("upgradeList");
  const gadgetList = document.getElementById("gadgetList");

  const ui = {
    modeValue: document.getElementById("modeValue"),
    waveValue: document.getElementById("waveValue"),
    creditsValue: document.getElementById("creditsValue"),
    bestWaveValue: document.getElementById("bestWaveValue"),
    overlayBestWave: document.getElementById("overlayBestWave"),
    overlayLifetime: document.getElementById("overlayLifetime"),
    planetName: document.getElementById("planetName"),
    planetType: document.getElementById("planetType"),
    planetMassValue: document.getElementById("planetMassValue"),
    planetMassBar: document.getElementById("planetMassBar"),
    planetBlurb: document.getElementById("planetBlurb"),
    difficultyValue: document.getElementById("difficultyValue"),
    valueValue: document.getElementById("valueValue"),
    crewValue: document.getElementById("crewValue"),
    lifetimeValue: document.getElementById("lifetimeValue")
  };

  const saved = loadSave();
  let rendererBootError = "";
  let renderer = createFallbackRenderer();
  const state = {
    running: false,
    paused: true,
    mode: "single",
    wave: 1,
    money: 0,
    lifetimeCredits: saved.lifetimeCredits || 0,
    bestWave: saved.bestWave || 1,
    keyDown: false,
    mouseEating: false,
    planet: null,
    bots: [],
    particles: [],
    stars: [],
    bannerText: "Choose a mode to start chewing.",
    bannerTimer: 1.6,
    toast: "",
    toastTimer: 0,
    biteMarkTimer: 0,
    lastUiStamp: 0,
    time: 0,
    uiDirty: true,
    view: { width: 0, height: 0, dpr: 1 },
    audio: {
      ctx: null,
      noiseBuffer: null,
      nextChompAt: 0
    },
    playerBiteLocalDir: normalizeVec3([-1, 0.04, 0.06]),
    camera: {
      yaw: -0.28,
      pitch: 0.14,
      distance: 6.2,
      dragging: false,
      lastX: 0,
      lastY: 0
    }
  };

  function init() {
    fx.imageSmoothingEnabled = false;
    bg.imageSmoothingEnabled = false;
    try {
      renderer = createSpaceRenderer(glCanvas);
    } catch (error) {
      rendererBootError = String(error);
      renderer = createFallbackRenderer();
    }
    if (!renderer.ready) {
      state.bannerText = "WebGL unavailable in this browser.";
      state.toast = rendererBootError || "This browser could not start WebGL.";
      state.toastTimer = 999;
    }
    resizeCanvases();
    state.stars = buildStars();
    resetProgression();
    bindEvents();
    renderUi();
    requestAnimationFrame(loop);
  }

  function bindEvents() {
    window.addEventListener("resize", () => {
      resizeCanvases();
      state.stars = buildStars();
      state.uiDirty = true;
    });

    sceneFrame.addEventListener("pointerdown", (event) => {
      if (!state.running || state.paused) {
        return;
      }
      if (event.target.closest("button")) {
        return;
      }
      ensureAudioReady();
      if (event.button === 2) {
        state.camera.dragging = true;
        state.camera.lastX = event.clientX;
        state.camera.lastY = event.clientY;
        return;
      }

      if (event.button !== 0) {
        return;
      }

      const biteDir = pickPlanetLocalDirFromScreen(event.clientX, event.clientY);
      if (biteDir) {
        state.playerBiteLocalDir = biteDir;
        triggerPointerBite(biteDir);
        state.mouseEating = true;
        return;
      }

      state.camera.dragging = true;
      state.camera.lastX = event.clientX;
      state.camera.lastY = event.clientY;
    });

    window.addEventListener("pointermove", (event) => {
      if (state.mouseEating) {
        const biteDir = pickPlanetLocalDirFromScreen(event.clientX, event.clientY);
        if (biteDir) {
          state.playerBiteLocalDir = biteDir;
        }
      }

      if (state.camera.dragging) {
        const dx = event.clientX - state.camera.lastX;
        const dy = event.clientY - state.camera.lastY;
        state.camera.lastX = event.clientX;
        state.camera.lastY = event.clientY;
        state.camera.yaw += dx * 0.008;
        state.camera.pitch = clamp(state.camera.pitch + dy * 0.006, -0.75, 0.62);
      }
    });

    window.addEventListener("pointerup", () => {
      state.camera.dragging = false;
      state.mouseEating = false;
    });

    window.addEventListener("pointerleave", () => {
      state.camera.dragging = false;
      state.mouseEating = false;
    });

    sceneFrame.addEventListener("contextmenu", (event) => {
      event.preventDefault();
    });

    sceneFrame.addEventListener("wheel", (event) => {
      if (!state.running || state.paused) {
        return;
      }
      event.preventDefault();
      state.camera.distance = clamp(state.camera.distance + event.deltaY * 0.0035, 4.1, 8.6);
    }, { passive: false });

    window.addEventListener("keydown", (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        state.keyDown = true;
      }
    });

    window.addEventListener("keyup", (event) => {
      if (event.code === "Space") {
        state.keyDown = false;
      }
    });

    document.querySelectorAll("[data-start-mode]").forEach((button) => {
      button.addEventListener("click", () => startRun(button.dataset.startMode));
    });

    resumeButton.addEventListener("click", () => {
      ensureAudioReady();
      homeOverlay.classList.add("hidden");
      state.paused = false;
      state.keyDown = false;
      state.mouseEating = false;
    });

    document.getElementById("menuButton").addEventListener("click", () => {
      homeOverlay.classList.remove("hidden");
      resumeButton.classList.toggle("hidden", !state.running);
      state.paused = true;
      state.keyDown = false;
      state.mouseEating = false;
      renderUi();
    });

    upgradeList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-upgrade-id]");
      if (!button) {
        return;
      }
      buyUpgrade(button.dataset.upgradeId);
    });

    gadgetList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-gadget-id]");
      if (!button) {
        return;
      }
      buyGadget(button.dataset.gadgetId);
    });
  }

  function startRun(mode) {
    ensureAudioReady();
    state.running = true;
    state.paused = false;
    state.mode = mode;
    state.wave = 1;
    state.money = 0;
    state.keyDown = false;
    state.mouseEating = false;
    state.playerBiteLocalDir = normalizeVec3([-1, 0.04, 0.06]);
    state.camera.yaw = -0.28;
    state.camera.pitch = 0.14;
    state.camera.distance = 6.2;
    state.camera.dragging = false;
    state.particles = [];
    state.bots = mode === "bot" ? BOT_CREW.map((bot) => ({ ...bot, orbit: bot.phase })) : [];
    resetProgression();
    spawnPlanet(true);
    homeOverlay.classList.add("hidden");
    showToast(mode === "bot" ? "Bot Crew drifting in." : "Solo snack run started.");
    state.uiDirty = true;
  }

  function resetProgression() {
    state.upgrades = {};
    state.gadgets = {};

    UPGRADE_DEFS.forEach((item) => {
      state.upgrades[item.id] = 0;
    });

    GADGET_DEFS.forEach((item) => {
      state.gadgets[item.id] = 0;
    });
  }

  function loop(now) {
    const seconds = now * 0.001;
    const dt = Math.min(0.05, Math.max(0.001, seconds - (state.lastTime || seconds)));
    state.lastTime = seconds;
    state.time += dt;

    if (state.running && !state.paused) {
      updateGame(dt);
    } else {
      updateAmbient(dt);
    }

    renderScene();

    if (state.uiDirty || state.time - state.lastUiStamp > 0.16) {
      renderUi();
      state.lastUiStamp = state.time;
      state.uiDirty = false;
    }

    requestAnimationFrame(loop);
  }

  function updateAmbient(dt) {
    if (state.biteMarkTimer > 0) {
      state.biteMarkTimer = Math.max(0, state.biteMarkTimer - dt);
    }

    if (state.planet) {
      state.planet.rotation += dt * state.planet.spin * 0.4;
      state.planet.wobble += dt * 0.4;
    }

    if (state.bannerTimer > 0) {
      state.bannerTimer = Math.max(0, state.bannerTimer - dt);
    }

    if (state.toastTimer > 0 && state.toastTimer < 900) {
      state.toastTimer -= dt;
      if (state.toastTimer <= 0) {
        state.toast = "";
        state.uiDirty = true;
      }
    }
  }

  function updateGame(dt) {
    const stats = getStats();
    const planet = state.planet;
    if (!planet) {
      return;
    }

    planet.rotation += dt * planet.spin;
    planet.wobble += dt * 1.2;
    if (state.bannerTimer > 0) {
      state.bannerTimer = Math.max(0, state.bannerTimer - dt);
    }
    if (state.biteMarkTimer > 0) {
      state.biteMarkTimer = Math.max(0, state.biteMarkTimer - dt);
    }

    const wantsToEat = state.keyDown || state.mouseEating;
    const biteDir = getPlayerBiteLocalDir(state, planet);

    if (wantsToEat) {
      const damage = applyPlanetDamageLocal(stats.playerDps * dt, biteDir, true);
      if (damage > 0) {
        addCredits(damage * planet.valuePerMass * stats.valueMult);
        emitBiteParticles(planet, damage, "#ffe89a", 4, biteDir, 0.28);
        playEatSound(0.72);
      }
    }

    if (stats.passiveIncome > 0) {
      addCredits(stats.passiveIncome * dt);
    }

    if (stats.droneDps > 0) {
      for (let i = 0; i < state.gadgets.orbitalDrone; i += 1) {
        const dronePos = getDroneWorldPosition(i, state, planet);
        const damage = applyPlanetDamage(
          (stats.droneDps / Math.max(1, state.gadgets.orbitalDrone)) * dt,
          normalizeVec3(subVec3(dronePos, getPlanetWorldCenter(planet))),
          false
        );
        if (damage > 0) {
          addCredits(damage * planet.valuePerMass * stats.valueMult * 0.9);
          emitBiteParticles(planet, damage, "#9af9ff", 2, worldDirToPlanetLocal(planet, normalizeVec3(subVec3(dronePos, getPlanetWorldCenter(planet)))), 0.75);
        }
      }
    }

    if (state.mode === "bot") {
      state.bots.forEach((bot, index) => {
        bot.orbit += dt * bot.speed;
        const botDps = (bot.base + state.wave * 0.6) * stats.crewBonus;
        const botPos = getBotWorldPosition(bot, index, state, planet);
        const damage = applyPlanetDamage(
          botDps * dt,
          normalizeVec3(subVec3(botPos, getPlanetWorldCenter(planet))),
          false
        );
        if (damage > 0) {
          addCredits(damage * planet.valuePerMass * stats.valueMult * 0.95);
          if ((index + Math.floor(state.time * 7)) % 2 === 0) {
            emitBiteParticles(planet, damage, bot.color, 1, worldDirToPlanetLocal(planet, normalizeVec3(subVec3(botPos, getPlanetWorldCenter(planet)))), 0.68);
          }
        }
      });
    }

    if (planet.health <= 0 && !planet.clearing) {
      clearPlanet();
    }

    updateParticles(dt);

    if (state.toastTimer > 0 && state.toastTimer < 900) {
      state.toastTimer -= dt;
      if (state.toastTimer <= 0) {
        state.toast = "";
        state.uiDirty = true;
      }
    }
  }

  function applyPlanetDamage(rawAmount, eaterDirectionWorld, isPlayer) {
    return applyPlanetDamageLocal(rawAmount, worldDirToPlanetLocal(state.planet, eaterDirectionWorld), isPlayer);
  }

  function applyPlanetDamageLocal(rawAmount, biteLocalDir, isPlayer) {
    const planet = state.planet;
    const stats = getStats();
    const resistance = Math.max(0.48, planet.toughness / stats.drillPower);
    const actual = rawAmount / resistance;
    if (actual <= 0) {
      return 0;
    }

    const removed = consumePlanetBlocks(planet, actual, biteLocalDir);
    if (removed <= 0) {
      return 0;
    }

    planet.eatenRatio = 1 - planet.health / planet.maxHealth;
    planet.flash = isPlayer ? 1 : Math.max(planet.flash, 0.55);
    state.uiDirty = true;
    return removed;
  }

  function clearPlanet() {
    const planet = state.planet;
    const stats = getStats();
    planet.clearing = true;

    const clearBonus = Math.round(planet.clearBonus + stats.clearBonus);
    addCredits(clearBonus);
    showToast("Planet devoured. +" + formatNumber(clearBonus) + " clear bonus.");

    for (let i = 0; i < 18; i += 1) {
      emitBiteParticles(planet, 18, pick(planet.type.patches), 1);
    }

    state.wave += 1;
    state.bestWave = Math.max(state.bestWave, state.wave);
    persistSave();
    state.bannerText = "Wave " + state.wave + " approaching...";
    state.bannerTimer = 1.8;
    state.uiDirty = true;

    window.setTimeout(() => {
      if (state.running) {
        spawnPlanet(false);
      }
    }, 950);
  }

  function spawnPlanet(firstPlanet) {
    const type = choosePlanetType(state.wave);
    const name = pick(NAME_PREFIX) + " " + pick(NAME_SUFFIX);
    const chaos = 0.94 + Math.random() * 0.24;
    const radiusCells = clamp(Math.round(3 + state.wave * 0.16 + type.massMult * 0.9 + Math.random() * 0.8), 3, 6);
    const blockSize = 0.34;
    const toughness = +(type.toughness * (1 + state.wave * 0.1) * (0.96 + Math.random() * 0.16)).toFixed(2);
    const valuePerMass = (0.92 + state.wave * 0.12) * type.valueMult;
    const clearBonus = Math.round((26 + state.wave * 12) * type.valueMult);
    const hasRing = Math.random() < type.ringChance;
    const voxelData = buildVoxelPlanet(type, radiusCells, blockSize);

    state.planet = {
      type,
      name,
      maxHealth: voxelData.totalBlocks,
      health: voxelData.totalBlocks,
      toughness,
      valuePerMass,
      clearBonus,
      rotation: Math.random() * TWO_PI,
      wobble: Math.random() * TWO_PI,
      spin: (0.14 + Math.random() * 0.14) * (Math.random() > 0.5 ? 1 : -1),
      renderScale: 1,
      flash: 0,
      eatenRatio: 0,
      ringTilt: Math.random() * 0.5 - 0.25,
      hasRing,
      blockSize,
      radiusCells,
      blocks: voxelData.blocks,
      blockLookup: voxelData.blockLookup,
      surfaceBlocks: [],
      surfaceRadius: voxelData.surfaceRadius,
      damagePool: 0,
      clearing: false,
      needsSurfaceUpload: true
    };
    refreshPlanetBlocks(state.planet);

    state.bannerText = firstPlanet ? "Click and hold on the planet to chew exactly there." : type.label + " drifting in.";
    state.bannerTimer = 2.2;
    state.uiDirty = true;
  }

  function choosePlanetType(wave) {
    const options = PLANET_TYPES.filter((type) => type.unlockWave <= wave);
    const bias = Math.min(options.length - 1, Math.floor((wave - 1) / 2));
    const start = Math.max(0, bias - 2);
    return options[randomInt(start, options.length - 1)];
  }

  function buildVoxelPlanet(type, radiusCells, blockSize) {
    const blocks = [];
    const blockLookup = new Map();

    for (let x = -radiusCells; x <= radiusCells; x += 1) {
      for (let y = -radiusCells; y <= radiusCells; y += 1) {
        for (let z = -radiusCells; z <= radiusCells; z += 1) {
          const dist = Math.hypot(x, y, z);
          const noise = Math.sin((x + 4) * 1.13 + z * 0.71) * 0.24 + Math.cos((y - 2) * 1.07 + x * 0.46) * 0.18;
          if (dist > radiusCells + noise * 0.45 || dist > radiusCells + 0.42) {
            continue;
          }

          const color = sampleVoxelColor(type, x, y, z, radiusCells);
          const block = {
            gx: x,
            gy: y,
            gz: z,
            x: x * blockSize,
            y: y * blockSize,
            z: z * blockSize,
            color,
            alive: true,
            exposed: false
          };
          blocks.push(block);
          blockLookup.set(blockKey(x, y, z), block);
        }
      }
    }

    let surfaceRadius = 0;
    blocks.forEach((block) => {
      surfaceRadius = Math.max(surfaceRadius, Math.hypot(block.x, block.y, block.z) + blockSize * 0.65);
    });

    return {
      blocks,
      blockLookup,
      totalBlocks: blocks.length,
      surfaceRadius
    };
  }

  function refreshPlanetBlocks(planet) {
    const offsets = [
      [1, 0, 0], [-1, 0, 0], [0, 1, 0],
      [0, -1, 0], [0, 0, 1], [0, 0, -1]
    ];
    planet.surfaceBlocks = [];
    let aliveCount = 0;

    planet.blocks.forEach((block) => {
      if (!block.alive) {
        block.exposed = false;
        return;
      }
      aliveCount += 1;
      block.exposed = offsets.some((offset) => {
        const neighbor = planet.blockLookup.get(blockKey(block.gx + offset[0], block.gy + offset[1], block.gz + offset[2]));
        return !neighbor || !neighbor.alive;
      });
      if (block.exposed) {
        planet.surfaceBlocks.push(block);
      }
    });

    planet.health = aliveCount;
    planet.needsSurfaceUpload = true;
  }

  function consumePlanetBlocks(planet, rawDamage, localDir) {
    planet.damagePool = (planet.damagePool || 0) + rawDamage;
    let removed = 0;

    while (planet.damagePool >= 1 && planet.health > 0) {
      const target = choosePlanetSurfaceBlock(planet, localDir);
      if (!target) {
        break;
      }
      target.alive = false;
      removed += 1;
      planet.damagePool -= 1;
      refreshPlanetBlocks(planet);
    }

    return removed;
  }

  function choosePlanetSurfaceBlock(planet, localDir) {
    let bestBlock = null;
    let bestScore = -Infinity;

    const radius = Math.max(planet.surfaceRadius, 0.01);
    for (const block of planet.surfaceBlocks) {
      const normal = normalizeVec3([block.x, block.y, block.z]);
      const facing = dotVec3(normal, localDir);
      const dx = block.x - localDir[0] * radius;
      const dy = block.y - localDir[1] * radius;
      const dz = block.z - localDir[2] * radius;
      const closeness = Math.hypot(dx, dy, dz);
      const score = facing * 4 - closeness * 2 + block.gx * -0.04;
      if (score > bestScore) {
        bestScore = score;
        bestBlock = block;
      }
    }

    return bestBlock;
  }

  function buyUpgrade(id) {
    const item = UPGRADE_DEFS.find((entry) => entry.id === id);
    if (!item) {
      return;
    }

    const cost = getUpgradeCost(item);
    if (state.money < cost) {
      showToast("Need " + formatNumber(cost) + " credits.");
      return;
    }

    state.money -= cost;
    state.upgrades[id] += 1;
    showToast(item.label + " upgraded to " + romanize(state.upgrades[id]) + ".");
    state.uiDirty = true;
  }

  function buyGadget(id) {
    const item = GADGET_DEFS.find((entry) => entry.id === id);
    if (!item) {
      return;
    }

    if (state.gadgets[id] >= item.max) {
      showToast(item.label + " is already maxed.");
      return;
    }

    const cost = getGadgetCost(item);
    if (state.money < cost) {
      showToast("Need " + formatNumber(cost) + " credits.");
      return;
    }

    state.money -= cost;
    state.gadgets[id] += 1;
    showToast(item.label + " purchased.");
    state.uiDirty = true;
  }

  function getStats() {
    const bitePower = 8 + state.upgrades.bitePower * 5.2;
    const chewTempo = 1 + state.upgrades.chewTempo * 0.36;
    const drillPower = 1 + state.upgrades.coreDrill * 0.28;
    const valueMult = 1 + state.upgrades.cargoScoop * 0.18;
    const droneDps = state.gadgets.orbitalDrone * 6.6;
    const passiveIncome = state.gadgets.zenGarden * 0.95;
    const crewBonus = 1 + state.gadgets.crewLink * 0.35;
    const clearBonus = state.gadgets.scannerLens * 22;

    return {
      playerDps: bitePower * chewTempo,
      drillPower,
      valueMult,
      droneDps,
      passiveIncome,
      crewBonus,
      clearBonus
    };
  }

  function addCredits(amount) {
    state.money += amount;
    state.lifetimeCredits += amount;
    state.uiDirty = true;
  }

  function triggerPointerBite(localDir) {
    const planet = state.planet;
    if (!planet) {
      return;
    }
    const burst = Math.max(5.2, getStats().playerDps * 0.3);
    const damage = applyPlanetDamageLocal(burst, localDir, true);
    state.biteMarkTimer = 0.22;
    if (damage > 0) {
      addCredits(damage * planet.valuePerMass * getStats().valueMult);
      emitBiteParticles(planet, damage, "#ffe89a", 3, localDir, 0.18);
      playEatSound(1);
    }
  }

  function ensureAudioReady() {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) {
      return null;
    }

    if (!state.audio.ctx) {
      state.audio.ctx = new AudioCtor();
    }

    if (state.audio.ctx.state === "suspended") {
      state.audio.ctx.resume().catch(() => {});
    }

    if (!state.audio.noiseBuffer) {
      const duration = 0.18;
      const frameCount = Math.floor(state.audio.ctx.sampleRate * duration);
      const buffer = state.audio.ctx.createBuffer(1, frameCount, state.audio.ctx.sampleRate);
      const samples = buffer.getChannelData(0);
      for (let i = 0; i < frameCount; i += 1) {
        const t = i / frameCount;
        samples[i] = (Math.random() * 2 - 1) * (1 - t * 0.68);
      }
      state.audio.noiseBuffer = buffer;
    }

    return state.audio.ctx;
  }

  function playEatSound(strength = 0.9) {
    const ctx = ensureAudioReady();
    if (!ctx) {
      return;
    }

    const now = ctx.currentTime;
    if (now < state.audio.nextChompAt) {
      return;
    }
    state.audio.nextChompAt = now + 0.06;

    const duration = 0.07 + strength * 0.03;
    const noise = ctx.createBufferSource();
    noise.buffer = state.audio.noiseBuffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(920 - strength * 180, now);
    bandpass.Q.value = 0.85;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(1450, now);
    lowpass.frequency.exponentialRampToValueAtTime(620, now + duration);

    const crunchGain = ctx.createGain();
    crunchGain.gain.setValueAtTime(0.0001, now);
    crunchGain.gain.exponentialRampToValueAtTime(0.045 + strength * 0.03, now + 0.008);
    crunchGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    const bodyOsc = ctx.createOscillator();
    bodyOsc.type = "triangle";
    bodyOsc.frequency.setValueAtTime(165 - strength * 18, now);
    bodyOsc.frequency.exponentialRampToValueAtTime(112, now + duration);

    const bodyGain = ctx.createGain();
    bodyGain.gain.setValueAtTime(0.0001, now);
    bodyGain.gain.exponentialRampToValueAtTime(0.018 + strength * 0.016, now + 0.01);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.connect(bandpass);
    bandpass.connect(lowpass);
    lowpass.connect(crunchGain);
    crunchGain.connect(ctx.destination);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(ctx.destination);

    noise.start(now);
    bodyOsc.start(now);
    noise.stop(now + duration);
    bodyOsc.stop(now + duration);
  }

  function emitBiteParticles(planet, amount, color, count, biteLocalDir, speedScale = 0.68) {
    const intensity = clamp(amount / 12, 0.4, 2.4);
    const biteDir = normalizeVec3(biteLocalDir || getPlayerBiteLocalDir(state, planet));
    const biteOrigin = getPlanetSurfaceWorldPosition(planet, biteDir, 1.03);
    const biteOut = planetLocalDirToWorld(planet, biteDir);
    for (let i = 0; i < count; i += 1) {
      const drift = normalizeVec3([
        biteOut[0] * 1.2 + randomRange(-0.35, 0.35),
        biteOut[1] * 1.2 + randomRange(-0.35, 0.35),
        biteOut[2] * 1.2 + randomRange(-0.35, 0.35)
      ]);
      state.particles.push({
        x: biteOrigin[0] + randomRange(-0.045, 0.045),
        y: biteOrigin[1] + randomRange(-0.045, 0.045),
        z: biteOrigin[2] + randomRange(-0.045, 0.045),
        vx: drift[0] * randomRange(0.14, 0.4) * intensity * speedScale,
        vy: drift[1] * randomRange(0.12, 0.36) * intensity * speedScale,
        vz: drift[2] * randomRange(0.12, 0.36) * intensity * speedScale,
        life: randomRange(0.12, 0.28),
        size: randomRange(4, 8),
        color
      });
    }
  }

  function updateParticles(dt) {
    state.particles = state.particles.filter((particle) => {
      particle.life -= dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.z += particle.vz * dt;
      particle.vx *= 0.985;
      particle.vy *= 0.975;
      particle.vz *= 0.98;
      return particle.life > 0;
    });
  }

  function renderScene() {
    drawBackground();
    renderer.render(state, state.time);
    drawOverlay();
  }

  function drawBackground() {
    const w = state.view.width;
    const h = state.view.height;
    bg.setTransform(state.view.dpr, 0, 0, state.view.dpr, 0, 0);

    const gradient = bg.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, "#102331");
    gradient.addColorStop(0.45, "#091720");
    gradient.addColorStop(1, "#050d14");
    bg.fillStyle = gradient;
    bg.fillRect(0, 0, w, h);

    const glow = bg.createRadialGradient(w * 0.18, h * 0.2, 4, w * 0.18, h * 0.2, w * 0.28);
    glow.addColorStop(0, "rgba(150,255,220,0.18)");
    glow.addColorStop(1, "rgba(150,255,220,0)");
    bg.fillStyle = glow;
    bg.fillRect(0, 0, w, h);

    const haze = bg.createRadialGradient(w * 0.8, h * 0.28, 8, w * 0.8, h * 0.28, w * 0.22);
    haze.addColorStop(0, "rgba(112,163,255,0.1)");
    haze.addColorStop(1, "rgba(112,163,255,0)");
    bg.fillStyle = haze;
    bg.fillRect(0, 0, w, h);
  }

  function drawOverlay() {
    const w = state.view.width;
    const h = state.view.height;

    fx.setTransform(state.view.dpr, 0, 0, state.view.dpr, 0, 0);
    fx.clearRect(0, 0, w, h);
    drawBanner();
  }

  function drawBanner() {
    if (state.bannerTimer <= 0 || !state.bannerText) {
      return;
    }

    const w = state.view.width;
    const h = state.view.height;
    fx.save();
    fx.globalAlpha = clamp(state.bannerTimer / 2, 0, 1);
    fx.fillStyle = "rgba(6,16,22,0.84)";
    fx.fillRect(w * 0.29, h * 0.11, w * 0.42, 34);
    fx.strokeStyle = "rgba(255,224,126,0.36)";
    fx.strokeRect(w * 0.29, h * 0.11, w * 0.42, 34);
    fx.fillStyle = "#ffe07e";
    fx.font = "12px " + getComputedStyle(document.documentElement).getPropertyValue("--pixel-font");
    fx.textAlign = "center";
    fx.fillText(state.bannerText, w * 0.5, h * 0.11 + 21);
    fx.restore();
  }

  function renderUi() {
    const planet = state.planet;
    const stats = getStats();
    const currentMass = planet ? Math.max(0, planet.health / planet.maxHealth) : 1;

    ui.modeValue.textContent = state.mode === "bot" ? "Bot Crew" : "Singleplayer";
    ui.waveValue.textContent = String(state.wave);
    ui.creditsValue.textContent = formatNumber(state.money);
    ui.bestWaveValue.textContent = String(state.bestWave);
    ui.overlayBestWave.textContent = String(state.bestWave);
    ui.overlayLifetime.textContent = formatNumber(state.lifetimeCredits);
    ui.lifetimeValue.textContent = formatNumber(state.lifetimeCredits);

    if (planet) {
      ui.planetName.textContent = planet.name;
      ui.planetType.textContent = planet.type.label;
      ui.planetMassValue.textContent = Math.round(currentMass * 100) + "%";
      ui.planetMassBar.style.width = Math.max(0, currentMass * 100) + "%";
      ui.planetBlurb.textContent = planet.type.intro;
      ui.difficultyValue.textContent = difficultyLabel(planet.toughness, planet.type.difficultyWord);
      ui.valueValue.textContent = (planet.valuePerMass * stats.valueMult).toFixed(1) + "x";
      ui.crewValue.textContent = state.mode === "bot"
        ? state.bots.map((bot) => bot.name).join(", ")
        : "Solo drift";
    }

    toastEl.textContent = state.toast;
    toastEl.classList.toggle("hidden", !state.toast);
    resumeButton.classList.toggle("hidden", !state.running);

    upgradeList.innerHTML = UPGRADE_DEFS.map((item) => renderShopButton({
      id: item.id,
      label: item.label,
      description: item.description,
      level: state.upgrades[item.id],
      cost: getUpgradeCost(item),
      affordable: state.money >= getUpgradeCost(item),
      dataKey: "upgrade-id"
    })).join("");

    gadgetList.innerHTML = GADGET_DEFS.map((item) => {
      const level = state.gadgets[item.id];
      const maxed = level >= item.max;
      const cost = getGadgetCost(item);
      return renderShopButton({
        id: item.id,
        label: item.label,
        description: item.description,
        level,
        cost,
        affordable: state.money >= cost,
        maxed,
        dataKey: "gadget-id",
        suffix: " / " + item.max
      });
    }).join("");
  }

  function renderShopButton({ id, label, description, level, cost, affordable, maxed, dataKey, suffix = "" }) {
    const disabled = maxed ? "disabled" : "";
    const priceText = maxed ? "MAX" : formatNumber(cost) + "c";
    const metaText = maxed
      ? "Level " + level + suffix + " | fully stocked"
      : "Level " + level + suffix + " | next cost " + formatNumber(cost);

    return (
      '<button class="shop-button" type="button" data-' + dataKey + '="' + id + '" ' + disabled + ">" +
        '<span class="shop-title"><strong>' + label + "</strong><em>" + priceText + "</em></span>" +
        '<span class="shop-desc">' + description + "</span>" +
        '<span class="shop-meta">' + metaText + (affordable && !maxed ? " | ready" : "") + "</span>" +
      "</button>"
    );
  }

  function getUpgradeCost(item) {
    return Math.floor(item.baseCost * Math.pow(item.growth, state.upgrades[item.id]));
  }

  function getGadgetCost(item) {
    return Math.floor(item.baseCost * Math.pow(item.growth, state.gadgets[item.id]));
  }

  function showToast(message) {
    state.toast = message;
    state.toastTimer = 2.3;
    state.uiDirty = true;
  }

  function resizeCanvases() {
    const bounds = sceneStage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(680, Math.floor(bounds.width));
    const height = Math.max(420, Math.floor(bounds.height));

    state.view.width = width;
    state.view.height = height;
    state.view.dpr = dpr;

    bgCanvas.width = Math.floor(width * dpr);
    bgCanvas.height = Math.floor(height * dpr);
    fxCanvas.width = Math.floor(width * dpr);
    fxCanvas.height = Math.floor(height * dpr);
    glCanvas.width = Math.max(220, Math.floor(width * dpr * SCENE_PIXEL_SCALE));
    glCanvas.height = Math.max(140, Math.floor(height * dpr * SCENE_PIXEL_SCALE));

    renderer.resize(width, height, dpr);
  }

  function buildStars() {
    const stars = [];
    const count = Math.floor((state.view.width * state.view.height) / 6800);
    for (let i = 0; i < count; i += 1) {
      stars.push({
        x: randomRange(-10, 10),
        y: randomRange(-5, 5),
        z: randomRange(-24, -8),
        size: randomRange(3, 9),
        speed: randomRange(0.5, 2.6),
        phase: Math.random() * TWO_PI,
        color: Math.random() > 0.75 ? "#9fd7ff" : (Math.random() > 0.48 ? "#ecfff5" : "#ffe9a8")
      });
    }
    return stars;
  }

  function persistSave() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        bestWave: state.bestWave,
        lifetimeCredits: Math.round(state.lifetimeCredits)
      }));
    } catch (error) {
      // Ignore save failures in restricted browsers.
    }
  }

  function loadSave() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { bestWave: 1, lifetimeCredits: 0 };
    } catch (error) {
      return { bestWave: 1, lifetimeCredits: 0 };
    }
  }

  function defaultView() {
    return {
      centerX: state.view.width * 0.58,
      centerY: state.view.height * 0.52,
      radius: Math.min(state.view.width, state.view.height) * 0.18,
      biteX: state.view.width * 0.42,
      biteY: state.view.height * 0.52
    };
  }

  function getPlanetModelMatrix(planet) {
    const bob = Math.sin(planet.wobble) * 0.08;
    const model = mat4Identity();
    composeModelMatrix(model, [0.82, bob, 0], [0.32, planet.rotation, 0.14], [1, 1, 1]);
    return model;
  }

  function getPlayerBiteLocalDir(gameState, planet) {
    return normalizeVec3(gameState.playerBiteLocalDir || [-1, 0.04, 0.06]);
  }

  function getPlanetSurfaceWorldPosition(planet, localDir, radiusScale = 1) {
    const model = getPlanetModelMatrix(planet);
    const dir = normalizeVec3(localDir);
    const point = transformVec4(model, [
      dir[0] * planet.surfaceRadius * radiusScale,
      dir[1] * planet.surfaceRadius * radiusScale,
      dir[2] * planet.surfaceRadius * radiusScale,
      1
    ]);
    return [point[0], point[1], point[2]];
  }

  function planetLocalDirToWorld(planet, localDir) {
    let v = normalizeVec3(localDir);
    v = rotateVecY(v, planet.rotation);
    v = rotateVecX(v, 0.32);
    v = rotateVecZ(v, 0.14);
    return normalizeVec3(v);
  }

  function getPlanetBiteWorldPosition(planet, localDir) {
    return getPlanetSurfaceWorldPosition(planet, localDir, 1.02);
  }

  function getPlanetWorldCenter(planet) {
    return [0.82, Math.sin(planet.wobble) * 0.08, 0];
  }

  function getPlayerWorldPosition(gameState, planet) {
    const biteDir = getPlayerBiteLocalDir(gameState, planet);
    const bitePoint = getPlanetBiteWorldPosition(planet, biteDir);
    const outward = planetLocalDirToWorld(planet, biteDir);
    return [
      bitePoint[0] + outward[0] * 0.48,
      bitePoint[1] + outward[1] * 0.48 + 0.06 + Math.sin(gameState.time * 1.8) * 0.02,
      bitePoint[2] + outward[2] * 0.48
    ];
  }

  function getOrbitCameraPosition(camera, target) {
    const distance = camera.distance;
    const cosPitch = Math.cos(camera.pitch);
    return [
      target[0] + Math.sin(camera.yaw) * cosPitch * distance,
      target[1] + Math.sin(camera.pitch) * distance,
      target[2] + Math.cos(camera.yaw) * cosPitch * distance
    ];
  }

  function getBotWorldPosition(bot, index, gameState, planet) {
    const center = getPlanetWorldCenter(planet);
    const orbitRadius = planet.surfaceRadius + 0.82 + index * 0.22;
    return [
      center[0] + Math.cos(bot.orbit) * orbitRadius,
      center[1] + Math.sin(bot.orbit * 0.95) * 0.32,
      center[2] + Math.sin(bot.orbit) * orbitRadius * 0.64
    ];
  }

  function getDroneWorldPosition(index, gameState, planet) {
    const center = getPlanetWorldCenter(planet);
    const orbit = gameState.time * (0.95 + index * 0.2) + index * 1.8;
    const orbitRadius = planet.surfaceRadius + 0.34 + index * 0.16;
    return [
      center[0] + Math.cos(orbit) * orbitRadius,
      center[1] + Math.sin(orbit * 1.2) * 0.22,
      center[2] + Math.sin(orbit) * orbitRadius * 0.52
    ];
  }

  function worldDirToPlanetLocal(planet, dirWorld) {
    let v = normalizeVec3(dirWorld);
    v = rotateVecZ(v, -0.14);
    v = rotateVecX(v, -0.32);
    v = rotateVecY(v, -planet.rotation);
    return normalizeVec3(v);
  }

  function pickPlanetLocalDirFromScreen(clientX, clientY) {
    const planet = state.planet;
    if (!planet) {
      return null;
    }

    const rect = sceneStage.getBoundingClientRect();
    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;
    const projection = mat4Identity();
    const view = mat4Identity();
    const model = getPlanetModelMatrix(planet);
    const orbitTarget = getPlanetWorldCenter(planet);
    const cameraPos = getOrbitCameraPosition(state.camera, orbitTarget);
    mat4Perspective(projection, degToRad(45), state.view.width / Math.max(state.view.height, 1), 0.1, 100);
    mat4LookAt(view, cameraPos, orbitTarget, [0, 1, 0]);

    let bestBlock = null;
    let bestDistance = Infinity;

    for (const block of planet.surfaceBlocks) {
      const world = transformVec4(model, [block.x, block.y, block.z, 1]);
      const worldPos = [world[0], world[1], world[2]];
      const worldNormal = normalizeVec3(subVec3(worldPos, orbitTarget));
      const cameraToBlock = normalizeVec3(subVec3(cameraPos, worldPos));
      if (dotVec3(worldNormal, cameraToBlock) <= 0.14) {
        continue;
      }

      const projected = projectPoint(projection, view, model, [block.x, block.y, block.z], state.view.width, state.view.height);
      const dist = distance2d(screenX, screenY, projected[0], projected[1]);
      if (dist < bestDistance) {
        bestDistance = dist;
        bestBlock = block;
      }
    }

    if (!bestBlock || bestDistance > Math.max(36, state.view.width * 0.06)) {
      return null;
    }

    return normalizeVec3([bestBlock.x, bestBlock.y, bestBlock.z]);
  }

  function sampleVoxelColor(type, x, y, z, radiusCells) {
    const base = colorToRgb(type.palette.base);
    const heightTint = clamp((y / Math.max(radiusCells, 1) + 1) * 0.16, 0, 0.24);
    let color = mixColor(base, colorToRgb(type.palette.highlight), heightTint);

    const patchSignal = Math.sin((x + 2) * 1.41 + z * 0.77) + Math.cos((z - 1) * 1.13 + y * 0.82);
    if (patchSignal > 1.0) {
      color = mixColor(color, colorToRgb(type.patches[Math.abs((x + y + z) % type.patches.length)]), 0.65);
    }

    const craterSignal = Math.sin(x * 0.9 - y * 1.17 + z * 0.5);
    if (craterSignal < -0.82) {
      color = mixColor(color, colorToRgb(type.palette.shadow), 0.7);
    }

    return rgbToHex(color);
  }

  function rgbToHex(rgb) {
    const r = Math.round(clamp(rgb[0], 0, 1) * 255).toString(16).padStart(2, "0");
    const g = Math.round(clamp(rgb[1], 0, 1) * 255).toString(16).padStart(2, "0");
    const b = Math.round(clamp(rgb[2], 0, 1) * 255).toString(16).padStart(2, "0");
    return "#" + r + g + b;
  }

  function blockKey(x, y, z) {
    return x + ":" + y + ":" + z;
  }

  function difficultyLabel(toughness, baseWord) {
    if (toughness < 1.16) {
      return baseWord + " / mellow";
    }
    if (toughness < 1.4) {
      return baseWord + " / chewy";
    }
    if (toughness < 1.7) {
      return baseWord + " / sturdy";
    }
    return baseWord + " / colossal";
  }

  function formatNumber(value) {
    return Math.floor(value).toLocaleString();
  }

  function romanize(value) {
    const numerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
    return numerals[value - 1] || String(value);
  }

  function latLonToDir(lat, lon) {
    const cosLat = Math.cos(lat);
    return normalizeVec3([
      Math.sin(lon) * cosLat,
      Math.sin(lat),
      Math.cos(lon) * cosLat
    ]);
  }

  function colorToRgb(color) {
    if (color.startsWith("#")) {
      const clean = color.slice(1);
      const value = parseInt(clean, 16);
      return [
        ((value >> 16) & 255) / 255,
        ((value >> 8) & 255) / 255,
        (value & 255) / 255
      ];
    }

    const match = color.match(/rgba?\(([^,]+),([^,]+),([^,]+)(?:,[^)]+)?\)/);
    if (!match) {
      return [1, 1, 1];
    }
    return [
      Number(match[1]) / 255,
      Number(match[2]) / 255,
      Number(match[3]) / 255
    ];
  }

  function mixColor(from, to, amount) {
    return [
      lerp(from[0], to[0], amount),
      lerp(from[1], to[1], amount),
      lerp(from[2], to[2], amount)
    ];
  }

  function applyFeatureColor(color, normal, feature, target, strength) {
    const hit = smoothstep(feature.spread, 0.9996, dotVec3(normal, feature.dir));
    if (hit <= 0) {
      return color;
    }
    return mixColor(color, target, clamp(hit * strength * feature.alpha, 0, 1));
  }

  function createSpaceRenderer(canvas) {
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false });
    if (!gl) {
      return {
        ready: false,
        viewInfo: { centerX: 0, centerY: 0, radius: 0, biteX: 0, biteY: 0, scale: 1 },
        resize() {},
        render() {}
      };
    }

    const sphereMesh = createSphereMesh(28, 20);
    const ringMesh = createRingMesh(96, 1.38, 1.8);
    const cubeMesh = createCubeMesh();
    const solidProgram = createProgram(gl, SOLID_VERTEX_SHADER, SOLID_FRAGMENT_SHADER, ["aPosition", "aNormal", "aColor"]);
    const pointProgram = createProgram(gl, POINT_VERTEX_SHADER, POINT_FRAGMENT_SHADER, ["aPosition", "aColor", "aSize"]);
    const sphereBuffers = createMeshBuffers(gl, sphereMesh, true);
    const ringBuffers = createMeshBuffers(gl, ringMesh, true);
    const cubeBuffers = createMeshBuffers(gl, cubeMesh, false);
    const starBuffers = createPointBuffers(gl);
    const particleBuffers = createPointBuffers(gl);

    const projection = mat4Identity();
    const view = mat4Identity();
    const model = mat4Identity();
    const ringModel = mat4Identity();
    const viewInfo = { centerX: 0, centerY: 0, radius: 0, biteX: 0, biteY: 0, scale: 1 };
    const cameraPos = [0.2, 0.25, 6.2];
    const cameraTarget = [0.78, 0.0, 0.0];
    const cameraUp = [0, 1, 0];

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.clearColor(0, 0, 0, 0);

    const renderer = {
      ready: true,
      viewInfo,
      resize(width, height, dpr) {
        renderer.width = width;
        renderer.height = height;
        renderer.pixelWidth = Math.max(220, Math.floor(width * dpr * SCENE_PIXEL_SCALE));
        renderer.pixelHeight = Math.max(140, Math.floor(height * dpr * SCENE_PIXEL_SCALE));
      },
      render(gameState, time) {
        const planet = gameState.planet;
        gl.viewport(0, 0, renderer.pixelWidth || canvas.width, renderer.pixelHeight || canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4Perspective(projection, degToRad(45), (renderer.width || 1) / Math.max(renderer.height || 1, 1), 0.1, 100);
        const orbitTarget = planet ? getPlanetWorldCenter(planet) : [0.82, 0, 0];
        const orbitCamera = getOrbitCameraPosition(gameState.camera, orbitTarget);
        cameraPos[0] = orbitCamera[0];
        cameraPos[1] = orbitCamera[1];
        cameraPos[2] = orbitCamera[2];
        cameraTarget[0] = orbitTarget[0];
        cameraTarget[1] = orbitTarget[1];
        cameraTarget[2] = orbitTarget[2];
        mat4LookAt(view, cameraPos, cameraTarget, cameraUp);

        drawStars3d(gl, pointProgram, starBuffers, projection, view, gameState.stars, time);

        if (!planet) {
          return;
        }

        if (planet.needsSurfaceUpload) {
          uploadPlanetBuffers(gl, sphereBuffers, ringBuffers, sphereMesh, ringMesh, planet);
          planet.needsSurfaceUpload = false;
        }

        const bob = Math.sin(planet.wobble) * 0.08;
        composeModelMatrix(model, [0.82, bob, 0], [0.32, planet.rotation, 0.14], [1, 1, 1]);
        composeModelMatrix(ringModel, [0.82, bob, 0], [1.12, planet.rotation * 0.55, planet.ringTilt], [planet.surfaceRadius, planet.surfaceRadius, planet.surfaceRadius]);

        renderBiteMarker3d(gl, solidProgram, cubeBuffers, projection, view, cameraPos, gameState, planet);
        renderBotCrew3d(gl, solidProgram, cubeBuffers, projection, view, cameraPos, gameState, planet, bob);
        drawPointParticles(gl, pointProgram, particleBuffers, projection, view, gameState.particles);
        drawSphereObject(gl, solidProgram, sphereBuffers, projection, view, model, cameraPos, planet.flash, [1, 1, 1]);

        if (planet.hasRing) {
          gl.enable(gl.BLEND);
          gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
          gl.depthMask(false);
          drawSphereObject(gl, solidProgram, ringBuffers, projection, view, ringModel, cameraPos, 0, [1, 1, 1]);
          gl.depthMask(true);
          gl.disable(gl.BLEND);
        }

        planet.flash *= 0.92;
        updateViewInfo(viewInfo, projection, view, model, planet.surfaceRadius, renderer.width, renderer.height);
      }
    };

    return renderer;
  }

  function createFallbackRenderer() {
    return {
      ready: false,
      viewInfo: { centerX: 0, centerY: 0, radius: 0, biteX: 0, biteY: 0, scale: 1 },
      resize() {},
      render() {}
    };
  }

  function createPointBuffers(gl) {
    return {
      position: gl.createBuffer(),
      color: gl.createBuffer(),
      size: gl.createBuffer(),
      count: 0
    };
  }

  function drawStars3d(gl, program, buffers, projection, view, stars, time) {
    const positions = new Float32Array(stars.length * 3);
    const colors = new Float32Array(stars.length * 4);
    const sizes = new Float32Array(stars.length);

    stars.forEach((star, index) => {
      positions[index * 3] = star.x + Math.sin(time * star.speed + star.phase) * 0.06;
      positions[index * 3 + 1] = star.y + Math.cos(time * star.speed * 0.8 + star.phase) * 0.04;
      positions[index * 3 + 2] = star.z;
      const rgb = colorToRgb(star.color);
      const twinkle = 0.45 + Math.sin(time * star.speed + star.phase) * 0.32;
      colors[index * 4] = rgb[0];
      colors[index * 4 + 1] = rgb[1];
      colors[index * 4 + 2] = rgb[2];
      colors[index * 4 + 3] = twinkle;
      sizes[index] = star.size;
    });

    drawPointSet(gl, program, buffers, projection, view, positions, colors, sizes, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  }

  function drawPointParticles(gl, program, buffers, projection, view, particles) {
    if (!particles.length) {
      return;
    }

    const positions = new Float32Array(particles.length * 3);
    const colors = new Float32Array(particles.length * 4);
    const sizes = new Float32Array(particles.length);

    particles.forEach((particle, index) => {
      positions[index * 3] = particle.x;
      positions[index * 3 + 1] = particle.y;
      positions[index * 3 + 2] = particle.z;
      const rgb = colorToRgb(particle.color);
      colors[index * 4] = rgb[0];
      colors[index * 4 + 1] = rgb[1];
      colors[index * 4 + 2] = rgb[2];
      colors[index * 4 + 3] = clamp(particle.life, 0, 1);
      sizes[index] = particle.size;
    });

    drawPointSet(gl, program, buffers, projection, view, positions, colors, sizes, gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  function drawPointSet(gl, program, buffers, projection, view, positions, colors, sizes, blendSrc, blendDst) {
    gl.enable(gl.BLEND);
    gl.blendFunc(blendSrc, blendDst);
    gl.depthMask(false);
    gl.useProgram(program.program);
    gl.uniformMatrix4fv(program.uniforms.uProjection, false, projection);
    gl.uniformMatrix4fv(program.uniforms.uView, false, view);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(program.attributes.aPosition);
    gl.vertexAttribPointer(program.attributes.aPosition, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(program.attributes.aColor);
    gl.vertexAttribPointer(program.attributes.aColor, 4, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.size);
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(program.attributes.aSize);
    gl.vertexAttribPointer(program.attributes.aSize, 1, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.POINTS, 0, sizes.length);
    gl.depthMask(true);
    gl.disable(gl.BLEND);
  }

  function renderBiteMarker3d(gl, program, cubeBuffers, projection, view, cameraPos, gameState, planet) {
    const wantsToEat = gameState.running && !gameState.paused && (gameState.keyDown || gameState.mouseEating);
    if (!wantsToEat && state.biteMarkTimer <= 0) {
      return;
    }

    const biteDir = getPlayerBiteLocalDir(gameState, planet);
    const bitePoint = getPlanetBiteWorldPosition(planet, biteDir);
    const outward = planetLocalDirToWorld(planet, biteDir);
    const pulse = wantsToEat ? (0.65 + Math.sin(gameState.time * 15) * 0.35) : clamp(state.biteMarkTimer / 0.22, 0, 1);
    const markerScale = 0.028 + pulse * 0.015;
    const nibbleCenter = addVec3(bitePoint, [outward[0] * 0.035, outward[1] * 0.035, outward[2] * 0.035]);
    const right = normalizeVec3(crossVec3([0, 1, 0], outward));
    const safeRight = Math.hypot(right[0], right[1], right[2]) < 0.001 ? [1, 0, 0] : right;
    const up = normalizeVec3(crossVec3(outward, safeRight));

    drawTintedCube(gl, program, cubeBuffers, projection, view, cameraPos, nibbleCenter, [gameState.time * 0.7, gameState.time * 0.4, 0], [markerScale, markerScale * 0.6, markerScale], "#fff2bd");
    drawTintedCube(gl, program, cubeBuffers, projection, view, cameraPos, addVec3(nibbleCenter, [up[0] * 0.045, up[1] * 0.045, up[2] * 0.045]), [0, 0, 0], [0.018, 0.028, 0.018], "#fff8d8");
    drawTintedCube(gl, program, cubeBuffers, projection, view, cameraPos, addVec3(nibbleCenter, [up[0] * -0.045, up[1] * -0.045, up[2] * -0.045]), [0, 0, 0], [0.018, 0.028, 0.018], "#fff8d8");
    drawTintedCube(gl, program, cubeBuffers, projection, view, cameraPos, addVec3(nibbleCenter, [safeRight[0] * 0.045, safeRight[1] * 0.045, safeRight[2] * 0.045]), [0, 0, 0], [0.018, 0.028, 0.018], "#fff8d8");
    drawTintedCube(gl, program, cubeBuffers, projection, view, cameraPos, addVec3(nibbleCenter, [safeRight[0] * -0.045, safeRight[1] * -0.045, safeRight[2] * -0.045]), [0, 0, 0], [0.018, 0.028, 0.018], "#fff8d8");
  }

  function renderBotCrew3d(gl, program, cubeBuffers, projection, view, cameraPos, gameState, planet, bob) {
    if (gameState.mode === "bot") {
      gameState.bots.forEach((bot, index) => {
        const [x, y, z] = getBotWorldPosition(bot, index, gameState, planet);
        drawTintedCube(gl, program, cubeBuffers, projection, view, cameraPos, [x, y, z], [0.1, bot.orbit, 0.1], [0.12, 0.12, 0.12], bot.color);
        drawTintedCube(gl, program, cubeBuffers, projection, view, cameraPos, [x, y, z], [0.1, bot.orbit, 0.1], [0.04, 0.04, 0.14], "#08131a");
      });
    }

    for (let i = 0; i < gameState.gadgets.orbitalDrone; i += 1) {
      const orbit = gameState.time * (0.95 + i * 0.2) + i * 1.8;
      const [x, y, z] = getDroneWorldPosition(i, gameState, planet);
      drawTintedCube(gl, program, cubeBuffers, projection, view, cameraPos, [x, y, z], [orbit * 0.6, orbit, 0], [0.08, 0.08, 0.08], "#8de8ff");
    }
  }

  function drawTintedCube(gl, program, cubeBuffers, projection, view, cameraPos, position, rotation, scale, color) {
    const model = mat4Identity();
    composeModelMatrix(model, position, rotation, scale);
    drawSphereObject(gl, program, cubeBuffers, projection, view, model, cameraPos, 0, colorToRgb(color));
  }

  function uploadPlanetBuffers(gl, sphereBuffers, ringBuffers, sphereMesh, ringMesh, planet) {
    const mesh = buildVoxelPlanetMesh(planet);

    gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffers.position);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.positions, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffers.normal);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.normals, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, sphereBuffers.color);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.colors, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereBuffers.index);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.DYNAMIC_DRAW);
    sphereBuffers.indexCount = mesh.indices.length;

    const ringColor = colorToRgb(planet.type.palette.ring);
    const ringColors = new Float32Array(ringMesh.vertexCount * 4);
    for (let i = 0; i < ringMesh.vertexCount; i += 1) {
      const innerMix = ringMesh.radii[i] < 1.55 ? 0.82 : 1;
      ringColors[i * 4] = ringColor[0] * innerMix;
      ringColors[i * 4 + 1] = ringColor[1] * innerMix;
      ringColors[i * 4 + 2] = ringColor[2];
      ringColors[i * 4 + 3] = ringMesh.radii[i] < 1.55 ? 0.3 : 0.18;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, ringBuffers.color);
    gl.bufferData(gl.ARRAY_BUFFER, ringColors, gl.DYNAMIC_DRAW);
  }

  function buildVoxelPlanetMesh(planet) {
    const positions = [];
    const normals = [];
    const colors = [];
    const indices = [];
    const half = planet.blockSize * 0.5;
    let indexCursor = 0;

    const faces = [
      { normal: [1, 0, 0], offset: [1, 0, 0], verts: [[half, -half, -half], [half, half, -half], [half, half, half], [half, -half, half]] },
      { normal: [-1, 0, 0], offset: [-1, 0, 0], verts: [[-half, -half, half], [-half, half, half], [-half, half, -half], [-half, -half, -half]] },
      { normal: [0, 1, 0], offset: [0, 1, 0], verts: [[-half, half, -half], [-half, half, half], [half, half, half], [half, half, -half]] },
      { normal: [0, -1, 0], offset: [0, -1, 0], verts: [[-half, -half, half], [-half, -half, -half], [half, -half, -half], [half, -half, half]] },
      { normal: [0, 0, 1], offset: [0, 0, 1], verts: [[-half, -half, half], [half, -half, half], [half, half, half], [-half, half, half]] },
      { normal: [0, 0, -1], offset: [0, 0, -1], verts: [[half, -half, -half], [-half, -half, -half], [-half, half, -half], [half, half, -half]] }
    ];

    for (const block of planet.blocks) {
      if (!block.alive) {
        continue;
      }
      for (const face of faces) {
        const neighbor = planet.blockLookup.get(blockKey(block.gx + face.offset[0], block.gy + face.offset[1], block.gz + face.offset[2]));
        if (neighbor && neighbor.alive) {
          continue;
        }

        for (const vertex of face.verts) {
          positions.push(block.x + vertex[0], block.y + vertex[1], block.z + vertex[2]);
          normals.push(face.normal[0], face.normal[1], face.normal[2]);
          const rgb = colorToRgb(block.color);
          colors.push(rgb[0], rgb[1], rgb[2], 1);
        }

        indices.push(indexCursor, indexCursor + 1, indexCursor + 2, indexCursor, indexCursor + 2, indexCursor + 3);
        indexCursor += 4;
      }
    }

    return {
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      colors: new Float32Array(colors),
      indices: new Uint16Array(indices)
    };
  }

  function updateViewInfo(viewInfo, projection, view, model, scale, width, height) {
    const center = projectPoint(projection, view, model, [0, 0, 0], width, height);
    const edge = projectPoint(projection, view, model, [-scale, 0, 0], width, height);
    const bite = projectPoint(projection, view, model, [-scale, 0.04 * scale, 0.01 * scale], width, height);

    viewInfo.centerX = center[0];
    viewInfo.centerY = center[1];
    viewInfo.radius = Math.max(40, distance2d(center[0], center[1], edge[0], edge[1]));
    viewInfo.biteX = bite[0];
    viewInfo.biteY = bite[1];
    viewInfo.scale = scale;
  }

  function drawSphereObject(gl, program, buffers, projection, view, model, cameraPos, flash, tint) {
    gl.useProgram(program.program);
    gl.uniformMatrix4fv(program.uniforms.uProjection, false, projection);
    gl.uniformMatrix4fv(program.uniforms.uView, false, view);
    gl.uniformMatrix4fv(program.uniforms.uModel, false, model);
    gl.uniform3fv(program.uniforms.uLightDir, new Float32Array([0.45, 0.72, 0.5]));
    gl.uniform3fv(program.uniforms.uCameraPos, new Float32Array(cameraPos));
    gl.uniform1f(program.uniforms.uFlash, flash || 0);
    gl.uniform3fv(program.uniforms.uTint, new Float32Array(tint || [1, 1, 1]));

    bindMesh(gl, program, buffers);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);
    gl.drawElements(gl.TRIANGLES, buffers.indexCount, gl.UNSIGNED_SHORT, 0);
  }

  function drawAtmosphere(gl, program, buffers, projection, view, model, cameraPos, color) {
    gl.useProgram(program.program);
    gl.uniformMatrix4fv(program.uniforms.uProjection, false, projection);
    gl.uniformMatrix4fv(program.uniforms.uView, false, view);
    gl.uniformMatrix4fv(program.uniforms.uModel, false, model);
    gl.uniform3fv(program.uniforms.uCameraPos, new Float32Array(cameraPos));
    gl.uniform3fv(program.uniforms.uColor, new Float32Array(color));

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.FRONT);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.enableVertexAttribArray(program.attributes.aPosition);
    gl.vertexAttribPointer(program.attributes.aPosition, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.enableVertexAttribArray(program.attributes.aNormal);
    gl.vertexAttribPointer(program.attributes.aNormal, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index);
    gl.drawElements(gl.TRIANGLES, buffers.indexCount, gl.UNSIGNED_SHORT, 0);
    gl.cullFace(gl.BACK);
  }

  function bindMesh(gl, program, buffers) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.enableVertexAttribArray(program.attributes.aPosition);
    gl.vertexAttribPointer(program.attributes.aPosition, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.enableVertexAttribArray(program.attributes.aNormal);
    gl.vertexAttribPointer(program.attributes.aNormal, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.enableVertexAttribArray(program.attributes.aColor);
    gl.vertexAttribPointer(program.attributes.aColor, 4, gl.FLOAT, false, 0, 0);
  }

  function createMeshBuffers(gl, mesh, dynamicColor) {
    const position = gl.createBuffer();
    const normal = gl.createBuffer();
    const color = gl.createBuffer();
    const index = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, position);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.positions, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, normal);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.normals, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, color);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.colors || new Float32Array(mesh.vertexCount * 4), dynamicColor ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);

    return {
      position,
      normal,
      color,
      index,
      indexCount: mesh.indices.length
    };
  }

  function createProgram(gl, vertexSource, fragmentSource, attributes) {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || "Failed to link shader program.");
    }

    const attributeMap = {};
    attributes.forEach((name) => {
      attributeMap[name] = gl.getAttribLocation(program, name);
    });

    const uniformMap = {};
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i += 1) {
      const info = gl.getActiveUniform(program, i);
      uniformMap[info.name] = gl.getUniformLocation(program, info.name);
    }

    return { program, attributes: attributeMap, uniforms: uniformMap };
  }

  function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) || "Shader compile failed.");
    }
    return shader;
  }

  function createSphereMesh(longitudeSegments, latitudeSegments) {
    const positions = [];
    const normals = [];
    const colors = [];
    const indices = [];

    for (let lat = 0; lat <= latitudeSegments; lat += 1) {
      const v = lat / latitudeSegments;
      const theta = v * Math.PI;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= longitudeSegments; lon += 1) {
        const u = lon / longitudeSegments;
        const phi = u * TWO_PI;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = sinTheta * cosPhi;
        const y = cosTheta;
        const z = sinTheta * sinPhi;

        positions.push(x, y, z);
        normals.push(x, y, z);
        colors.push(1, 1, 1, 1);
      }
    }

    for (let lat = 0; lat < latitudeSegments; lat += 1) {
      for (let lon = 0; lon < longitudeSegments; lon += 1) {
        const first = lat * (longitudeSegments + 1) + lon;
        const second = first + longitudeSegments + 1;
        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }

    return {
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      colors: new Float32Array(colors),
      indices: new Uint16Array(indices),
      vertexCount: positions.length / 3
    };
  }

  function createCubeMesh() {
    const positions = [
      -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
      -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1, -1,
      -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1,
      -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1,
      1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1,
      -1, -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1
    ];
    const normals = [
      0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
      0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
      0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
      0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
      1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
      -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0
    ];
    const colors = new Array(24).fill(0).flatMap(() => [1, 1, 1, 1]);
    const indices = [
      0, 1, 2, 0, 2, 3,
      4, 5, 6, 4, 6, 7,
      8, 9, 10, 8, 10, 11,
      12, 13, 14, 12, 14, 15,
      16, 17, 18, 16, 18, 19,
      20, 21, 22, 20, 22, 23
    ];
    return {
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      colors: new Float32Array(colors),
      indices: new Uint16Array(indices),
      vertexCount: 24
    };
  }

  function createRingMesh(segments, innerRadius, outerRadius) {
    const positions = [];
    const normals = [];
    const colors = [];
    const indices = [];
    const radii = [];

    for (let i = 0; i <= segments; i += 1) {
      const angle = (i / segments) * TWO_PI;
      const x = Math.cos(angle);
      const z = Math.sin(angle);

      positions.push(x * innerRadius, 0, z * innerRadius);
      normals.push(0, 1, 0);
      colors.push(1, 1, 1, 0.25);
      radii.push(innerRadius);

      positions.push(x * outerRadius, 0, z * outerRadius);
      normals.push(0, 1, 0);
      colors.push(1, 1, 1, 0.18);
      radii.push(outerRadius);
    }

    for (let i = 0; i < segments; i += 1) {
      const a = i * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;
      indices.push(a, b, c);
      indices.push(b, d, c);
    }

    return {
      positions: new Float32Array(positions),
      normals: new Float32Array(normals),
      colors: new Float32Array(colors),
      indices: new Uint16Array(indices),
      vertexCount: positions.length / 3,
      radii
    };
  }

  function composeModelMatrix(out, position, rotation, scale) {
    mat4IdentityInto(out);
    mat4Translate(out, out, position);
    mat4RotateY(out, out, rotation[1]);
    mat4RotateX(out, out, rotation[0]);
    mat4RotateZ(out, out, rotation[2]);
    mat4Scale(out, out, scale);
    return out;
  }

  function projectPoint(projection, view, model, point, width, height) {
    const mv = mat4Identity();
    const mvp = mat4Identity();
    mat4Multiply(mv, view, model);
    mat4Multiply(mvp, projection, mv);
    const clip = transformVec4(mvp, [point[0], point[1], point[2], 1]);
    const w = clip[3] || 1;
    const ndcX = clip[0] / w;
    const ndcY = clip[1] / w;
    return [
      (ndcX * 0.5 + 0.5) * width,
      (1 - (ndcY * 0.5 + 0.5)) * height
    ];
  }

  function mat4Identity() {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  function mat4IdentityInto(out) {
    out[0] = 1; out[1] = 0; out[2] = 0; out[3] = 0;
    out[4] = 0; out[5] = 1; out[6] = 0; out[7] = 0;
    out[8] = 0; out[9] = 0; out[10] = 1; out[11] = 0;
    out[12] = 0; out[13] = 0; out[14] = 0; out[15] = 1;
    return out;
  }

  function mat4Multiply(out, a, b) {
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    const b00 = b[0], b01 = b[1], b02 = b[2], b03 = b[3];
    const b10 = b[4], b11 = b[5], b12 = b[6], b13 = b[7];
    const b20 = b[8], b21 = b[9], b22 = b[10], b23 = b[11];
    const b30 = b[12], b31 = b[13], b32 = b[14], b33 = b[15];

    out[0] = a00 * b00 + a10 * b01 + a20 * b02 + a30 * b03;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02 + a31 * b03;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02 + a32 * b03;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02 + a33 * b03;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12 + a30 * b13;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12 + a31 * b13;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12 + a32 * b13;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12 + a33 * b13;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22 + a30 * b23;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22 + a31 * b23;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22 + a32 * b23;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22 + a33 * b23;
    out[12] = a00 * b30 + a10 * b31 + a20 * b32 + a30 * b33;
    out[13] = a01 * b30 + a11 * b31 + a21 * b32 + a31 * b33;
    out[14] = a02 * b30 + a12 * b31 + a22 * b32 + a32 * b33;
    out[15] = a03 * b30 + a13 * b31 + a23 * b32 + a33 * b33;
    return out;
  }

  function mat4Perspective(out, fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
  }

  function mat4LookAt(out, eye, center, up) {
    const z = normalizeVec3([eye[0] - center[0], eye[1] - center[1], eye[2] - center[2]]);
    const x = normalizeVec3(crossVec3(up, z));
    const y = crossVec3(z, x);

    out[0] = x[0];
    out[1] = y[0];
    out[2] = z[0];
    out[3] = 0;
    out[4] = x[1];
    out[5] = y[1];
    out[6] = z[1];
    out[7] = 0;
    out[8] = x[2];
    out[9] = y[2];
    out[10] = z[2];
    out[11] = 0;
    out[12] = -dotVec3(x, eye);
    out[13] = -dotVec3(y, eye);
    out[14] = -dotVec3(z, eye);
    out[15] = 1;
    return out;
  }

  function mat4Translate(out, a, v) {
    const x = v[0], y = v[1], z = v[2];
    if (a === out) {
      out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
      out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
      out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
      out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
      return out;
    }
    mat4Multiply(out, a, new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]));
    return out;
  }

  function mat4Scale(out, a, v) {
    const x = v[0], y = v[1], z = v[2];
    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
  }

  function mat4RotateX(out, a, rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];

    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
  }

  function mat4RotateY(out, a, rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];

    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
  }

  function mat4RotateZ(out, a, rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];

    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
  }

  function transformVec4(matrix, vector) {
    const x = vector[0];
    const y = vector[1];
    const z = vector[2];
    const w = vector[3];
    return [
      matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12] * w,
      matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13] * w,
      matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14] * w,
      matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15] * w
    ];
  }

  function crossVec3(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  function dotVec3(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  function subVec3(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  }

  function addVec3(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  }

  function normalizeVec3(v) {
    const length = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / length, v[1] / length, v[2] / length];
  }

  function rotateVecX(v, rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    return [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c];
  }

  function rotateVecY(v, rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c];
  }

  function rotateVecZ(v, rad) {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    return [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]];
  }

  function distance2d(ax, ay, bx, by) {
    return Math.hypot(ax - bx, ay - by);
  }

  function degToRad(value) {
    return value * Math.PI / 180;
  }

  function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function pick(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function randomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  const SOLID_VERTEX_SHADER = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    attribute vec4 aColor;

    uniform mat4 uProjection;
    uniform mat4 uView;
    uniform mat4 uModel;

    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying vec4 vColor;

    void main() {
      vec4 world = uModel * vec4(aPosition, 1.0);
      gl_Position = uProjection * uView * world;
      vWorldPos = world.xyz;
      vNormal = mat3(uModel) * aNormal;
      vColor = aColor;
    }
  `;

  const SOLID_FRAGMENT_SHADER = `
    precision mediump float;

    uniform vec3 uLightDir;
    uniform vec3 uCameraPos;
    uniform float uFlash;
    uniform vec3 uTint;

    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying vec4 vColor;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 lightDir = normalize(-uLightDir);
      vec3 viewDir = normalize(uCameraPos - vWorldPos);

      float diffuse = max(dot(normal, lightDir), 0.0);
      float rim = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.4) * 0.28;
      vec3 reflectDir = reflect(-lightDir, normal);
      float specular = pow(max(dot(reflectDir, viewDir), 0.0), 18.0) * 0.2;

      vec3 flash = vec3(1.0, 0.96, 0.75) * uFlash * 0.18;
      vec3 color = (vColor.rgb * uTint) * (0.32 + diffuse * 0.95 + rim) + specular + flash;
      color = floor(color * 6.0) / 6.0;
      gl_FragColor = vec4(color, vColor.a);
    }
  `;

  const ATMOS_VERTEX_SHADER = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;

    uniform mat4 uProjection;
    uniform mat4 uView;
    uniform mat4 uModel;

    varying vec3 vNormal;
    varying vec3 vWorldPos;

    void main() {
      vec4 world = uModel * vec4(aPosition, 1.0);
      gl_Position = uProjection * uView * world;
      vWorldPos = world.xyz;
      vNormal = mat3(uModel) * aNormal;
    }
  `;

  const ATMOS_FRAGMENT_SHADER = `
    precision mediump float;

    uniform vec3 uCameraPos;
    uniform vec3 uColor;

    varying vec3 vNormal;
    varying vec3 vWorldPos;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(uCameraPos - vWorldPos);
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.4);
      float alpha = fresnel * 0.38;
      gl_FragColor = vec4(uColor, alpha);
    }
  `;

  const POINT_VERTEX_SHADER = `
    attribute vec3 aPosition;
    attribute vec4 aColor;
    attribute float aSize;

    uniform mat4 uProjection;
    uniform mat4 uView;

    varying vec4 vColor;

    void main() {
      vec4 viewPos = uView * vec4(aPosition, 1.0);
      gl_Position = uProjection * viewPos;
      gl_PointSize = max(1.0, aSize * (70.0 / max(1.0, -viewPos.z)));
      vColor = aColor;
    }
  `;

  const POINT_FRAGMENT_SHADER = `
    precision mediump float;

    varying vec4 vColor;

    void main() {
      gl_FragColor = vColor;
    }
  `;

  init();
})();
