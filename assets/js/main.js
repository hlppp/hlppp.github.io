// ── ELEMENT REFERENCES ────────────────────────────────────────────
const slides      = document.querySelectorAll(".slide");
const dots        = document.querySelectorAll(".dot");
const navItems    = document.querySelectorAll(".nav-item");
const pausedLabel = document.getElementById("pausedLabel");
const enterArrow  = document.getElementById("enterArrow");
const hoverMsg    = document.getElementById("hoverMsg");
const bottomBar   = document.getElementById("bottomBar");
const sidebar     = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");

// ── STATE ─────────────────────────────────────────────────────────
// lightSlides: slide indexes with a light background (photo, research).
// locked: true while the sidebar is collapsed (user is in a section).
const lightSlides = [1, 2];
let current = 0;
let paused  = false;
let locked  = false;

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
let holding = false;       // true for 3s after hover-expand, slide stays put
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
  holdTimeout = setTimeout(() => { holding = false; }, 3000);
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
  // { title: "Kyoto", cover: "assets/images/photographs/kyoto/kyoto_0.jpg", photos: [...] },
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
const projectTitle   = document.getElementById("projectTitle");
const projectClose   = document.getElementById("projectClose");
const projectGrid    = document.getElementById("projectGrid");
let activeProjectPhotos = [];

function openProject(project) {
  // Update header title
  projectTitle.textContent = project.title;

  // Rebuild the masonry grid for this project
  projectGrid.innerHTML = "";
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

  activeProjectPhotos = project.photos;
  projectOverlay.classList.add("open");
}

function closeProject() { projectOverlay.classList.remove("open"); }

projectClose.addEventListener("click", closeProject);

// ── LIGHTBOX ──────────────────────────────────────────────────────
const lightbox    = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lbCounter   = document.getElementById("lbCounter");
let lbIndex = 0;

function openLightbox(i) {
  lbIndex = i;
  lightboxImg.src = activeProjectPhotos[i];
  lbCounter.textContent = (i + 1) + " / " + activeProjectPhotos.length;
  lightbox.classList.add("open");
}
function closeLightbox() { lightbox.classList.remove("open"); }
function lbStep(dir) {
  lbIndex = (lbIndex + dir + activeProjectPhotos.length) % activeProjectPhotos.length;
  lightboxImg.src = activeProjectPhotos[lbIndex];
  lbCounter.textContent = (lbIndex + 1) + " / " + activeProjectPhotos.length;
}

document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbPrev").addEventListener("click", () => lbStep(-1));
document.getElementById("lbNext").addEventListener("click", () => lbStep(1));

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (lightbox.classList.contains("open")) {
    if (e.key === "Escape")     closeLightbox();
    if (e.key === "ArrowRight") lbStep(1);
    if (e.key === "ArrowLeft")  lbStep(-1);
  } else if (projectOverlay.classList.contains("open")) {
    if (e.key === "Escape") closeProject();
  }
});
