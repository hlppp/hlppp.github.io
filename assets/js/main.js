// ── CRT SNOW ──────────────────────────────────────────────────────
(function () {
  const canvas = document.querySelector(".slide-game .crt-snow");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ~0.8 % of pixels lit per frame
    const count = Math.floor(canvas.width * canvas.height * 0.008);
    ctx.fillStyle = "#fff";
    for (let i = 0; i < count; i++) {
      ctx.fillRect(
        (Math.random() * canvas.width) | 0,
        (Math.random() * canvas.height) | 0,
        1,
        1,
      );
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── ELEMENT REFERENCES ────────────────────────────────────────────
const slides = document.querySelectorAll(".slide");
const navItems = document.querySelectorAll(".nav-item");
const hoverMsg = document.getElementById("hoverMsg");
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");

// ── STATE ─────────────────────────────────────────────────────────
// lightSlides: slide indexes with a light background (photo, research).
// locked: true while the sidebar is collapsed (user is in a section).
const lightSlides = [1, 2];
let current = 0;
let paused = false;
let locked = false;
let suppressHistory = false;

// ── SLIDE SWITCHER ────────────────────────────────────────────────
function goTo(index) {
  slides[current].classList.remove("visible");
  navItems[current].classList.remove("active");

  current = index;
  slides[current].classList.add("visible");
  navItems[current].classList.add("active");

  const isLight = lightSlides.includes(current);
  hoverMsg.classList.toggle("dark-text", isLight);
}

// ── AUTOPLAY ──────────────────────────────────────────────────────
function next() {
  if (!paused && !locked) goTo((current + 1) % slides.length);
}
setInterval(next, 4000);

// ── SIDEBAR NAV ───────────────────────────────────────────────────
navItems.forEach((item) => {
  const idx = parseInt(item.dataset.index);

  item.addEventListener("mouseenter", () => {
    if (locked) return;
    paused = true;
    goTo(idx);
  });

  item.addEventListener("mouseleave", () => {
    if (locked) return;
    paused = false;
  });

  // Click → enter section, collapse sidebar
  item.addEventListener("click", () => {
    goTo(idx);
    locked = true;
    paused = false;
    sidebar.classList.add("collapsed");
  });
});

// Hover collapsed sidebar → fully restore to initial unlocked state
sidebar.addEventListener("mouseenter", () => {
  if (!locked) return;
  sidebar.classList.remove("collapsed");
  locked = false;
});

// Tap/click the header › area to expand (works on touch where hover doesn't fire)
sidebarToggle.addEventListener("click", () => {
  if (sidebar.classList.contains("collapsed")) {
    sidebar.classList.remove("collapsed");
    locked = false;
  }
});

// ── MAIN VISUAL HOVER / CLICK ─────────────────────────────────────
// Hovering a clickable element in the slide area pauses autoplay
const CLICKABLE = ".pill, .project-card, .gc-thumb, button";
mainVisual.addEventListener("mouseover", (e) => {
  if (!locked && e.target.closest(CLICKABLE)) paused = true;
});
mainVisual.addEventListener("mouseout", (e) => {
  if (
    !locked &&
    e.target.closest(CLICKABLE) &&
    !e.relatedTarget?.closest(CLICKABLE)
  ) {
    paused = false;
  }
});

// Clicking anything interactive in the slides collapses the sidebar
mainVisual.addEventListener("click", (e) => {
  if (locked) return;
  if (e.target.closest(".pill, .project-card, .gc-thumb, button")) {
    locked = true;
    paused = false;
    sidebar.classList.add("collapsed");
  }
});

goTo(current);

// ── PHOTO PROJECTS ────────────────────────────────────────────────
// Each entry = one photo series. Add new series here as you shoot.
// cover: the thumbnail shown on the photography slide.
// photos: full list shown inside the project page.
const photoProjects = [
  {
    title: "Messager 414",
    slug: "messager-414",
    subtitle: "Nikon F3, Kodak 5207",
    cover: "assets/images/photographs/Messager 414/stellar_0.jpg",
    sections: [
      {
        type: "row",
        small: true,
        photos: [1, 0].map(
          (i) => `assets/images/photographs/Messager 414/stellar_${i}.jpg`,
        ),
      },
      {
        type: "text",
        content: ` In 1610, Galileo wrote Sidereus Nuncius (Starry Messenger), <br>
        a letter to the Venetian Senate reporting his observations of Jupiter’s moons and the cratered surface of our own Moon.<br>
        In the summer of 2024, I visited my cousin in Paris during the Olympic Games.<br>
        Using double exposure on a film camera, I put La Vasque Olympique—the cauldron that carried the Olympic flame above the city—<br>
        with Galileo’s drawing of the Moon from the letter on the same film.<br>
        A message from the sky to Earth. <br>
        A message from the Earth back to the sky. <br>
        Four hundred and fourteen years back and forth, <br>
        now saved in the same light. `,
      },
      {
        type: "row",
        photos: [3].map(
          (i) => `assets/images/photographs/Messager 414/ stellar_${i}.JPG`,
        ),
      },
      {
        type: "row",
        photos: [2].map(
          (i) => `assets/images/photographs/Messager 414/ stellar_${i}.jpg`,
        ),
      },
    ],
  },
  {
    title: "Comet Kiss",
    slug: "comet-kiss",
    subtitle: "iPhone & Microscope",
    cover: "assets/images/photographs/comet kiss/comet_0.jpeg",
    sections: [
      {
        type: "row",
        photos: [0, "00"].map(
          (i) => `assets/images/photographs/comet kiss/comet_${i}.jpeg`,
        ),
      },
      {
        type: "text",
        content: `In an astronomy lecture, the professor brought his collection of cometary sample.<br>
                  I looked through the microscope,<br>
                  and I saw  The Kiss by Gustav Klimt.<br>
                  The Kiss written in stardust.`,
      },
      {
        type: "row",
        photos: Array.from(
          { length: 3 },
          (_, i) => `assets/images/photographs/comet kiss/comet_${i + 1}.jpeg`,
        ),
      },
    ],
  },
  {
    title: "Mirror Mirror",
    slug: "mirror-mirror",
    subtitle: "iPhone, Olympus digital camera & mirror from vienna flea market",
    cover: "assets/images/photographs/mirror/mirror_0.jpeg",
    horizontalStrip: true,
    photos: Array.from(
      { length: 58 },
      (_, i) => `assets/images/photographs/mirror/mirror_${i}.jpeg`,
    ),
  },
  {
    title: "the city",
    slug: "the-city",
    subtitle: "Nikon F3, Lomography Babylon & Berlin",
    cover: "assets/images/photographs/tokyo/tokyo_0.jpeg",
    smallPhotos: true,
    photos: Array.from(
      { length: 19 },
      (_, i) => `assets/images/photographs/tokyo/tokyo_${i}.jpeg`,
    ),
  },
  {
    title: "Pound",
    slug: "pound",
    subtitle: "Nikon F3 & disposable camera, different films",
    cover: "assets/images/photographs/pound/k_0.jpeg",
    smallPhotos: true,
    photos: Array.from(
      { length: 19 },
      (_, i) => `assets/images/photographs/pound/k_${i}.jpeg`,
    ),
  },
  {
    title: "the town",
    slug: "the-town",
    subtitle: "Nikon F80 & Nikon F3, Kodak 5207 +",
    cover: "assets/images/photographs/the town/town_0.jpeg",
    smallPhotos: true,
    photos: Array.from(
      { length: 18 },
      (_, i) => `assets/images/photographs/the town/town_${i}.jpeg`,
    ),
  },
  {
    title: "Ong Ong",
    slug: "ong-ong",
    subtitle: "Nikon F80, Kodak 5207",
    cover: "assets/images/photographs/Ong Ong/Ong_0.jpeg",
    smallPhotos: true,
    photos: Array.from(
      { length: 8 },
      (_, i) => `assets/images/photographs/Ong Ong/Ong_${i}.jpeg`,
    ),
  },
  {
    title: "grand summer",
    slug: "grand-summer",
    subtitle: "Nikon F3, Kodak 5207 & disposable camera",
    cover: "assets/images/photographs/grand summer/paris_0.jpeg",
    smallPhotos: true,
    photos: Array.from(
      { length: 15 },
      (_, i) => `assets/images/photographs/grand summer/paris_${i}.jpeg`,
    ),
  },
  {
    title: "the apple",
    slug: "apple",
    subtitle: "Nikon F80, Lomography Berlin",
    cover: "assets/images/photographs/Apple/ny_1.JPG",
    smallPhotos: true,
    photos: Array.from(
      { length: 30 },
      (_, i) =>
        `assets/images/photographs/Apple/ny_${i + 1}.${i === 8 ? "jpg" : "JPG"}`,
    ),
  },
  {
    title: "Denver, Denver",
    slug: "denver",
    subtitle: "Nikon F80, Kodak 5207",
    cover: "assets/images/photographs/Denver/Denver_0.jpeg",
    smallPhotos: true,
    photos: Array.from(
      { length: 23 },
      (_, i) => `assets/images/photographs/Denver/Denver_${i}.jpeg`,
    ),
  },
  {
    title: "Zypher",
    slug: "zypher",
    subtitle: "Nikon F80, Lomography Babylon",
    cover: "assets/images/photographs/Zypher/Zypher_0.jpeg",
    smallPhotos: true,
    photos: Array.from(
      { length: 22 },
      (_, i) => `assets/images/photographs/Zypher/Zypher_${i}.jpeg`,
    ),
  },
];

// Build one thumbnail card per project on the photography slide
const photoProjectsGrid = document.getElementById("photoProjectsGrid");
photoProjects.forEach((project, i) => {
  const card = document.createElement("div");
  card.className = "project-card";
  if (i === 4) {
    card.style.gridColumn = "span 2";
    card.classList.add("project-card--wide");
  }
  card.innerHTML = `
    <div class="project-card-img" style="background-image:url('${project.cover}')"></div>
    <div class="project-card-label">${project.title}</div>
  `;
  card.addEventListener("click", () => openProject(project));
  photoProjectsGrid.appendChild(card);
});

// Match wide card (Pound) image height to portrait cards
(function () {
  const imgs = photoProjectsGrid.querySelectorAll(".project-card-img");
  const wideImg = imgs[4];
  if (!wideImg) return;
  wideImg.style.aspectRatio = "unset";
  function sync() {
    if (imgs[0].offsetHeight > 0)
      wideImg.style.height = imgs[0].offsetHeight + "px";
  }
  new ResizeObserver(sync).observe(photoProjectsGrid);
  sync();
})();

// Hover scrolling reacts only to mouse movement, never to items moving
// underneath a stationary pointer. Each grid finishes one scroll at a time.
function enableHoverReveal(container, selector, getAxis) {
  let scrolling = false;
  let lastTarget = null;
  let pointerX = null;
  let pointerY = null;

  container.addEventListener("pointerleave", () => {
    lastTarget = null;
    pointerX = pointerY = null;
  });

  container.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    if (event.clientX === pointerX && event.clientY === pointerY) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (scrolling) return;

    const target = event.target.closest(selector);
    if (!target || !container.contains(target)) {
      lastTarget = null;
      return;
    }
    if (target === lastTarget) return;
    lastTarget = target;

    const axis = getAxis();
    if (!axis) return;
    const horizontal = axis === "horizontal";
    const rect = container.getBoundingClientRect();
    const item = target.getBoundingClientRect();
    const start = horizontal ? rect.left + container.clientLeft : rect.top + container.clientTop;
    const size = horizontal ? container.clientWidth : container.clientHeight;
    const itemStart = horizontal ? item.left : item.top;
    const itemEnd = horizontal ? item.right : item.bottom;
    const before = itemStart - start;
    const after = itemEnd - (start + size);
    // Center vertical rows to leave room for neighboring rows on both sides,
    // regardless of scroll direction. Keep horizontal strips minimally revealed.
    const fitsVertically = !horizontal && itemEnd - itemStart < size;
    // An oversized item spanning both edges is already as visible as possible.
    const delta = fitsVertically
      ? (itemStart + itemEnd) / 2 - (start + size / 2)
      : before < 0 && after > 0 ? 0 : before < 0 ? before : after > 0 ? after : 0;
    const current = horizontal ? container.scrollLeft : container.scrollTop;
    const max = horizontal
      ? container.scrollWidth - container.clientWidth
      : container.scrollHeight - container.clientHeight;
    const destination = Math.max(0, Math.min(max, current + delta));
    if (Math.abs(destination - current) < 1) return;

    scrolling = true;
    container.scrollTo({
      [horizontal ? "left" : "top"]: destination,
      behavior: "smooth",
    });

    // Wait for scrolling to settle, including interrupted/clamped scrolls.
    const started = performance.now();
    let previous = current;
    let lastChange = started;
    function waitForScroll(now) {
      const position = horizontal ? container.scrollLeft : container.scrollTop;
      if (Math.abs(position - previous) > 0.1) {
        previous = position;
        lastChange = now;
      }
      if ((now - started >= 200 && now - lastChange >= 120) || now - started >= 2000) {
        scrolling = false;
        return;
      }
      requestAnimationFrame(waitForScroll);
    }
    requestAnimationFrame(waitForScroll);
  });
}

enableHoverReveal(photoProjectsGrid, ".project-card", () => "vertical");

// ── PROJECT OVERLAY ───────────────────────────────────────────────
const projectOverlay = document.getElementById("projectOverlay");
const projectTitle = document.getElementById("projectTitle");
const projectSubtitle = document.getElementById("projectSubtitle");
const projectClose = document.getElementById("projectClose");
const projectGrid = document.getElementById("projectGrid");
let activeProjectPhotos = [];

enableHoverReveal(projectGrid, ".project-photo", () => {
  if (projectGrid.classList.contains("project-grid--strip")) return "horizontal";
  if (projectGrid.classList.contains("project-grid--small")) return "vertical";
  return null;
});

function openProject(project) {
  projectTitle.textContent = project.title;
  projectSubtitle.textContent = project.subtitle || "";
  projectSubtitle.style.display = project.subtitle ? "" : "none";
  projectGrid.innerHTML = "";

  if (project.horizontalStrip) {
    // Single-row horizontal scroll strip — all photos same height
    projectGrid.classList.add("project-grid--strip");
    activeProjectPhotos = project.photos;
    project.photos.forEach((src, i) => {
      const wrap = document.createElement("div");
      wrap.className = "project-photo";
      const img = document.createElement("img");
      img.src = src;
      img.loading = "lazy";
      img.alt = project.title + " " + i;
      wrap.appendChild(img);
      wrap.addEventListener("click", () => openLightbox(i));
      projectGrid.appendChild(wrap);
    });
  } else if (project.sections) {
    // Sections layout: rows of photos + text blocks
    projectGrid.classList.add("project-grid--sections");

    // Build the flat photo list for the lightbox
    activeProjectPhotos = project.sections
      .filter((s) => s.type === "row")
      .flatMap((s) => s.photos);

    let photoIndex = 0;
    project.sections.forEach((section) => {
      if (section.type === "row") {
        const row = document.createElement("div");
        row.className =
          "project-row" + (section.small ? " project-row--small" : "");
        section.photos.forEach((src) => {
          const wrap = document.createElement("div");
          wrap.className = "project-photo";
          const img = document.createElement("img");
          img.src = src;
          img.loading = "lazy";
          wrap.appendChild(img);
          row.appendChild(wrap);
        });
        projectGrid.appendChild(row);
      } else if (section.type === "text") {
        const block = document.createElement("div");
        block.className = "project-description";
        block.innerHTML = section.content;
        projectGrid.appendChild(block);
      }
    });
  } else {
    // Default masonry grid (Tokyo-style)
    projectGrid.classList.remove("project-grid--sections");
    projectGrid.classList.toggle("project-grid--small", !!project.smallPhotos);
    activeProjectPhotos = project.photos;
    project.photos.forEach((src, i) => {
      const wrap = document.createElement("div");
      wrap.className = "project-photo";
      const img = document.createElement("img");
      img.src = src;
      img.loading = "lazy";
      img.alt = project.title + " " + i;
      wrap.appendChild(img);
      wrap.addEventListener("click", () => openLightbox(i));
      projectGrid.appendChild(wrap);
    });
  }

  projectOverlay.classList.add("open");
  if (!suppressHistory) {
    history.pushState(null, "", "#photography/" + project.slug);
  }
}

function closeProject() {
  projectOverlay.classList.remove("open");
  projectGrid.classList.remove(
    "project-grid--sections",
    "project-grid--small",
    "project-grid--strip",
  );
  if (!suppressHistory) {
    history.pushState(null, "", location.pathname + location.search);
  }
}

projectClose.addEventListener("click", closeProject);

// ── GAME PROJECTS ─────────────────────────────────────────────────
const gameProjects = [
  {
    id: "bon",
    title: "Project Bon",
    images: [
      { type: "video", id: "BfP5NVk123k" },
      { type: "image", src: "assets/images/game devs/ProjectBon/bon_1.jpg" },
      { type: "image", src: "assets/images/game devs/ProjectBon/bon_2.JPG" },
      { type: "image", src: "assets/images/game devs/ProjectBon/bon_3.jpg" },
      { type: "video", id: "b5MKmaZf--8" },
    ],
    description: `
      <div class="game-desc-title">Project Bon</div>
      <div class="game-desc-tags">
        <a href="https://store.steampowered.com/app/3870060/I_Am_a_Dorm_Resident_but_Cat/?l=english" target="_blank" rel="noopener" class="game-desc-link">Steam ↗</a>
        <a href="https://x.com/ysdbon" target="_blank" rel="noopener" class="game-desc-link">Twitter ↗</a>
        <div class="game-desc-press">
          <button type="button" class="game-desc-link game-desc-press-btn">Press</button>
          <div class="game-desc-press-menu">
            <a href="https://www.famitsu.com/article/202507/47699" target="_blank" rel="noopener">Famitsu ↗</a>
            <a href="https://gamemakers.jp/article/2025_07_24_112296/" target="_blank" rel="noopener">Game Makers ↗</a>
          </div>
        </div>
      </div>
      <div class="game-desc-text">
        <p> A digital game based on a real student dormitory in Kyoto, Yoshida Dormitory, a self-governing student dorm with a history of more than one hundred years.<br>
        Bon, the main character of the game, was a real cat who lived in the dorm (p2).</p> 
        <p> Today, the dormitory is facing the threat of demolition after being sued by the university.<br> 
        Project Bon aims to preserve the architecture, culture, and memories of the dormitory in the digital realm, by telling real on-going stories through a virtual game.</p>
        <p><span class="game-desc-highlight">The project is not only an act of documentation, but also a form of protest and negotiation through media.</span><br>
        We combine 2D pixel art, voxel models, and footage of the actual space to replicate its architecture and construct a virtual world that exists in parallel with the physical site, gradually moves from a digital world toward the physical reality of Yoshida Dormitory and the events surrounding it. <br>
        For reference, a 3D scan of the dorm provided by <a href="https://my.matterport.com/show/?m=en16WBZJXbN" target="_blank" rel="noopener" class="game-desc-inline-link">Asahi News ↗</a>.</p>
        <p> Project Bon is a collective formed by few former residents and people connected to Yoshida Dormitory.</p>
      </div>
    `,
  },
  {
    id: "hz",
    title: "Project Hz",
    images: [{ type: "video", id: "O9chBqPwl_Y" }],
    description: `
      <div class="game-desc-title">Project Hz</div>
      <div class="game-desc-tags">
        <span class="game-desc-tag">2023</span>
      </div>
      <div class="game-desc-text">
        <p>A layered metaverse space created by Hanlin Wang, Takeru Tokoro, Kondo Kenshin. </p>

        <p>In this world, every entity has a frequency. <br>
        When the player’s frequency is close to an object’s frequency, that object becomes visible and accessible;<br>
        when the frequencies drift apart, it gradually fades away. <br>
        By tuning their own frequency, players can travel through different layers of virtual spaces and meanings.</p>
      </div>
    `,
  },
  {
    id: "otosu",
    title: "音す (Drop the Word)",
    images: [{ type: "video", id: "GzdeOURKe9A" }],
    description: `
      <div class="game-desc-title">音す (Drop the Word)</div>
      <div class="game-desc-tags">
        <span class="game-desc-tag">2023</span>
      </div>
      <div class="game-desc-text">
        <p>In a group exhibition, we made a participatory installation where participants are invited to drop words into a shared digital space, <br>
        engaging with other exhibiting art works and creating a involving collective narrative. <br>
      </div>
    `,
  },
];

const gameContent = document.getElementById("gameContent");
const gcMainImg = document.getElementById("gcMainImg");
const gcVideoFrame = document.getElementById("gcVideoFrame");
const gcThumbs = document.getElementById("gcThumbs");
const gcRight = document.getElementById("gcRight");
const gameHint = document.getElementById("gameHint");

function showGcImage(src) {
  gcVideoFrame.src = "";
  gcVideoFrame.style.display = "none";
  gcMainImg.style.display = "block";
  gcMainImg.classList.add("switching");
  setTimeout(() => {
    gcMainImg.src = src;
    gcMainImg.classList.remove("switching");
  }, 200);
}

function showGcVideo(id) {
  gcMainImg.style.display = "none";
  gcVideoFrame.style.display = "block";
  gcVideoFrame.src = `https://www.youtube-nocookie.com/embed/${id}`;
}

function showGcEntry(entry) {
  if (entry.type === "video") showGcVideo(entry.id);
  else showGcImage(entry.src);
}

function openGameProject(project) {
  gcRight.innerHTML = project.description;

  gcThumbs.innerHTML = "";
  project.images.forEach((entry, i) => {
    const thumb = document.createElement("img");
    thumb.className = "gc-thumb" + (i === 0 ? " active" : "");
    thumb.src =
      entry.type === "video"
        ? `https://img.youtube.com/vi/${entry.id}/mqdefault.jpg`
        : entry.src;
    thumb.alt = project.title + " " + (i + 1);
    thumb.addEventListener("click", () => {
      gcThumbs
        .querySelectorAll(".gc-thumb")
        .forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
      showGcEntry(entry);
    });
    gcThumbs.appendChild(thumb);
  });

  showGcEntry(project.images[0]);
  gameContent.classList.add("open");
  gameHint.classList.add("hidden");
}

// Press dropdown — toggle open on button click, close on outside click
gcRight.addEventListener("click", (e) => {
  const btn = e.target.closest(".game-desc-press-btn");
  if (!btn) return;
  btn.nextElementSibling.classList.toggle("open");
});
document.addEventListener("click", (e) => {
  if (e.target.closest(".game-desc-press")) return;
  gcRight
    .querySelectorAll(".game-desc-press-menu.open")
    .forEach((menu) => menu.classList.remove("open"));
});

// Wire pills — click to open, click active pill again to close
document.querySelectorAll(".slide-game .pill[data-game]").forEach((pill) => {
  const project = gameProjects.find((p) => p.id === pill.dataset.game);
  if (!project) return;
  pill.addEventListener("click", () => {
    if (
      gameContent.classList.contains("open") &&
      pill.classList.contains("active-pill")
    ) {
      gameContent.classList.remove("open");
      pill.classList.remove("active-pill");
      gameHint.classList.remove("hidden");
    } else {
      document
        .querySelectorAll(".slide-game .pill")
        .forEach((p) => p.classList.remove("active-pill"));
      pill.classList.add("active-pill");
      openGameProject(project);
    }
  });
});

// ── LIGHTBOX ──────────────────────────────────────────────────────
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lbCounter = document.getElementById("lbCounter");
let lbIndex = 0;

function openLightbox(i) {
  lbIndex = i;
  lightboxImg.src = activeProjectPhotos[i];
  lbCounter.textContent = i + 1 + " / " + activeProjectPhotos.length;
  lightbox.classList.add("open");
}
function closeLightbox() {
  lightbox.classList.remove("open");
}
function lbStep(dir) {
  lbIndex =
    (lbIndex + dir + activeProjectPhotos.length) % activeProjectPhotos.length;
  lightboxImg.src = activeProjectPhotos[lbIndex];
  lbCounter.textContent = lbIndex + 1 + " / " + activeProjectPhotos.length;
}

document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbPrev").addEventListener("click", () => lbStep(-1));
document.getElementById("lbNext").addEventListener("click", () => lbStep(1));

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (lightbox.classList.contains("open")) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") lbStep(1);
    if (e.key === "ArrowLeft") lbStep(-1);
  } else if (projectOverlay.classList.contains("open")) {
    if (e.key === "Escape") closeProject();
  }
});

// ── ABOUT PHOTO HOVER SWAP ───────────────────────────────────────
// Mouse: swap on hover. Touch (mobile Safari doesn't fire mouseenter/
// mouseleave): swap while pressed, revert on release/cancel.
// touchstart is left un-prevented so it doesn't block page scrolling
// when a scroll gesture happens to start on the photo; only touchend/
// touchcancel call preventDefault, which is enough to stop the
// synthetic mouse events iOS fires afterward from re-triggering the swap.
const aboutCornerPhoto = document.querySelector(".about-corner-photo");
if (aboutCornerPhoto) {
  new Image().src = aboutCornerPhoto.dataset.hoverSrc;

  aboutCornerPhoto.addEventListener("mouseenter", () => {
    aboutCornerPhoto.src = aboutCornerPhoto.dataset.hoverSrc;
  });
  aboutCornerPhoto.addEventListener("mouseleave", () => {
    aboutCornerPhoto.src = aboutCornerPhoto.dataset.defaultSrc;
  });
  aboutCornerPhoto.addEventListener(
    "touchstart",
    () => {
      aboutCornerPhoto.src = aboutCornerPhoto.dataset.hoverSrc;
    },
    { passive: true },
  );
  aboutCornerPhoto.addEventListener("touchend", (e) => {
    e.preventDefault();
    aboutCornerPhoto.src = aboutCornerPhoto.dataset.defaultSrc;
  });
  aboutCornerPhoto.addEventListener("touchcancel", (e) => {
    e.preventDefault();
    aboutCornerPhoto.src = aboutCornerPhoto.dataset.defaultSrc;
  });
}

// ── SHAREABLE PROJECT LINKS ──────────────────────────────────────
// Syncs #photography/<slug> with the open project overlay so a link
// can be copied straight from the address bar.
function applyProjectHash() {
  suppressHistory = true;
  const match = location.hash.match(/^#photography\/([^/]+)$/);
  const project = match && photoProjects.find((p) => p.slug === match[1]);

  if (project) {
    if (current !== 1) goTo(1);
    if (!locked) {
      locked = true;
      paused = false;
      sidebar.classList.add("collapsed");
    }
    openProject(project);
  } else if (projectOverlay.classList.contains("open")) {
    closeProject();
  }
  suppressHistory = false;
}

window.addEventListener("popstate", applyProjectHash);

// Defer two frames so the initial paint happens before the overlay's
// opacity transition kicks in, instead of snapping straight to "open".
requestAnimationFrame(() => requestAnimationFrame(applyProjectHash));
