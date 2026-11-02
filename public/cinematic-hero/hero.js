// Swap images and copy here. No library, framework, or build step required.
const slides = [
  {
    image: '/cinematic-hero/photos/coastal-hike.png',
    thumb: '/cinematic-hero/photos/coastal-hike.png',
    headlineLine1: 'Give your story an', headlineLine2: 'unforgettable entrance',
    taglineBold: 'Turn any first impression into a moment people remember.',
    taglineRest: 'A cinematic hero built to introduce your next idea, product, or story.',
    alt: 'Hiker on a rocky coastal trail overlooking the sea'
  },
  {
    image: '/cinematic-hero/photos/porto-flavia.png',
    thumb: '/cinematic-hero/photos/porto-flavia.png',
    headlineLine1: 'Follow the horizon.', headlineLine2: 'Find something new.',
    taglineBold: 'Let curiosity take you a little further.',
    taglineRest: 'Open waters, endless possibility, and a fresh perspective waiting just beyond the familiar.',
    alt: 'Porto Flavia built into limestone cliffs above turquoise water'
  },
  {
    image: '/cinematic-hero/photos/sa-stiddiosa.jpg',
    thumb: '/cinematic-hero/photos/sa-stiddiosa.jpg',
    headlineLine1: 'Leave the noise.', headlineLine2: 'Enter the extraordinary.',
    taglineBold: 'Some moments deserve your full attention.',
    taglineRest: 'Step into the stillness and discover a different rhythm, where every detail has room to breathe.',
    alt: 'Sa Stiddiosa with lush rock walls above a clear river'
  }
];

class CinematicHero extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <link rel="stylesheet" href="${new URL('./hero.css', import.meta.url)}">
      <section aria-roledescription="carousel" aria-label="Featured stories">
        <!-- Only these full-width image panels move. -->
        <div class="images" aria-hidden="true"></div>
        <div class="overlay" aria-hidden="true"></div>
        <!-- One stationary text layer above every image and the overlay. -->
        <div class="content" aria-live="polite" aria-atomic="true">
          <h1><span></span><span></span></h1>
          <p class="tagline"><strong></strong> <span></span></p>
        </div>
        <div class="divider" aria-hidden="true"></div>
        <div class="thumbnails" role="group" aria-label="Choose a slide"></div>
      </section>`;
    const images = root.querySelector('.images');
    const strip = root.querySelector('.thumbnails');
    slides.forEach((slide, index) => {
      // Warm the full-size photos before a visitor selects another slide.
      const preload = new Image();
      preload.src = slide.image;
      const panel = document.createElement('div');
      panel.className = 'panel';
      const media = document.createElement('div');
      media.className = 'media';
      media.style.backgroundImage = `url("${slide.image}")`;
      panel.append(media);
      panel.style.zIndex = index === 0 ? '1' : '0';
      panel.style.clipPath = index === 0 ? 'inset(0 0 0 0%)' : 'inset(0 0 0 100%)';
      images.append(panel);
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', `Show slide ${index + 1}: ${slide.headlineLine1} ${slide.headlineLine2}`);
      button.setAttribute('aria-current', String(index === 0));
      button.setAttribute('aria-pressed', String(index === 0));
      const img = document.createElement('img');
      img.src = slide.thumb;
      img.alt = slide.alt;
      img.width = 120; img.height = 80;
      button.append(img);
      button.addEventListener('click', () => this.select(index));
      strip.append(button);
    });
    this.active = 0;
    this.busy = false;
    this.pending = null;
    this.ready = false; // clicks are enabled when the opening finishes
    this.handoffWindow = 1; // a late click lets the current reveal finish, then starts
    this.motion = matchMedia('(prefers-reduced-motion: reduce)');
    this.updateText(0);
    this.setAttribute('data-intro', 'pending');
    this.runIntro();
  }

  disconnectedCallback() {
    this.introObserver?.disconnect();
    this.introTl?.kill();
    this.splits?.forEach((s) => s.revert());
  }

  // Masked lines for the opening reveal. SplitText can't measure line breaks
  // inside this shadow root (it returns one line per element), so the two
  // authored headline lines and the tagline are masked directly instead.
  splitText() {
    const root = this.shadowRoot;
    this.splits?.forEach((s) => s.revert());
    const targets = [...root.querySelectorAll('h1 > span'), root.querySelector('.tagline')];
    this.splits = targets.map((el) => {
      const html = el.innerHTML;
      el.classList.add('line-mask');
      el.innerHTML = `<span class="line">${html}</span>`;
      return { lines: [el.firstElementChild], revert: () => { el.innerHTML = el.firstElementChild?.innerHTML ?? el.innerHTML; el.classList.remove('line-mask'); } };
    });
    return this.splits.flatMap((s) => s.lines);
  }

  // Opening (Hero 01 brief): centre slit -> 30% window -> full frame, then
  // overlay fade and masked line reveal. Plays on load if the hero is in view,
  // otherwise the first time it scrolls into view.
  async runIntro() {
    const gsap = await this.whenGsap();
    const root = this.shadowRoot;
    const finish = () => {
      this.setAttribute('data-intro', 'done');
      this.ready = true;
    };
    if (!gsap || this.motion.matches) { finish(); return; }
    await document.fonts?.ready;
    const images = root.querySelector('.images');
    const media = root.querySelectorAll('.panel')[this.active].querySelector('.media');
    const overlay = root.querySelector('.overlay');
    const thumbs = root.querySelector('.thumbnails');
    const divider = root.querySelector('.divider');
    gsap.set(images, { clipPath: 'polygon(50% 20%, 50% 20%, 50% 80%, 50% 80%)' });
    gsap.set([overlay, thumbs, divider], { autoAlpha: 0 });
    const lines = this.splitText();
    this.setAttribute('data-intro', 'split');
    gsap.set(lines, { yPercent: 110 });
    const play = () => {
      const tl = gsap.timeline({ onComplete: () => {
        gsap.set(images, { clearProps: 'clipPath' });
        finish();
      } });
      this.introTl = tl;
      tl.to(images, { clipPath: 'polygon(35% 20%, 65% 20%, 65% 80%, 35% 80%)', duration: 1.4, ease: 'power2.inOut' }, 0)
        .fromTo(media, { scale: 1 }, { scale: 0.86, duration: 1.4, ease: 'power2.inOut' }, 0)
        .to(images, { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 1.65, ease: 'power4.inOut' }, '-=.1')
        .to(media, { scale: 1, duration: 1.65, ease: 'power4.inOut' }, '<')
        .to(overlay, { autoAlpha: 1, duration: 1.7, ease: 'none' }, '<+=.5')
        .to(lines, { yPercent: 0, duration: 1, stagger: 0.06, ease: 'expo.out' }, 2.24)
        .to([divider, thumbs], { autoAlpha: 1, duration: 0.8, ease: 'power2.out' }, '>-0.4');
      // Same choreography, played at double speed (about 1.8s instead of 3.6s).
      tl.timeScale(2);
    };
    const r = this.getBoundingClientRect();
    if (r.top < innerHeight * 0.6 && r.bottom > 0) { play(); return; }
    this.introObserver = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { this.introObserver.disconnect(); play(); }
    }, { threshold: 0.35 });
    this.introObserver.observe(this);
  }

  updateText(index) {
    const slide = slides[index];
    const root = this.shadowRoot;
    root.querySelector('h1 span:first-child').textContent = slide.headlineLine1;
    root.querySelector('h1 span:last-child').textContent = slide.headlineLine2;
    root.querySelector('.tagline strong').textContent = slide.taglineBold;
    root.querySelector('.tagline span').textContent = slide.taglineRest;
  }

  // Media switching from the Cinematic Media Hero brief (no intro/loader).
  // Uses the site's CDN GSAP (window.gsap), waiting for it if needed.
  whenGsap() {
    return new Promise((resolve) => {
      const tick = (n) => (window.gsap ? resolve(window.gsap) : n > 300 ? resolve(null) : requestAnimationFrame(() => tick(n + 1)));
      tick(0);
    });
  }

  setActiveThumb(index) {
    this.shadowRoot.querySelectorAll('.thumbnails button').forEach((button, i) => {
      button.setAttribute('aria-current', String(i === index));
      button.setAttribute('aria-pressed', String(i === index));
    });
  }

  async select(index) {
    if (!this.ready) return;
    if (this.busy) {
      // One transition at a time: queue the latest click, run it after this one completes.
      if (index !== this.target) this.pending = index;
      return;
    }
    if (index === this.active) return;
    this.busy = true;
    this.target = index;
    const root = this.shadowRoot;
    const panels = root.querySelectorAll('.panel');
    const outgoing = panels[this.active];
    const incoming = panels[index];
    const outMedia = outgoing.querySelector('.media');
    const inMedia = incoming.querySelector('.media');
    const content = root.querySelector('.content');
    this.setActiveThumb(index);
    const gsap = await this.whenGsap();
    try {
      if (gsap && !this.motion.matches) {
        panels.forEach((p) => { if (p !== outgoing && p !== incoming) p.style.zIndex = '0'; });
        outgoing.style.zIndex = '1';
        incoming.style.zIndex = '2';
        const tl = gsap.timeline({ defaults: { duration: 2.35, ease: 'expo.out' } });
        tl.fromTo(incoming, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)' }, 0)
          .fromTo(inMedia, { xPercent: 10, scale: 1.2 }, { xPercent: 0, scale: 1 }, 0)
          .fromTo(outMedia, { xPercent: 0 }, { xPercent: -10 }, 0)
          .to(content, { opacity: 0, duration: 0.14, ease: 'none' }, 0)
          .add(() => { this.splits?.forEach((s) => s.revert()); this.splits = []; this.updateText(index); }, 0.14)
          .to(content, { opacity: 1, duration: 0.14, ease: 'none' }, 0.14);
        await tl.then();
        gsap.set(outgoing, { clipPath: 'inset(0 0 0 100%)' });
        gsap.set(outMedia, { xPercent: 0, scale: 1 });
      } else {
        incoming.style.clipPath = 'inset(0 0 0 0%)';
        outgoing.style.clipPath = 'inset(0 0 0 100%)';
        this.updateText(index);
      }
    } finally {
      outgoing.style.zIndex = '0';
      incoming.style.zIndex = '1';
      this.active = index;
      this.busy = false;
      const next = this.pending;
      this.pending = null;
      if (next !== null && next !== index) this.select(next);
    }
  }
}
if (!customElements.get('cinematic-hero')) customElements.define('cinematic-hero', CinematicHero);
