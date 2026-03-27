(() => {
  const body = document.body;
  const root = document.documentElement;
  const THEME_KEY = "by_theme";
  const DIR_KEY = "by_dir";

  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");
  const nav = document.getElementById("nav");
  const contentRoot = document.querySelector(".cd-content") || document;
  const sections = contentRoot.querySelectorAll(".section");
  const header = document.getElementById("header");
  const darkToggle = document.getElementById("darkToggle");
  const rtlToggle = document.getElementById("rtlToggle");
  const notifyBtn = document.getElementById("notifyBtn");
  const notifyPanel = document.getElementById("notifyPanel");
  const profileBtn = document.getElementById("profileBtn");
  const profileMenu = document.getElementById("profileMenu");
  const mobileMenu = document.getElementById("mobileMenu");

  const openSidebar = () => {
    if (!sidebar) return;
    sidebar.classList.add("open");
    if (sidebarOverlay) sidebarOverlay.classList.add("active");
    body.classList.add("no-scroll");
  };

  const closeSidebar = () => {
    if (!sidebar) return;
    sidebar.classList.remove("open");
    if (sidebarOverlay) sidebarOverlay.classList.remove("active");
    body.classList.remove("no-scroll");
  };

  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 10);
    });
  }

  if (mobileMenu) {
    mobileMenu.addEventListener("click", () => {
      if (window.innerWidth <= 1024) {
        if (sidebar && sidebar.classList.contains("open")) {
          closeSidebar();
        } else {
          openSidebar();
        }
      }
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar);
  }

  const activateSection = (target) => {
    if (!target) return;
    sections.forEach((section) => {
      section.classList.toggle("active", section.id === target);
      section.style.display = section.id === target ? "" : "none";
    });
  };

  if (nav) {
    const buttons = Array.from(nav.querySelectorAll("button"));
    const activeButton = buttons.find((btn) => btn.classList.contains("active")) || buttons[0];
    if (activeButton) activateSection(activeButton.dataset.target);
    buttons.forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        buttons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        activateSection(button.dataset.target);
        if (window.innerWidth <= 1024) closeSidebar();
      });
    });
  }

  const setTheme = (isDark, persist = true) => {
    body.classList.toggle("dark", isDark);
    root.setAttribute("data-theme", isDark ? "dark" : "light");
    if (persist) {
      try {
        localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
      } catch {}
    }
  };

  if (darkToggle) {
    darkToggle.addEventListener("click", () => {
      setTheme(!body.classList.contains("dark"));
    });
  }

  const setRtl = (isRtl, persist = true) => {
    root.setAttribute("dir", isRtl ? "rtl" : "ltr");
    if (persist) {
      try {
        localStorage.setItem(DIR_KEY, isRtl ? "rtl" : "ltr");
      } catch {}
    }
  };

  if (rtlToggle) {
    rtlToggle.addEventListener("click", () => {
      setRtl(root.getAttribute("dir") !== "rtl");
    });
  }

  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme === "dark", false);
    }
    const savedDir = localStorage.getItem(DIR_KEY);
    if (savedDir === "rtl" || savedDir === "ltr") {
      setRtl(savedDir === "rtl", false);
    }
  } catch {}

  if (notifyBtn && notifyPanel) {
    notifyBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      notifyPanel.classList.toggle("active");
      if (profileMenu) profileMenu.classList.remove("active");
    });
  }

  if (profileBtn && profileMenu) {
    profileBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      profileMenu.classList.toggle("active");
      if (notifyPanel) notifyPanel.classList.remove("active");
    });
  }

  document.addEventListener("click", (event) => {
    if (notifyBtn && notifyPanel && !notifyBtn.contains(event.target) && !notifyPanel.contains(event.target)) {
      notifyPanel.classList.remove("active");
    }
    if (profileBtn && profileMenu && !profileBtn.contains(event.target) && !profileMenu.contains(event.target)) {
      profileMenu.classList.remove("active");
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) closeSidebar();
  });
})();
