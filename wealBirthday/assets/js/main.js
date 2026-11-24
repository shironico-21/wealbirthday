/* =========================================================
   EDIT YOUR CONTENT HERE
   ========================================================= */
const CONTENT = {
  signature: "With all my love, Me",
  letter: [
    "Today is yours, and I wanted to give you something that couldn't fit inside a card.",
    "Every year you remind me that the best people make ordinary days feel like occasions. Thank you for being exactly who you are.",
    "Scroll on. I gathered a few of our moments and gave each one its own word, like entries in a dictionary only we can read."
  ],
  closing: "May this year be gentle, bright and full of everything you love. Happy birthday. I'm so glad you're mine."
};
const memories = [
  { word: "Happiness", type: "noun", image: "assets/media/images/memory1.jpg", date: "Summer 2023", description: "A little moment worth remembering." },
  { word: "Adventure", type: "noun", image: "assets/media/images/memory2.jpg", date: "Spring 2024", description: "One of those memories that stays." },
  { word: "Home", type: "noun", image: "assets/media/images/memory3.jpg", date: "Always", description: "Wherever you happen to be." }
];
// Paste any YouTube link (watch, youtu.be or embed) for the lullaby. Leave "" to use the local mp3 instead.
const MUSIC_URL = "https://youtube.com/playlist?list=RDZ2daIuVk0wY&playnext=1&si=8dw0zijqIfxfx9Lh";

const AFFECTION = ["Dear","Precious","Wonderful","Sunshine","Special","Always","Cherished","Beautiful","Happiness","Forever"];

/* ===== background: affection rain ===== */
const Background = {
  init() {
    const rain = document.getElementById("rain");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const count = innerWidth < 600 ? 10 : 20;
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.textContent = AFFECTION[i % AFFECTION.length];
      s.style.left = Math.random() * 95 + "%";
      s.style.fontSize = (0.8 + Math.random() * 0.6) + "rem";
      s.style.opacity = 0.15 + Math.random() * 0.2;
      s.style.animationDuration = (14 + Math.random() * 14) + "s";
      s.style.animationDelay = (-Math.random() * 28) + "s";
      s.style.setProperty("--r0", (Math.random() * 30 - 15) + "deg");
      s.style.setProperty("--r1", (Math.random() * 30 - 15) + "deg");
      rain.appendChild(s);
    }
  }
};

/* ===== music: YouTube (hidden player) with local mp3 fallback ===== */
// const Music = {
//   audio: null, btn: null, yt: null, ytReady: false, playing: false, target: 70, timer: null,
//   videoId() {
//     const m = MUSIC_URL.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
//     return m ? m[1] : null;
//   },
//   init() {
//     this.audio = document.getElementById("audio");
//     this.btn = document.getElementById("music");
//     this.btn.addEventListener("click", () => this.toggle());
//     const id = this.videoId();
//     if (!id) return;
//     window.onYouTubeIframeAPIReady = () => {
//       this.yt = new YT.Player("yt-player", {
//         videoId: id, height: "1", width: "1",
//         playerVars: { loop: 1, playlist: id, controls: 0, playsinline: 1 },
//         events: { onReady: () => { this.ytReady = true; }, onError: () => { this.yt = null; } }
//       });
//     };
//     const tag = document.createElement("script");
//     tag.src = "https://www.youtube.com/iframe_api";
//     tag.onerror = () => { this.yt = null; };
//     document.head.appendChild(tag);
//   },
//   usingYT() { return this.yt && this.ytReady; },
//   async start() {                          // called from the seal click (user gesture)
//     this.btn.hidden = false;
//     this.playing = true;
//     if (this.usingYT()) {
//       this.yt.setVolume(0); this.yt.playVideo(); this.fadeYT(this.target, 4000);
//     } else {
//       try { this.audio.volume = 0; await this.audio.play(); this.fadeAudio(0.5, 4000); }
//       catch (e) { this.btn.hidden = true; }  // nothing to play: experience continues silently
//     }
//   },
//   fadeYT(to, ms, done) {
//     clearInterval(this.timer);
//     const from = this.yt.getVolume(), t0 = Date.now();
//     this.timer = setInterval(() => {
//       const k = Math.min((Date.now() - t0) / ms, 1);
//       this.yt.setVolume(from + (to - from) * k);
//       if (k >= 1) { clearInterval(this.timer); done && done(); }
//     }, 100);
//   },
//   fadeAudio(to, ms, done) {
//     const from = this.audio.volume, t0 = performance.now();
//     const step = t => {
//       const k = Math.min((t - t0) / ms, 1);
//       this.audio.volume = from + (to - from) * k;
//       if (k < 1) requestAnimationFrame(step); else done && done();
//     };
//     requestAnimationFrame(step);
//   },
//   toggle() {
//     this.playing = !this.playing;
//     this.btn.classList.toggle("off", !this.playing);
//     if (this.usingYT()) {
//       if (this.playing) { this.yt.playVideo(); this.fadeYT(this.target, 1200); }
//       else this.fadeYT(0, 800, () => this.yt.pauseVideo());
//     } else {
//       if (this.playing) { this.audio.play().catch(() => {}); this.fadeAudio(0.5, 1200); }
//       else this.fadeAudio(0, 800, () => this.audio.pause());
//     }
//   }
// };
const Music = {
  audio: null,
  btn: null,
  playing: false,

  init() {
    this.audio = document.getElementById("audio");
    this.btn = document.getElementById("music");

    this.btn.addEventListener("click", () => this.toggle());
  },

  async start() {
    this.btn.hidden = false;

    try {
      this.audio.volume = 0;
      await this.audio.play();

      this.playing = true;
      this.btn.classList.remove("off");

      this.fade(0.5, 4000);

    } catch (error) {
      console.error("Music playback failed:", error);
      this.btn.hidden = true;
    }
  },

  fade(target, duration) {
    const start = this.audio.volume;
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min(
        (time - startTime) / duration, 1
      );

      this.audio.volume =
        start + (target - start) * progress;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  },

  toggle() {
    if (this.playing) {
      this.fade(0, 800);

      setTimeout(() => {
        this.audio.pause();
      }, 850);

      this.playing = false;
      this.btn.classList.add("off");

    } else {
      this.audio.play().then(() => {
        this.fade(0.5, 1200);
      }).catch(console.error);

      this.playing = true;
      this.btn.classList.remove("off");
    }
  }
};
/* ===== envelope: opening sequence ===== */
const Envelope = {
  opened: false,
  init() { document.getElementById("seal").addEventListener("click", () => this.open()); },
  open() {
    if (this.opened) return;            // block overlapping animations
    this.opened = true;
    Music.start();                      // the click unlocks audio
    document.getElementById("envelope").classList.add("open");
    setTimeout(() => document.getElementById("stage").classList.add("gone"), 3000);
    setTimeout(() => {
      document.getElementById("stage").hidden = true;
      document.body.classList.remove("sealed");
      document.getElementById("letter").hidden = false;
      scrollTo(0, 0);
      Letter.reveal();
    }, 4100);
  }
};

/* ===== letter + reveal on scroll ===== */
const Letter = {
  build() {
    const body = document.getElementById("letter-body");
    CONTENT.letter.forEach(t => { const p = document.createElement("p"); p.className = "line"; p.textContent = t; body.appendChild(p); });
    document.getElementById("signature").textContent = CONTENT.signature;
    document.getElementById("closing").textContent = CONTENT.closing;
  },
  reveal() {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.2 });
    document.querySelectorAll(".line").forEach((el, i) => { el.style.transitionDelay = i * 0.6 + "s"; io.observe(el); });
    io.observe(document.querySelector(".reveal"));
  }
};

/* ===== memories: dictionary cards + lightbox ===== */
const Memories = {
  i: 0,
  entryHTML(m) {
    const img = m.image ? `<img src="${m.image}" alt="${m.word}" onerror="this.parentNode.textContent='${m.word}'">` : m.word;
    return `<div class="ph">${img}</div><h3>${m.word}<small>${m.type || ""}</small></h3><p>${m.description}</p>` +
           (m.date ? `<p><em>${m.date}</em></p>` : "");
  },
  init() {
    const wrap = document.getElementById("memories");
    memories.forEach((m, idx) => {
      const b = document.createElement("button");
      b.className = "entry"; b.innerHTML = this.entryHTML(m);
      b.addEventListener("click", () => this.show(idx));
      wrap.appendChild(b);
    });
    const lb = document.getElementById("lightbox");
    lb.querySelector(".lb-close").onclick = () => lb.hidden = true;
    lb.querySelector(".prev").onclick = () => this.show(this.i - 1);
    lb.querySelector(".next").onclick = () => this.show(this.i + 1);
    lb.addEventListener("click", e => { if (e.target === lb) lb.hidden = true; });
    addEventListener("keydown", e => {
      if (lb.hidden) return;
      if (e.key === "Escape") lb.hidden = true;
      if (e.key === "ArrowLeft") this.show(this.i - 1);
      if (e.key === "ArrowRight") this.show(this.i + 1);
    });
  },
  show(idx) {
    this.i = (idx + memories.length) % memories.length;
    const page = document.getElementById("lb-page");
    page.innerHTML = this.entryHTML(memories[this.i]);
    page.classList.remove("turn"); void page.offsetWidth; page.classList.add("turn");   // page-turn
    document.getElementById("lightbox").hidden = false;
  }
};

Letter.build(); Background.init(); Music.init(); Memories.init(); Envelope.init();