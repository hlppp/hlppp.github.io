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
const dots = document.querySelectorAll(".dot");
const navItems = document.querySelectorAll(".nav-item");
const pausedLabel = document.getElementById("pausedLabel");
const enterArrow = document.getElementById("enterArrow");
const hoverMsg = document.getElementById("hoverMsg");
const bottomBar = document.getElementById("bottomBar");
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
  dots[current].classList.remove("active");
  navItems[current].classList.remove("active");

  current = index;
  slides[current].classList.add("visible");
  dots[current].classList.add("active");
  navItems[current].classList.add("active");

  const isLight = lightSlides.includes(current);
  dots.forEach((d) => d.classList.toggle("dark", isLight));
  bottomBar.classList.toggle("light-mode", isLight);
  pausedLabel.classList.toggle("dark-text", isLight);
  enterArrow.classList.toggle("dark-text", isLight);
  hoverMsg.classList.toggle("dark-text", isLight);
}

// ── AUTOPLAY ──────────────────────────────────────────────────────
function next() {
  if (!paused && !locked) goTo((current + 1) % slides.length);
}
setInterval(next, 4000);

// ── SIDEBAR NAV ───────────────────────────────────────────────────
let expandedByHover = false;
let holding = false; // true for 3s after hover-expand, slide stays put
let holdTimeout = null;

navItems.forEach((item) => {
  const idx = parseInt(item.dataset.index);

  item.addEventListener("mouseenter", () => {
    if (locked || holding) return;
    paused = true;
    pausedLabel.classList.add("show");
    enterArrow.classList.add("show");
    goTo(idx);
  });

  item.addEventListener("mouseleave", () => {
    if (locked || holding) return;
    paused = false;
    pausedLabel.classList.remove("show");
    enterArrow.classList.remove("show");
  });

  // Click → enter section, collapse sidebar
  item.addEventListener("click", () => {
    expandedByHover = false;
    holding = false;
    clearTimeout(holdTimeout);
    goTo(idx);
    locked = true;
    paused = false;
    pausedLabel.classList.remove("show");
    enterArrow.classList.remove("show");
    sidebar.classList.add("collapsed");
  });
});

// Hover collapsed sidebar → expand; hold current slide for 3s before
// allowing hover-previews so the user isn't disoriented by a quick change
sidebar.addEventListener("mouseenter", () => {
  if (!locked) return;
  sidebar.classList.remove("collapsed");
  locked = false;
  expandedByHover = true;
  holding = true;
  holdTimeout = setTimeout(() => {
    holding = false;
  }, 3000);
});

sidebar.addEventListener("mouseleave", () => {
  if (!expandedByHover) return;
  expandedByHover = false;
  holding = false;
  clearTimeout(holdTimeout);
  sidebar.classList.add("collapsed");
  locked = true;
  paused = false;
  pausedLabel.classList.remove("show");
  enterArrow.classList.remove("show");
});

// ── MAIN VISUAL HOVER / CLICK ─────────────────────────────────────
// Hovering a clickable element in the slide area pauses autoplay
const CLICKABLE = ".pill, .project-card, .gc-thumb, .dot, button";
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
    pausedLabel.classList.remove("show");
    enterArrow.classList.remove("show");
  }
});

// Clicking anything interactive in the slides collapses the sidebar
mainVisual.addEventListener("click", (e) => {
  if (locked) return;
  if (e.target.closest(".pill, .project-card, .gc-thumb, button")) {
    expandedByHover = false;
    holding = false;
    clearTimeout(holdTimeout);
    locked = true;
    paused = false;
    pausedLabel.classList.remove("show");
    enterArrow.classList.remove("show");
    sidebar.classList.add("collapsed");
  }
});

// ── PROGRESS DOTS ─────────────────────────────────────────────────
dots.forEach((dot) => {
  dot.addEventListener("click", () => goTo(parseInt(dot.dataset.index)));
});

goTo(0);

// ── PHOTO PROJECTS ────────────────────────────────────────────────
// Each entry = one photo series. Add new series here as you shoot.
// cover: the thumbnail shown on the photography slide.
// photos: full list shown inside the project page.
const photoProjects = [
  {
    title: "Tokyo",
    cover: "assets/images/photographs/tokyo/tokyo_0.jpg",
    photos: [
      "assets/images/photographs/tokyo/tokyo_0.jpg",
      "assets/images/photographs/tokyo/tokyo_1.jpg",
      "assets/images/photographs/tokyo/tokyo_2.jpg",
      "assets/images/photographs/tokyo/tokyo_3.jpg",
      "assets/images/photographs/tokyo/tokyo_4.JPG",
      "assets/images/photographs/tokyo/tokyo_5.JPG",
      "assets/images/photographs/tokyo/tokyo_6.JPG",
      "assets/images/photographs/tokyo/tokyo_7.jpg",
      "assets/images/photographs/tokyo/tokyo_8.jpg",
      "assets/images/photographs/tokyo/tokyo_9.JPG",
      "assets/images/photographs/tokyo/tokyo_10.JPG",
      "assets/images/photographs/tokyo/tokyo_11.jpg",
      "assets/images/photographs/tokyo/tokyo_12.jpg",
      "assets/images/photographs/tokyo/tokyo_13.jpg",
      "assets/images/photographs/tokyo/tokyo_14.jpg",
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
        Using a film camera and double exposure, I put La Vasque Olympique—the cauldron that carried the Olympic flame above the city—<br>
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
];

// Build one thumbnail card per project on the photography slide
const photoProjectsGrid = document.getElementById("photoProjectsGrid");
photoProjects.forEach((project) => {
  const card = document.createElement("div");
  card.className = "project-card";
  card.innerHTML = `
    <div class="project-card-img" style="background-image:url('${project.cover}')"></div>
    <div class="project-card-label">${project.title}</div>
  `;
  card.addEventListener("click", () => openProject(project));
  photoProjectsGrid.appendChild(card);
});

// ── PROJECT OVERLAY ───────────────────────────────────────────────
const projectOverlay = document.getElementById("projectOverlay");
const projectTitle = document.getElementById("projectTitle");
const projectClose = document.getElementById("projectClose");
const projectGrid = document.getElementById("projectGrid");
let activeProjectPhotos = [];

function openProject(project) {
  projectTitle.textContent = project.title;
  projectGrid.innerHTML = "";

  if (project.sections) {
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
}

function closeProject() {
  projectOverlay.classList.remove("open");
  projectGrid.classList.remove("project-grid--sections");
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
        <span class="game-desc-tag">2024</span>
      </div>
      <div class="game-desc-text">
        <p>Write your project description here.</p>
        <p>More details about gameplay, mechanics, or the story go here.</p>
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
