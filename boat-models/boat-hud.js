    const BOAT_ALIASES = {
      gommone: 'gommone', rib: 'gommone',
      vela: 'vela', sail: 'vela', sailboat: 'vela',
      'barca-a-vela': 'vela', barca_a_vela: 'vela', 'barca a vela': 'vela',
      catamarano: 'catamarano', cat: 'catamarano', catamaran: 'catamarano',
      yacht: 'yacht', motoryacht: 'yacht', my: 'yacht'
    };

    const BOAT_CONFIGS = {
      gommone: {
        id: 'gommone',
        tag: 'RETICULAR 3D MAPPING // GOMMONE',
        title: 'GENERIC RIB — HULL 01',
        specs: 'LOA 7.50M · BEAM 2.80M · DRAFT 0.50M · TUBES Ø0.53M · 250 HP',
        root: 'Gommone',
        rig: 'Mapping_Rig',
        cores: ['Gommone_Hull_Core', 'Gommone_Tubes_Core', 'Gommone_Console_Core'],
        animated: [
          { name: 'Gommone_Prop', type: 'spin', speed: 180, axis: 'z' }
        ]
      },
      vela: {
        id: 'vela',
        tag: 'RETICULAR 3D MAPPING // VELA',
        title: 'GENERIC SAILBOAT — HULL 01',
        specs: 'LOA 13.90M · BEAM 4.30M · DRAFT 2.15M · MAST 19.80M',
        root: 'Vela',
        rig: 'Mapping_Rig',
        cores: ['Vela_Hull_Core', 'Vela_Cabin_Core', 'Vela_Cockpit_Core'],
        animated: [
          { name: 'Vela_Wind_Vane', type: 'spin', speed: 80, axis: 'y' },
          { name: 'Vela_Sail_Main', type: 'sway', speed: 0.55, amplitude: 5, axis: 'z' },
          { name: 'Vela_Sail_Jib', type: 'sway', speed: 0.7, amplitude: 4, axis: 'z' }
        ]
      },
      catamarano: {
        id: 'catamarano',
        tag: 'RETICULAR 3D MAPPING // CATAMARANO',
        title: 'GENERIC CATAMARAN — HULL 01',
        specs: 'LOA 12.80M · BEAM 7.70M · DRAFT 1.25M · HULL SPACING 6.00M',
        root: 'Catamarano',
        rig: 'Mapping_Rig',
        cores: [
          'Catamarano_Hull_Port_Core',
          'Catamarano_Hull_Starboard_Core',
          'Catamarano_Bridgedeck_Core'
        ],
        animated: [
          { name: 'Catamarano_Radar_Scanner', type: 'spin', speed: 65, axis: 'y' }
        ]
      },
      yacht: {
        id: 'yacht',
        tag: 'RETICULAR 3D MAPPING // YACHT',
        title: 'GENERIC MOTOR YACHT — HULL 01',
        specs: 'LOA 28.0M · BEAM 6.4M · DRAFT 1.3M · 2×1.200 HP',
        root: 'Yacht',
        rig: 'Mapping_Rig',
        cores: ['Yacht_Hull_Core', 'Yacht_Saloon_Core', 'Yacht_Flybridge_Core'],
        animated: [
          { name: 'Yacht_Radar_Scanner', type: 'spin', speed: 65, axis: 'y' }
        ]
      }
    };

    // Spline runtime rotations are radians. Set this to 1 if a host API uses degrees.
    const SPLINE_ROTATION_UNIT = Math.PI / 180;
    function toSplineRot(deg) { return deg * SPLINE_ROTATION_UNIT; }
    function fromSplineRot(value) {
      if (value == null || Number.isNaN(Number(value))) return 0;
      return Number(value) / SPLINE_ROTATION_UNIT;
    }

    const VIEW_MODES = [
      { label: 'CORE', visible: true, alpha: 92 },
      { label: 'X-RAY', visible: true, alpha: 32 },
      { label: 'WIRE', visible: false }
    ];

    const BOAT_IDS = Object.keys(BOAT_CONFIGS);

    function normalizeBoatId(raw) {
      if (raw == null) return null;
      const key = String(raw).trim().toLowerCase();
      if (!key) return null;
      return BOAT_ALIASES[key] || (BOAT_CONFIGS[key] ? key : null);
    }

    function resolveBoatId(search, dataBoat) {
      const fromUrl = typeof search === 'string'
        ? new URLSearchParams(search.startsWith('?') ? search.slice(1) : search).get('boat')
        : null;
      return normalizeBoatId(fromUrl) || normalizeBoatId(dataBoat) || 'yacht';
    }

    function createSplineAdapter(raw) {
      if (!raw) return null;
      return {
        ready: raw.ready != null ? raw.ready : Promise.resolve(),
        findObjectByName: (name) => raw.findObjectByName(name),
        updateObject: (id, props) => raw.updateObject(id, props)
      };
    }

    function readAxisRotation(obj, axis) {
      if (!obj || !obj.rotation) return 0;
      return fromSplineRot(obj.rotation[axis]);
    }

    async function findOptional(api, name) {
      if (!name) return null;
      try {
        const obj = await api.findObjectByName(name);
        return obj || null;
      } catch (err) {
        console.warn('Spline object not found:', name, err);
        return null;
      }
    }

    async function startBoatHud(options) {
      const host = (options && options.spline)
        || (typeof spline !== 'undefined' ? spline : window.spline);
      const api = createSplineAdapter(host);
      if (!api) {
        console.warn('Spline API not available');
        return null;
      }

      await api.ready;

      const search = (options && options.search) != null
        ? options.search
        : (window.location && window.location.search) || '';
      const dataBoat = (options && options.dataBoat) != null
        ? options.dataBoat
        : (document.body && document.body.getAttribute('data-boat'));
      const requested = (options && options.boatId) || null;
      const boatId = normalizeBoatId(requested) || resolveBoatId(search, dataBoat);
      const config = BOAT_CONFIGS[boatId] || BOAT_CONFIGS.yacht;

      const hudTag = document.getElementById('hudTag');
      const hudTitle = document.getElementById('hudTitle');
      const hudSpecs = document.getElementById('hudSpecs');
      const telem = document.getElementById('telem');
      const btnMode = document.getElementById('btnMode');
      const btnGrid = document.getElementById('btnGrid');
      const btnSpin = document.getElementById('btnSpin');
      const btnReset = document.getElementById('btnReset');

      if (hudTag) hudTag.textContent = config.tag;
      if (hudTitle) hudTitle.textContent = config.title;
      if (hudSpecs) hudSpecs.textContent = config.specs;

      const root = await findOptional(api, config.root);
      const rig = await findOptional(api, config.rig);
      const cores = [];
      for (const name of config.cores || []) {
        const obj = await findOptional(api, name);
        if (obj) cores.push(obj);
      }
      const animated = [];
      for (const part of config.animated || []) {
        const obj = await findOptional(api, part.name);
        if (!obj) continue;
        const axis = part.axis || 'y';
        animated.push({
          ...part,
          axis,
          obj,
          angle: readAxisRotation(obj, axis)
        });
      }

      if (!root) {
        console.warn('Root object not found:', config.root);
      }

      let modeIdx = 0;
      let gridOn = true;
      let autoSpin = true;
      let dragging = false;
      let yaw = root ? readAxisRotation(root, 'y') : 0;
      let running = true;

      function syncLabels() {
        if (btnMode) btnMode.textContent = 'VIEW: ' + VIEW_MODES[modeIdx].label;
        if (btnGrid) {
          btnGrid.textContent = 'GRID: ' + (gridOn ? 'ON' : 'OFF');
          btnGrid.classList.toggle('active', gridOn);
        }
        if (btnSpin) {
          btnSpin.textContent = 'SPIN: ' + (autoSpin ? 'ON' : 'OFF');
          btnSpin.classList.toggle('active', autoSpin);
        }
      }

      function applyMode() {
        const mode = VIEW_MODES[modeIdx];
        for (const core of cores) {
          const id = core.id;
          if (id == null) continue;
          const patch = { visible: mode.visible };
          if (mode.visible) patch.material = { alpha: mode.alpha };
          api.updateObject(id, patch);
        }
      }

      function setYaw(next) {
        yaw = ((next % 360) + 360) % 360;
        if (root && root.id != null) {
          api.updateObject(root.id, { rotation: { y: toSplineRot(yaw) } });
        }
      }

      if (btnMode) {
        btnMode.addEventListener('click', () => {
          modeIdx = (modeIdx + 1) % VIEW_MODES.length;
          applyMode();
          syncLabels();
        });
      }

      if (btnGrid) {
        btnGrid.addEventListener('click', () => {
          gridOn = !gridOn;
          if (rig && rig.id != null) api.updateObject(rig.id, { visible: gridOn });
          syncLabels();
        });
      }

      if (btnSpin) {
        btnSpin.addEventListener('click', () => {
          autoSpin = !autoSpin;
          syncLabels();
        });
      }

      if (btnReset) {
        btnReset.addEventListener('click', () => {
          setYaw(0);
        });
      }

      function onPointerDown(e) {
        if (e.target && e.target.closest && e.target.closest('.toolbar')) return;
        dragging = true;
      }
      function onPointerUp() { dragging = false; }

      window.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);

      let last = performance.now();
      let lastHud = 0;
      let rafId = 0;

      function tick(now) {
        if (!running) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;

        if (autoSpin && !dragging && root) {
          setYaw(yaw + dt * 10);
        }

        for (const part of animated) {
          if (!part.obj || part.obj.id == null) continue;
          let valueDeg;
          if (part.type === 'sway') {
            const freq = part.speed || 0.6;
            const amp = part.amplitude || 6;
            valueDeg = Math.sin((now / 1000) * freq * Math.PI * 2) * amp;
          } else {
            part.angle = (part.angle + dt * (part.speed || 60)) % 360;
            valueDeg = part.angle;
          }
          api.updateObject(part.obj.id, { rotation: { [part.axis]: toSplineRot(valueDeg) } });
        }

        if (telem && now - lastHud > 120) {
          lastHud = now;
          const deg = ((yaw % 360) + 360) % 360;
          telem.textContent =
            'YAW ' + deg.toFixed(1).padStart(5, '0') + '° · MODE ' + VIEW_MODES[modeIdx].label +
            ' · SPIN ' + (autoSpin ? 'ON' : 'OFF');
        }

        rafId = requestAnimationFrame(tick);
      }

      syncLabels();
      rafId = requestAnimationFrame(tick);

      const controller = {
        config,
        boatId: config.id,
        stop() {
          running = false;
          if (rafId) cancelAnimationFrame(rafId);
          window.removeEventListener('pointerdown', onPointerDown);
          window.removeEventListener('pointerup', onPointerUp);
          window.removeEventListener('pointercancel', onPointerUp);
        }
      };
      return controller;
    }

    window.SDT_BOAT_HUD = {
      configs: BOAT_CONFIGS,
      aliases: BOAT_ALIASES,
      ids: BOAT_IDS,
      resolveBoatId,
      normalizeBoatId,
      toSplineRot,
      fromSplineRot,
      createSplineAdapter,
      start: startBoatHud,
      ROTATION_UNIT: SPLINE_ROTATION_UNIT
    };

    if (!window.SDT_BOAT_HUD_MANUAL) {
      startBoatHud().catch((err) => console.warn('Boat HUD failed to start', err));
    }
