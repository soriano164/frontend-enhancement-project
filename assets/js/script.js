document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const isPages = path.includes('/pages/') || path.endsWith('/pages');
  const prefix = isPages ? '../' : '';
  
  initTheme();
  
  loadComponent("navbar", prefix + "components/navbar.html", () => {
    fixComponentLinks('.nav-brand', 'href', prefix + 'index.html');
    fixNavLinks('.nav-link', prefix);
    initThemeToggle();
  });
  
  loadComponent("footer", prefix + "components/footer.html", () => {
    fixFooterLinks(prefix);
  });
  
  initScrollAnimations();
});

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

function initThemeToggle() {
  const existingToggle = document.querySelector('.theme-toggle');
  if (existingToggle) return;
  
  const themeToggle = document.createElement('button');
  themeToggle.className = 'theme-toggle';
  themeToggle.setAttribute('aria-label', 'Toggle dark mode');
  updateThemeIcon(themeToggle);
  
  themeToggle.addEventListener('click', () => {
    toggleTheme();
    updateThemeIcon(themeToggle);
  });
  
  const navMenu = document.querySelector('.nav-menu');
  if (navMenu) {
    navMenu.appendChild(themeToggle);
  }
}

function updateThemeIcon(btn) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

function loadComponent(id, file, callback) {
  fetch(file)
    .then(res => res.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
      if (id === "navbar") {
        initMobileNav();
      }
      if (callback) callback();
    });
}

function fixComponentLinks(selector, attr, value) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

function fixNavLinks(selector, prefix) {
  const navLinks = document.querySelectorAll(selector);
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === 'index.html' && prefix) {
      link.setAttribute('href', prefix + 'index.html');
    } else if (href && href.startsWith('pages/')) {
      link.setAttribute('href', prefix + href);
    }
  });
}

function fixFooterLinks(prefix) {
  const footerLinks = document.querySelectorAll('.footer-links a');
  footerLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === 'index.html' && prefix) {
      link.setAttribute('href', prefix + 'index.html');
    } else if (href && href.startsWith('pages/')) {
      link.setAttribute('href', prefix + href);
    }
  });
}

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");
  
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("active");
      toggle.classList.toggle("active");
    });

    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("active");
        toggle.classList.remove("active");
      });
    });
  }
}

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".feature-card, .service-card").forEach(el => {
    observer.observe(el);
  });
}

function openModal() {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeModal() {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

document.getElementById("modal")?.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    closeModal();
  }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

function handleSubmit(event) {
  event.preventDefault();
  openModal();
  event.target.reset();
}