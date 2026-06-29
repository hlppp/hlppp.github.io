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

goTo(0);

// ── PHOTO PROJECTS ────────────────────────────────────────────────
// Each entry = one photo series. Add new series here as you shoot.
// cover: the thumbnail shown on the photography slide.
// photos: full list shown inside the project page.
const photoProjects = [
  {
    title: "Messager 414",
    cover: "assets/images/photographs/Messager 414/stellar_0.jpg",
    sections: [
      {
        type: "row",
        small: true,
        photos: [
          "assets/images/photographs/Messager 414/stellar_1.jpg",
          "assets/images/photographs/Messager 414/stellar_0.jpg",
        ],
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
        photos: ["assets/images/photographs/Messager 414/ stellar_3.JPG"],
      },
      {
        type: "row",
        photos: ["assets/images/photographs/Messager 414/ stellar_2.jpg"],
      },
    ],
  },
  {
    title: "Comet Kiss",
    cover: "assets/images/photographs/comet kiss/comet_0.jpeg",
    sections: [
      {
        type: "row",
        photos: [
          "assets/images/photographs/comet kiss/comet_0.jpeg",
          "assets/images/photographs/comet kiss/comet_00.jpeg",
        ],
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
        photos: [
          "assets/images/photographs/comet kiss/comet_1.jpeg",
          "assets/images/photographs/comet kiss/comet_2.jpeg",
          "assets/images/photographs/comet kiss/comet_3.jpeg",
        ],
      },
    ],
  },
  {
    title: "Mirror Mirror",
    cover: "assets/images/photographs/mirror/mirror_0.jpeg",
    horizontalStrip: true,
    photos: Array.from(
      { length: 51 },
      (_, i) => `assets/images/photographs/mirror/mirror_${i}.jpeg`,
    ),
  },
  {
    title: "the city",
    cover: "assets/images/photographs/tokyo/tokyo_0.jpeg",
    smallPhotos: true,
    photos: [
      "assets/images/photographs/tokyo/tokyo_0.jpeg",
      "assets/images/photographs/tokyo/tokyo_1.jpeg",
      "assets/images/photographs/tokyo/tokyo_2.jpeg",
      "assets/images/photographs/tokyo/tokyo_3.jpeg",
      "assets/images/photographs/tokyo/tokyo_4.jpeg",
      "assets/images/photographs/tokyo/tokyo_5.jpeg",
      "assets/images/photographs/tokyo/tokyo_6.jpeg",
      "assets/images/photographs/tokyo/tokyo_7.jpeg",
      "assets/images/photographs/tokyo/tokyo_8.jpeg",
      "assets/images/photographs/tokyo/tokyo_9.jpeg",
      "assets/images/photographs/tokyo/tokyo_10.jpeg",
      "assets/images/photographs/tokyo/tokyo_11.jpeg",
      "assets/images/photographs/tokyo/tokyo_12.jpeg",
      "assets/images/photographs/tokyo/tokyo_13.jpeg",
      "assets/images/photographs/tokyo/tokyo_14.jpeg",
      "assets/images/photographs/tokyo/tokyo_15.jpeg",
      "assets/images/photographs/tokyo/tokyo_16.jpeg",
      "assets/images/photographs/tokyo/tokyo_17.jpeg",
      "assets/images/photographs/tokyo/tokyo_18.jpeg",
    ],
  },
  {
    title: "Pound",
    cover: "assets/images/photographs/pound/k_0.jpeg",
    smallPhotos: true,
    photos: [
      "assets/images/photographs/pound/k_0.jpeg",
      "assets/images/photographs/pound/k_1.jpeg",
      "assets/images/photographs/pound/k_2.jpeg",
      "assets/images/photographs/pound/k_3.jpeg",
      "assets/images/photographs/pound/k_4.jpeg",
      "assets/images/photographs/pound/k_5.jpeg",
      "assets/images/photographs/pound/k_6.jpeg",
      "assets/images/photographs/pound/k_7.jpeg",
      "assets/images/photographs/pound/k_8.jpeg",
      "assets/images/photographs/pound/k_9.jpeg",
      "assets/images/photographs/pound/k_10.jpeg",
      "assets/images/photographs/pound/k_11.jpeg",
      "assets/images/photographs/pound/k_12.jpeg",
      "assets/images/photographs/pound/k_13.jpeg",
      "assets/images/photographs/pound/k_14.jpeg",
      "assets/images/photographs/pound/k_15.jpeg",
      "assets/images/photographs/pound/k_16.jpeg",
      "assets/images/photographs/pound/k_17.jpeg",
      "assets/images/photographs/pound/k_18.jpeg",
    ],
  },
  {
    title: "the town",
    cover: "assets/images/photographs/the town/town_0.jpeg",
    smallPhotos: true,
    photos: [
      "assets/images/photographs/the town/town_0.jpeg",
      "assets/images/photographs/the town/town_1.jpeg",
      "assets/images/photographs/the town/town_2.jpeg",
      "assets/images/photographs/the town/town_3.jpeg",
      "assets/images/photographs/the town/town_4.jpeg",
      "assets/images/photographs/the town/town_5.jpeg",
      "assets/images/photographs/the town/town_6.jpeg",
      "assets/images/photographs/the town/town_7.jpeg",
      "assets/images/photographs/the town/town_8.jpeg",
      "assets/images/photographs/the town/town_9.jpeg",
      "assets/images/photographs/the town/town_10.jpeg",
      "assets/images/photographs/the town/town_11.jpeg",
      "assets/images/photographs/the town/town_12.jpeg",
      "assets/images/photographs/the town/town_13.jpeg",
      "assets/images/photographs/the town/town_14.jpeg",
      "assets/images/photographs/the town/town_15.jpeg",
      "assets/images/photographs/the town/town_16.jpeg",
      "assets/images/photographs/the town/town_17.jpeg",
    ],
  },
  {
    title: "Ong Ong",
    cover: "assets/images/photographs/Ong Ong/Ong_0.jpeg",
    smallPhotos: true,
    photos: [
      "assets/images/photographs/Ong Ong/Ong_0.jpeg",
      "assets/images/photographs/Ong Ong/Ong_1.jpeg",
      "assets/images/photographs/Ong Ong/Ong_2.jpeg",
      "assets/images/photographs/Ong Ong/Ong_3.jpeg",
      "assets/images/photographs/Ong Ong/Ong_4.jpeg",
      "assets/images/photographs/Ong Ong/Ong_5.jpeg",
      "assets/images/photographs/Ong Ong/Ong_6.jpeg",
      "assets/images/photographs/Ong Ong/Ong_7.jpeg",
    ],
  },
  {
    title: "grand summer",
    cover: "assets/images/photographs/grand summer/paris_0.jpeg",
    smallPhotos: true,
    photos: [
      "assets/images/photographs/grand summer/paris_0.jpeg",
      "assets/images/photographs/grand summer/paris_1.jpeg",
      "assets/images/photographs/grand summer/paris_2.jpeg",
      "assets/images/photographs/grand summer/paris_3.jpeg",
      "assets/images/photographs/grand summer/paris_4.jpeg",
      "assets/images/photographs/grand summer/paris_5.jpeg",
      "assets/images/photographs/grand summer/paris_6.jpeg",
      "assets/images/photographs/grand summer/paris_7.jpeg",
      "assets/images/photographs/grand summer/paris_8.jpeg",
      "assets/images/photographs/grand summer/paris_9.jpeg",
      "assets/images/photographs/grand summer/paris_10.jpeg",
      "assets/images/photographs/grand summer/paris_11.jpeg",
      "assets/images/photographs/grand summer/paris_12.jpeg",
      "assets/images/photographs/grand summer/paris_13.jpeg",
      "assets/images/photographs/grand summer/paris_14.jpeg",
    ],
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

// Auto-scroll grid when hovering second-row cards
(function () {
  const COLS = 3;
  const cards = photoProjectsGrid.querySelectorAll(".project-card");
  cards.forEach((card, i) => {
    card.addEventListener("mouseenter", () => {
      if (i >= COLS) {
        const gridRect = photoProjectsGrid.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const targetScroll =
          photoProjectsGrid.scrollTop +
          (cardRect.top - gridRect.top) -
          (gridRect.height - cardRect.height) / 2;
        photoProjectsGrid.scrollTo({ top: Math.max(0, targetScroll), behavior: "smooth" });
      } else {
        photoProjectsGrid.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
  photoProjectsGrid.addEventListener("mouseleave", () => {
    photoProjectsGrid.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

// ── PROJECT OVERLAY ───────────────────────────────────────────────
const projectOverlay = document.getElementById("projectOverlay");
const projectTitle = document.getElementById("projectTitle");
const projectClose = document.getElementById("projectClose");
const projectGrid = document.getElementById("projectGrid");
let activeProjectPhotos = [];

function openProject(project) {
  projectTitle.textContent = project.title;
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
      wrap.addEventListener("mouseenter", () => {
        const gridRect = projectGrid.getBoundingClientRect();
        const wrapRect = wrap.getBoundingClientRect();
        if (wrapRect.right > gridRect.right - 8 || wrapRect.left < gridRect.left + 8) {
          const targetScroll =
            projectGrid.scrollLeft +
            (wrapRect.left - gridRect.left) -
            (gridRect.width - wrapRect.width) / 2;
          projectGrid.scrollTo({ left: targetScroll, behavior: "smooth" });
        }
      });
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
      if (project.smallPhotos) {
        wrap.addEventListener("mouseenter", () => {
          const gridRect = projectGrid.getBoundingClientRect();
          const wrapRect = wrap.getBoundingClientRect();
          const threshold = wrapRect.height * 0.5;
          if (
            wrapRect.bottom > gridRect.bottom - threshold ||
            wrapRect.top < gridRect.top + threshold
          ) {
            const targetScroll =
              projectGrid.scrollTop +
              (wrapRect.top - gridRect.top) -
              (gridRect.height - wrapRect.height) / 2;
            projectGrid.scrollTo({ top: Math.max(0, targetScroll), behavior: "smooth" });
          }
        });
      }
      projectGrid.appendChild(wrap);
    });
  }

  projectOverlay.classList.add("open");
}

function closeProject() {
  projectOverlay.classList.remove("open");
  projectGrid.classList.remove("project-grid--sections", "project-grid--small", "project-grid--strip");
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
        <span class="game-desc-tag">Unity</span>
      </div>
      <div class="game-desc-text">
        <p> A digital game based on a real student dormitory in Kyoto.<br>
        Yoshida Dormitory is a self-governing student dorm with a history of more than one hundred years.<br>
        Bon, the main character of the game, was a real cat who lived in the dorm (p2).<br>
       Today, the dormitory is facing the threat of demolition after being sued by the university.<br>
        Through this project, Project Bon aims to preserve the architecture, culture, and memories of the dormitory in the digital realm,<br>
        by telling real stories through a fictional game.</p>
        <p> Project Bon is a collective formed by a few former residents and people connected to Yoshida Dormitory.</p>
      </div>
      <div class="game-desc-links">
        <a href="https://store.steampowered.com/app/3870060/I_Am_a_Dorm_Resident_but_Cat/?l=english" target="_blank" rel="noopener" class="game-desc-link">Steam ↗</a>
        <a href="https://x.com/ysdbon" target="_blank" rel="noopener" class="game-desc-link">Twitter ↗</a>
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
