(() => {
  const body = document.body;
  const root = document.documentElement;
  const THEME_KEY = "by_theme";
  const DIR_KEY = "by_dir";

  const setTheme = (isDark, persist = true) => {
    body.classList.toggle("dark", isDark);
    root.setAttribute("data-theme", isDark ? "dark" : "light");
    const ariaValue = isDark ? "true" : "false";
    const labelText = isDark ? "Light" : "Dark";
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) themeToggle.setAttribute("aria-pressed", ariaValue);
    document.querySelectorAll("[data-theme-toggle-mobile]").forEach((btn) => {
      btn.setAttribute("aria-pressed", ariaValue);
      btn.textContent = labelText;
    });
    if (persist) {
      try {
        localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
      } catch {}
    }
  };

  const toggleTheme = () => setTheme(!body.classList.contains("dark"));

  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
  document.querySelectorAll("[data-theme-toggle-mobile]").forEach((btn) => {
    btn.addEventListener("click", toggleTheme);
  });

  const setRtl = (isRtl, persist = true) => {
    root.setAttribute("dir", isRtl ? "rtl" : "ltr");
    const ariaValue = isRtl ? "true" : "false";
    const rtlToggle = document.getElementById("rtl-toggle");
    if (rtlToggle) rtlToggle.setAttribute("aria-pressed", ariaValue);
    document.querySelectorAll("[data-rtl-toggle-mobile]").forEach((btn) => {
      btn.setAttribute("aria-pressed", ariaValue);
    });
    if (persist) {
      try {
        localStorage.setItem(DIR_KEY, isRtl ? "rtl" : "ltr");
      } catch {}
    }
  };

  const toggleRtl = () => setRtl(root.getAttribute("dir") !== "rtl");

  const rtlToggle = document.getElementById("rtl-toggle");
  if (rtlToggle) rtlToggle.addEventListener("click", toggleRtl);
  document.querySelectorAll("[data-rtl-toggle-mobile]").forEach((btn) => {
    btn.addEventListener("click", toggleRtl);
  });

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

  const mobileMenu = document.getElementById("mobile-menu");
  const mobileToggle = document.getElementById("mobile-toggle");
  const mobileClose = document.getElementById("mobile-close");

  const openMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.add("is-open");
    if (mobileToggle) mobileToggle.setAttribute("aria-expanded", "true");
  };

  const closeMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("is-open");
    if (mobileToggle) mobileToggle.setAttribute("aria-expanded", "false");
  };

  if (mobileToggle) mobileToggle.addEventListener("click", openMobileMenu);
  if (mobileClose) mobileClose.addEventListener("click", closeMobileMenu);
  if (mobileMenu) {
    mobileMenu.addEventListener("click", (event) => {
      if (event.target === mobileMenu) closeMobileMenu();
    });
  }

  const mobileDropdowns = Array.from(document.querySelectorAll("[data-mobile-dropdown]"));
  if (mobileDropdowns.length) {
    mobileDropdowns.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.getAttribute("data-mobile-dropdown");
        if (!target) return;
        const panel = document.querySelector(`[data-mobile-menu=\"${target}\"]`);
        if (!panel) return;
        const isOpen = !panel.classList.contains("hidden");
        mobileDropdowns.forEach((otherButton) => {
          const otherTarget = otherButton.getAttribute("data-mobile-dropdown");
          const otherPanel = otherTarget
            ? document.querySelector(`[data-mobile-menu=\"${otherTarget}\"]`)
            : null;
          if (otherPanel) otherPanel.classList.add("hidden");
          otherButton.setAttribute("aria-expanded", "false");
        });
        if (isOpen) {
          panel.classList.add("hidden");
          button.setAttribute("aria-expanded", "false");
        } else {
          panel.classList.remove("hidden");
          button.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileMenu();
  });

  const passwordToggles = Array.from(document.querySelectorAll("[data-toggle-password]"));
  if (passwordToggles.length) {
    passwordToggles.forEach((button) => {
      button.addEventListener("click", () => {
        const targetId = button.getAttribute("data-target");
        if (!targetId) return;
        const input = document.getElementById(targetId);
        if (!input) return;
        const isHidden = input.type === "password";
        input.type = isHidden ? "text" : "password";
        const icon = button.querySelector("i");
        if (icon) {
          icon.classList.toggle("fa-eye", !isHidden);
          icon.classList.toggle("fa-eye-slash", isHidden);
        }
        button.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
      });
    });
  }

  const dropdowns = document.querySelectorAll("[data-dropdown]");
  if (dropdowns.length) {
    dropdowns.forEach((dropdown) => {
      const trigger = dropdown.querySelector("[data-dropdown-trigger]");
      if (!trigger) return;
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        dropdowns.forEach((other) => {
          if (other !== dropdown) other.classList.remove("is-open");
        });
        dropdown.classList.toggle("is-open");
      });
    });

    document.addEventListener("click", () => {
      dropdowns.forEach((dropdown) => dropdown.classList.remove("is-open"));
    });
  }

  const setActiveNav = () => {
    const path = decodeURIComponent(window.location.pathname.split("/").pop() || "");
    const current = path || "index.html";
    document.querySelectorAll("a.nav-link").forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (!href) return;
      const target = decodeURIComponent(href.split("/").pop() || "");
      link.classList.toggle("active", target === current);
    });
  };
  setActiveNav();

  const tabsContainer = document.querySelector("[data-pattern-tabs]");
  if (tabsContainer) {
    const tabs = Array.from(tabsContainer.querySelectorAll(".pattern-tab"));
    const cards = Array.from(document.querySelectorAll(".pattern-card"));

    tabsContainer.addEventListener("click", (event) => {
      const button = event.target.closest(".pattern-tab");
      if (!button) return;
      tabs.forEach((tab) => tab.classList.remove("active"));
      button.classList.add("active");
      const filter = button.dataset.filter || "all";
      cards.forEach((card) => {
        const categories = (card.dataset.category || "").toLowerCase();
        const show = filter === "all" || categories.includes(filter.toLowerCase());
        card.style.display = show ? "" : "none";
      });
    });
  }

  const pricingToggle = document.getElementById("toggle");
  if (pricingToggle) {
    const prices = Array.from(document.querySelectorAll(".price[data-month][data-year]"));
    const updatePrices = () => {
      const yearly = pricingToggle.checked;
      prices.forEach((price) => {
        const value = yearly ? price.dataset.year : price.dataset.month;
        if (value) price.textContent = `$${value}`;
      });
    };
    updatePrices();
    pricingToggle.addEventListener("change", updatePrices);
  }

  const faqItems = Array.from(document.querySelectorAll(".faq-item"));
  if (faqItems.length) {
    faqItems.forEach((item) => {
      const trigger = item.querySelector(".faq-question");
      if (!trigger) return;
      trigger.addEventListener("click", () => {
        const isOpen = item.classList.contains("active");
        faqItems.forEach((other) => other.classList.remove("active"));
        if (!isOpen) item.classList.add("active");
      });
    });
  }

  const qtyInput = document.getElementById("qty");
  if (qtyInput) {
    const parseQty = () => {
      const value = Number.parseInt(qtyInput.value, 10);
      return Number.isFinite(value) && value > 0 ? value : 1;
    };
    const setQty = (value) => {
      const safeValue = Math.max(1, value);
      qtyInput.value = String(safeValue);
    };

    window.increaseQty = () => setQty(parseQty() + 1);
    window.decreaseQty = () => setQty(parseQty() - 1);

    qtyInput.addEventListener("input", () => {
      if (qtyInput.value.trim() === "") return;
      setQty(parseQty());
    });
  }

  const revealTargets = Array.from(
    document.querySelectorAll(
      "section, .product-card, .pattern-card, .why-card, .testimonial-card-premium, .blog-card, .blog-featured-card, .card, .c-option-card, .faq-item"
    )
  );

  if (revealTargets.length) {
    revealTargets.forEach((el) => el.classList.add("reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach((el) => observer.observe(el));
  }
})();
