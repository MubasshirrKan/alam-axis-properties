import './style.css'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger);

// 1. Smooth Scrolling Setup (Lenis)
const lenis = new Lenis({
  lerp: 0.08, // Buttery smooth inertia
  smoothWheel: true,
  wheelMultiplier: 0.8, // Slightly more deliberate scroll speed
  touchMultiplier: 1.5,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

document.addEventListener("DOMContentLoaded", () => {
  
  // 2. Cinematic Hero Parallax & Logo Docking
  gsap.set('.animated-logo', { xPercent: -50, yPercent: -50 });
  
  gsap.to('.hero-text', {
    yPercent: -100, // Slide up aggressively
    opacity: 0, // Vanish
    scale: 0.9,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    }
  });

  gsap.to('.animated-logo', {
    top: '32px', // Centered in the py-4 nav (total height 64px, center is 32)
    left: '72px', // w-[80px] has half-width 40px. To place left edge at 32px (px-8), we set left to 32 + 40 = 72px.
    xPercent: -50,
    yPercent: -50,
    width: '80px',
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    }
  });

  gsap.to('.hero-bg-video', {
    yPercent: 10,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    }
  });

  // 3. Statistical Storytelling (About Us) Reveal
  gsap.to('.about-text', {
    y: 0,
    opacity: 1,
    stagger: 0.2,
    duration: 1.5,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#about',
      start: 'top 70%',
    }
  });

  // Counter animation
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const target = parseInt(counter.getAttribute('data-target'));
        gsap.to(counter, {
          innerHTML: target,
          duration: 3.5, // Slower counter for premium feel
          snap: { innerHTML: 1 },
          ease: 'expo.out' // Dramatic easing
        });
      }
    });
  });

  // 4. Values Grid (Glassmorphism)
  gsap.to('.service-card', {
    y: 0,
    opacity: 1,
    stagger: 0.15,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#services',
      start: 'top 75%',
    }
  });

  // 5. Pinned Feature Showcase (The Slicer)
  const images = [
    '/images/bd_exterior.png',
    '/images/bd_commercial.png',
    '/images/bd_interior.png'
  ];
  
  const slicerWrapper = document.querySelector('.slicer-wrapper');
  const SLICE_COUNT = 10;
  
  // Create layers of slicers for each image transition using clip-path
  images.forEach((imgSrc, imgIndex) => {
    const container = document.createElement('div');
    container.className = 'slicer-container absolute inset-0 w-full h-full';
    container.style.zIndex = images.length - imgIndex;
    
    for (let i = 0; i < SLICE_COUNT; i++) {
      const slice = document.createElement('div');
      slice.className = 'slice absolute inset-0 w-full h-full';
      slice.style.backgroundImage = `url(${imgSrc})`;
      slice.style.backgroundSize = 'cover';
      slice.style.backgroundPosition = 'center';
      
      const topInset = i * (100 / SLICE_COUNT);
      const bottomInset = 100 - ((i + 1) * (100 / SLICE_COUNT));
      slice.style.clipPath = `inset(${topInset}% 0 ${bottomInset}% 0)`;
      slice.dataset.targetClip = `inset(${topInset}% 0 ${100 - topInset}% 0)`;
      
      const centerY = topInset + (100 / SLICE_COUNT) / 2;
      slice.style.transformOrigin = `50% ${centerY}%`;
      
      container.appendChild(slice);
    }
    slicerWrapper.appendChild(container);
  });

  const texts = document.querySelectorAll('.feature-text');
  const slicerContainers = document.querySelectorAll('.slicer-container');
  const fgImages = document.querySelectorAll('.fg-img');

  // Pin the section and scrub through the texts and slices
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#featured-pin',
      start: 'top top',
      end: '+=400%', // Increased scroll distance to show 3 features with pauses
      pin: true,
      scrub: 1.5, // Increased scrub smoothing
    }
  });

  // Init positions for fgImages
  gsap.set(fgImages[0], { yPercent: 0, opacity: 1 });
  gsap.set(fgImages[1], { yPercent: 100, opacity: 0 });
  gsap.set(fgImages[2], { yPercent: 100, opacity: 0 });

  // Initial Pause (allows reading Text 0)
  tl.to({}, { duration: 1.0 });

  // Sequence: Show Text 1 -> Transition Image 1/Show Text 2 -> Transition Image 2/Show Text 3
  
  // Transition 1
  tl.to(texts[0], { y: -30, opacity: 0, duration: 0.6, ease: 'power2.in' }) // text 0 leaves quickly
    .to(slicerContainers[0].children, {
      clipPath: (i, target) => target.dataset.targetClip,
      stagger: 0.05,
      duration: 1.2,
      ease: 'power3.inOut' // Smooth wipe
    }, "<")
    .to(fgImages[0], { yPercent: -100, opacity: 0, duration: 1.2, ease: 'power3.inOut' }, "<")
    .to(fgImages[1], { yPercent: 0, opacity: 1, duration: 1.2, ease: 'power3.inOut' }, "<")
    .fromTo(texts[1], { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, "-=0.6"); // text 1 enters at the end

  // Pause for Text 1
  tl.to({}, { duration: 1.5 });

  // Transition 2
  tl.to(texts[1], { y: -30, opacity: 0, duration: 0.6, ease: 'power2.in' })
    .to(slicerContainers[1].children, {
      clipPath: (i, target) => target.dataset.targetClip,
      stagger: 0.05,
      duration: 1.2,
      ease: 'power3.inOut'
    }, "<")
    .to(fgImages[1], { yPercent: -100, opacity: 0, duration: 1.2, ease: 'power3.inOut' }, "<")
    .to(fgImages[2], { yPercent: 0, opacity: 1, duration: 1.2, ease: 'power3.inOut' }, "<")
    .fromTo(texts[2], { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, "-=0.6");

  // Final Pause for Text 2
  tl.to({}, { duration: 1.5 });

  // 6. Accordion FAQ logic
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      const currentlyActive = document.querySelector('.accordion-item.active');
      if (currentlyActive && currentlyActive !== item) {
        currentlyActive.classList.remove('active');
        currentlyActive.querySelector('.accordion-content').style.maxHeight = 0;
        currentlyActive.querySelector('.text-2xl').textContent = '+';
      }
      item.classList.toggle('active');
      const content = item.querySelector('.accordion-content');
      const icon = item.querySelector('.text-2xl');
      if (item.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.textContent = '-';
      } else {
        content.style.maxHeight = 0;
        icon.textContent = '+';
      }
    });
  });

  // 7. New Sections Animations
  
  // Why Choose Us
  gsap.to('.why-text', {
    x: 0, opacity: 1, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '#why', start: 'top 70%' }
  });
  gsap.to('.why-feature', {
    y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out',
    scrollTrigger: { trigger: '.why-features', start: 'top 80%' }
  });

  // Portfolio Grid
  gsap.to('.portfolio-header', {
    y: 0, opacity: 1, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '#portfolio', start: 'top 80%' }
  });
  gsap.to('.prop-card', {
    y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power2.out',
    scrollTrigger: { trigger: '#portfolio', start: 'top 70%' }
  });

  // Process Timeline
  gsap.to('.process-header', {
    y: 0, opacity: 1, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '#process', start: 'top 80%' }
  });
  gsap.to('.process-line', {
    scaleX: 1, duration: 1.5, ease: 'power3.inOut',
    scrollTrigger: { trigger: '.process-steps', start: 'top 70%' }
  });
  gsap.to('.process-step', {
    y: 0, opacity: 1, duration: 0.8, stagger: 0.3, ease: 'back.out(1.5)',
    scrollTrigger: { trigger: '.process-steps', start: 'top 65%' }
  });

  // Areas Grid
  gsap.to('.areas-header', {
    x: 0, opacity: 1, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '#areas', start: 'top 80%' }
  });
  gsap.fromTo('.area-item', 
    {
      opacity: 0,
      scale: 0.5,
      y: 200,
      rotation: (i, target, targets) => {
        const mid = (targets.length - 1) / 2;
        return (i - mid) * 15; 
      },
      transformOrigin: "bottom center"
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      rotation: 0,
      duration: 1.2,
      stagger: {
        amount: 0.8,
        from: "center"
      },
      ease: 'back.out(1.5)',
      scrollTrigger: { trigger: '.areas-grid', start: 'top 80%' }
    }
  );

  // Testimonials
  gsap.to('.test-header', {
    y: 0, opacity: 1, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '#testimonials', start: 'top 80%' }
  });
  gsap.to('.test-card', {
    y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power2.out',
    scrollTrigger: { trigger: '#testimonials', start: 'top 70%' }
  });

  // 8. Gallery Logic
  const galSlides = document.querySelectorAll('.gal-slide');
  const galDots = document.querySelectorAll('.gal-dot');
  const galDesc = document.querySelector('.gal-desc');
  const btnPrev = document.querySelector('.gal-prev');
  const btnNext = document.querySelector('.gal-next');
  let currentGalIndex = 1; // Default active index is 1
  
  const descriptions = [
    'Modern living spaces in the heart of the city with panoramic views and state-of-the-art security features.',
    'Two-story luxury apartments that features sunlit living spaces, private terraces, and a selection of exclusive amenities.',
    'Premium commercial real estate designed for industry leaders and growing enterprises seeking a strategic location.',
    'Elevated living with breathtaking city views, featuring bespoke interiors and premium rooftop amenities.',
    'Serene suburban properties offering lush green surroundings, private gardens, and sustainable architecture.'
  ];
  
  function updateGallery(activeIndex) {
    currentGalIndex = activeIndex;
    const total = galSlides.length;
    let leftIndex = activeIndex - 1 < 0 ? total - 1 : activeIndex - 1;
    let rightIndex = activeIndex + 1 >= total ? 0 : activeIndex + 1;

    galSlides.forEach(slide => {
      const idx = parseInt(slide.dataset.index);
      const title = slide.querySelector('h2');
      
      slide.className = 'absolute top-1/2 -translate-y-1/2 gal-slide transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]';
      
      if (idx === activeIndex) {
        slide.classList.add('left-1/2', '-translate-x-1/2', 'w-[80%]', 'md:w-[35%]', 'h-[80%]', 'md:h-[90%]', 'z-10', 'cursor-default', 'opacity-100');
        title.style.opacity = '1';
        title.style.transform = 'translate(-50%, -50%) scale(1)';
      } else if (idx === leftIndex) {
        slide.classList.add('left-0', 'w-[40%]', 'md:w-[25%]', 'h-[60%]', 'md:h-[75%]', 'cursor-pointer', 'z-0', 'hover:brightness-110', 'opacity-100');
        title.style.opacity = '0';
        title.style.transform = 'translate(-50%, -50%) scale(0.9)';
      } else if (idx === rightIndex) {
        slide.classList.add('right-0', 'w-[40%]', 'md:w-[25%]', 'h-[60%]', 'md:h-[75%]', 'cursor-pointer', 'z-0', 'hover:brightness-110', 'opacity-100');
        title.style.opacity = '0';
        title.style.transform = 'translate(-50%, -50%) scale(0.9)';
      } else {
        slide.classList.add('left-1/2', '-translate-x-1/2', 'w-[40%]', 'md:w-[25%]', 'h-[60%]', 'md:h-[75%]', 'z-[-1]', 'opacity-0', 'pointer-events-none');
        title.style.opacity = '0';
        title.style.transform = 'translate(-50%, -50%) scale(0.9)';
      }
    });
    
    galDots.forEach((dot, i) => {
      if (i === activeIndex) {
        dot.classList.add('active', 'text-bone', 'opacity-100');
        dot.classList.remove('opacity-60');
      } else {
        dot.classList.remove('active', 'text-bone', 'opacity-100');
        dot.classList.add('opacity-60');
      }
    });
    
    if(galDesc) {
      galDesc.style.opacity = '0';
      setTimeout(() => {
        galDesc.textContent = descriptions[activeIndex];
        galDesc.style.opacity = '1';
      }, 300);
    }
  }
  
  galSlides.forEach(slide => {
    slide.addEventListener('click', () => {
      const idx = parseInt(slide.dataset.index);
      if (!slide.classList.contains('z-10')) {
        updateGallery(idx);
      }
    });
  });
  
  galDots.forEach(dot => {
    dot.addEventListener('click', () => {
      updateGallery(parseInt(dot.dataset.index));
    });
  });

  if (btnPrev && btnNext) {
    btnPrev.addEventListener('click', () => {
      updateGallery(currentGalIndex - 1 < 0 ? galSlides.length - 1 : currentGalIndex - 1);
    });
    btnNext.addEventListener('click', () => {
      updateGallery(currentGalIndex + 1 >= galSlides.length ? 0 : currentGalIndex + 1);
    });
  }

  // 9. Smooth Scroll for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          lenis.scrollTo(targetElement, {
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        }
      }
    });
  });
});

// YouTube Looping Logic
window.onYouTubeIframeAPIReady = function() {
  new YT.Player("hero-player", {
    events: {
      "onStateChange": function(event) {
        if (event.data === YT.PlayerState.ENDED) {
          event.target.playVideo();
        }
      }
    }
  });
};
