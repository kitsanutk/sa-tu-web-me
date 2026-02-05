document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       ACTIVE MENU (PAGE)
    ========================= */
    const navLinks = document.querySelectorAll(".nav-menu a");
    const currentPage = window.location.pathname.split("/").pop();

    navLinks.forEach(link => {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage && !linkPage.startsWith("#")) {
            link.classList.add("active");

            const parent = link.closest(".has-dropdown");
            if (parent) parent.classList.add("open");
        }
    });

    /* =========================
       DROPDOWN CLICK (DESKTOP)
    ========================= */
    const dropdownParents = document.querySelectorAll(".has-dropdown > a");

    dropdownParents.forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const parent = this.parentElement;

            if (parent.querySelector(".dropdown")) {
                e.preventDefault();
                parent.classList.toggle("open");

                dropdownParents.forEach(other => {
                    if (other !== anchor) {
                        other.parentElement.classList.remove("open");
                    }
                });
            }
        });
    });

    /* =========================
       SCROLL ACTIVE SECTION
    ========================= */
    const sections = document.querySelectorAll("section[id]");

    window.addEventListener("scroll", function () {
        let scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove("active");

                    if (link.getAttribute("href") === "#" + sectionId) {
                        link.classList.add("active");

                        const parent = link.closest(".has-dropdown");
                        if (parent) parent.classList.add("open");
                    }
                });
            }
        });
    });

    /* =========================
       NAVBAR SCROLL EFFECT
    ========================= */
    const navbar = document.querySelector("nav");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 20) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

/* =========================
   HEADER SOUND CONTROL
   (FADE + PROGRESS READY)
========================= */

const music = document.getElementById("bg-music");
const soundBtn = document.getElementById("header-sound-btn");
const progressBar = document.getElementById("music-progress");

if (music && soundBtn) {

    const MAX_VOLUME = 0.4;
    const FADE_STEP = 0.02;
    const FADE_INTERVAL = 30;

    music.volume = 0;

    /* ===== SESSION RESET ===== */
    if (!sessionStorage.getItem("visited")) {
        sessionStorage.setItem("visited", "true");
        sessionStorage.setItem("soundState", "off");
        sessionStorage.setItem("soundTime", "0");
    }

    let soundState = sessionStorage.getItem("soundState");
    let soundTime  = parseFloat(sessionStorage.getItem("soundTime")) || 0;

    /* ===== INIT ===== */
    if (soundState === "on") {
        music.currentTime = soundTime;
        music.play().catch(() => {});
        fadeIn();
        soundBtn.textContent = "🔊";
    } else {
        soundBtn.textContent = "🔇";
    }

    /* ===== FADE FUNCTIONS ===== */
    function fadeIn() {
        music.volume = 0;
        const fade = setInterval(() => {
            if (music.volume < MAX_VOLUME) {
                music.volume = Math.min(MAX_VOLUME, music.volume + FADE_STEP);
            } else {
                clearInterval(fade);
            }
        }, FADE_INTERVAL);
    }

    function fadeOut() {
        const fade = setInterval(() => {
            if (music.volume > 0) {
                music.volume = Math.max(0, music.volume - FADE_STEP);
            } else {
                clearInterval(fade);
                music.pause();
            }
        }, FADE_INTERVAL);
    }

    /* ===== SAVE TIME ===== */
    music.addEventListener("timeupdate", () => {
        if (soundState === "on") {
            sessionStorage.setItem("soundTime", music.currentTime);
            if (progressBar) {
                progressBar.value = (music.currentTime / music.duration) * 100 || 0;
            }
        }
    });

    /* ===== BUTTON ===== */
    soundBtn.addEventListener("click", () => {

        if (soundState === "off") {
            music.currentTime = parseFloat(sessionStorage.getItem("soundTime")) || 0;
            music.play().catch(() => {});
            fadeIn();
            soundState = "on";
            sessionStorage.setItem("soundState", "on");
            soundBtn.textContent = "🔊";
        } else {
            fadeOut();
            soundState = "off";
            sessionStorage.setItem("soundState", "off");
            soundBtn.textContent = "🔇";
        }
    });

    /* ===== SEEK WITH PROGRESS BAR ===== */
    if (progressBar) {
        progressBar.addEventListener("input", () => {
            music.currentTime = (progressBar.value / 100) * music.duration;
        });
    }
}

/* =========================
   VIDEO BACKGROUND RESUME
========================= */

const bgVideo = document.getElementById("bg-video");

if (bgVideo) {

    // ===== โหลดเวลาเดิม =====
    const savedVideoTime = parseFloat(sessionStorage.getItem("videoTime")) || 0;

    bgVideo.addEventListener("loadedmetadata", () => {
        if (savedVideoTime > 0) {
            bgVideo.currentTime = savedVideoTime;
        }
        bgVideo.play().catch(() => {});
    });

    // ===== บันทึกเวลาระหว่างเล่น =====
    bgVideo.addEventListener("timeupdate", () => {
        sessionStorage.setItem("videoTime", bgVideo.currentTime);
    });

}

});
