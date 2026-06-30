const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

const setCursorStyle = ({ width, height, background }) => {
  cursor.style.width = width;
  cursor.style.height = height;
  cursor.style.background = background;
};

const setRingSize = size => {
  ring.style.width = size;
  ring.style.height = size;
};

const applyHoverState = () => {
  setCursorStyle({ width: '20px', height: '20px', background: 'var(--accent2)' });
  setRingSize('50px');
};

const applyDefaultState = () => {
  setCursorStyle({ width: '12px', height: '12px', background: 'var(--accent)' });
  setRingSize('36px');
};

const onMouseMove = event => {
  mouseX = event.clientX;
  mouseY = event.clientY;
  cursor.style.left = `${mouseX}px`;
  cursor.style.top = `${mouseY}px`;
};

const animateRing = () => {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = `${ringX}px`;
  ring.style.top = `${ringY}px`;
  requestAnimationFrame(animateRing);
};

const initHoverInteractions = () => {
  document.querySelectorAll('a, .badge, .project-card, .strength-item, .hero-image').forEach(el => {
    el.addEventListener('mouseenter', applyHoverState);
    el.addEventListener('mouseleave', applyDefaultState);
  });
};

const initScrollReveal = () => {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries, observerRef) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const index = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), index * 80);
      observerRef.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observer.observe(el));
};

const initNavShrink = () => {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.style.padding = window.scrollY > 40 ? '.8rem 4rem' : '1.2rem 4rem';
  });
};

const initSectionHighlight = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const updateActiveLink = () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 200) current = section.id;
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--white)' : '';
    });
  };

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();
};

const initNovaVozCarousel = () => {
  const slides = document.querySelectorAll('.project-feature-slide');
  if (!slides.length) return;

  let currentIndex = 0;

  const showSlide = index => {
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === index);
    });
  };

  setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }, 3500);

  showSlide(currentIndex);
};

const initHeroTyping = () => {
  const heroTitle = document.querySelector('.hero-title');
  const lines = heroTitle?.querySelectorAll('.hero-line');
  const cursor = heroTitle?.querySelector('.hero-cursor');

  if (!heroTitle || !lines?.length || !cursor) return;

  lines.forEach(line => {
    line.textContent = '';
  });

  cursor.style.opacity = '0';

  const typingSpeed = 45;
  const lineDelay = 320;

  const updateCursorPosition = line => {
    const titleRect = heroTitle.getBoundingClientRect();
    const lineRect = line.getBoundingClientRect();

    cursor.style.top = `${lineRect.top - titleRect.top + 2}px`;
    cursor.style.left = `${lineRect.right - titleRect.left + 2}px`;
  };

  const typeLine = (line, text, onComplete) => {
    let index = 0;
    const interval = setInterval(() => {
      line.textContent = text.slice(0, index + 1);
      updateCursorPosition(line);
      cursor.style.opacity = '1';
      index += 1;

      if (index >= text.length) {
        clearInterval(interval);
        onComplete();
      }
    }, typingSpeed);
  };

  let currentLine = 0;
  const typeNextLine = () => {
    if (currentLine >= lines.length) {
      cursor.style.opacity = '1';
      return;
    }

    const line = lines[currentLine];
    typeLine(line, line.dataset.text, () => {
      currentLine += 1;
      if (currentLine < lines.length) {
        setTimeout(() => {
          updateCursorPosition(lines[currentLine]);
          typeNextLine();
        }, lineDelay);
      } else {
        cursor.style.opacity = '1';
      }
    });
  };

  setTimeout(() => {
    updateCursorPosition(lines[0]);
    typeNextLine();
  }, 350);
};

document.addEventListener('mousemove', onMouseMove);
animateRing();
initHoverInteractions();
initScrollReveal();
initNavShrink();
initSectionHighlight();
initHeroTyping();
initNovaVozCarousel();
