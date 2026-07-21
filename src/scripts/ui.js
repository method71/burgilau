function getSelectedInput(inputs, group) {
  return inputs.find((input) => input.name === group && input.checked);
}

function getOptionLabel(input) {
  return input?.nextElementSibling?.querySelector("[data-option-label]")?.textContent.trim() ?? "";
}

export function createCalculatorUi() {
  const inputs = [...document.querySelectorAll("[data-calc-input]")];
  const priceElement = document.querySelector("[data-price]");
  const whatsappLink = document.querySelector("[data-whatsapp]");
  const groups = [...new Set(inputs.map((input) => input.name))];

  function readState() {
    const selections = {};
    const labels = {};

    groups.forEach((group) => {
      const input = getSelectedInput(inputs, group);
      selections[group] = input?.value ?? "";
      labels[group] = getOptionLabel(input);
    });

    return { selections, labels };
  }

  function render({ formattedPrice, whatsappUrl }) {
    if (priceElement) priceElement.textContent = formattedPrice;
    if (whatsappLink) whatsappLink.href = whatsappUrl;
  }

  function onChange(handler) {
    inputs.forEach((input) => input.addEventListener("change", handler));
  }

  return { onChange, readState, render };
}

export function initCompanyCard() {
  document.querySelector("[data-company-card]")?.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

export function initHeroSlider() {
  const heroTrack = document.querySelector("[data-hero-track]");
  const heroSlides = [...document.querySelectorAll("[data-hero-slide]")];
  const heroDots = [...document.querySelectorAll("[data-hero-dot]")];

  if (!heroTrack || !heroSlides.length) return;

  heroSlides.forEach((slide, index) => {
    slide.dataset.slideIndex = index;
  });

  const firstClone = heroSlides[0].cloneNode(true);
  const lastClone = heroSlides[heroSlides.length - 1].cloneNode(true);

  [firstClone, lastClone].forEach((clone) => {
    clone.dataset.loopClone = "true";
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("a,button,input").forEach((element) => {
      element.tabIndex = -1;
    });
  });

  heroTrack.prepend(lastClone);
  heroTrack.append(firstClone);

  const renderedHeroSlides = [...heroTrack.querySelectorAll("[data-hero-slide]")];
  const nextSection = document.querySelector("[data-calculator]");
  let dragStartX = 0;
  let dragStartScroll = 0;
  let dragMoved = false;
  let suppressClickUntil = 0;
  let heroFadeFrame = 0;
  let loopTimer = 0;
  let pointerActive = false;
  let pointerIgnored = false;
  let dragStartSlide = 0;

  function updateHeroFade() {
    const trackRect = heroTrack.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;

    renderedHeroSlides.forEach((slide) => {
      const slideRect = slide.getBoundingClientRect();
      const slideCenter = slideRect.left + slideRect.width / 2;
      const distance = Math.min(Math.abs(slideCenter - trackCenter) / slideRect.width, 1);
      slide.style.opacity = String(1 - distance * 0.65);
    });

    heroFadeFrame = 0;
  }

  function requestHeroFadeUpdate() {
    if (heroFadeFrame) return;
    heroFadeFrame = requestAnimationFrame(updateHeroFade);
  }

  function updateHeroControls(index) {
    heroDots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === index;
      dot.classList.toggle("is-active", isActive);

      if (isActive) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  function goToHeroSlide(index) {
    const targetIndex = (index + heroSlides.length) % heroSlides.length;
    heroSlides[targetIndex].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
    updateHeroControls(targetIndex);
  }

  heroDots.forEach((dot, index) => {
    dot.addEventListener("click", () => goToHeroSlide(index));
  });

  renderedHeroSlides.forEach((slide) => {
    slide.querySelector("[data-hero-cta]")?.addEventListener("click", (event) => {
      event.preventDefault();
      nextSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  function nearestHeroSlide() {
    const trackCenter = heroTrack.getBoundingClientRect().left + heroTrack.clientWidth / 2;

    return renderedHeroSlides.reduce((nearestSlide, slide) => {
      const slideRect = slide.getBoundingClientRect();
      const slideCenter = slideRect.left + slideRect.width / 2;
      const nearestRect = nearestSlide.getBoundingClientRect();
      const nearestCenter = nearestRect.left + nearestRect.width / 2;

      return Math.abs(slideCenter - trackCenter) < Math.abs(nearestCenter - trackCenter)
        ? slide
        : nearestSlide;
    }, renderedHeroSlides[0]);
  }

  function scrollToRenderedSlide(slide, behavior = "smooth") {
    slide.scrollIntoView({ behavior, block: "nearest", inline: "center" });
    updateHeroControls(Number(slide.dataset.slideIndex));
  }

  function normalizeHeroLoop() {
    if (pointerActive || heroTrack.classList.contains("is-dragging")) return;

    const nearestSlide = nearestHeroSlide();
    if (!nearestSlide.dataset.loopClone) return;

    const realSlide = heroSlides[Number(nearestSlide.dataset.slideIndex)];
    heroTrack.classList.add("is-loop-jump");
    heroTrack.scrollLeft = realSlide.offsetLeft;
    updateHeroControls(Number(realSlide.dataset.slideIndex));
    updateHeroFade();
    requestAnimationFrame(() => heroTrack.classList.remove("is-loop-jump"));
  }

  heroTrack.addEventListener("pointerdown", (event) => {
    pointerIgnored = Boolean(event.target.closest("[data-hero-cta]"));
    if (pointerIgnored) return;

    pointerActive = true;
    dragStartX = event.clientX;
    dragStartSlide = renderedHeroSlides.indexOf(nearestHeroSlide());
    dragMoved = false;

    if (event.pointerType !== "mouse" || event.button !== 0) return;

    dragStartScroll = heroTrack.scrollLeft;
    heroTrack.classList.add("is-dragging");
    heroTrack.setPointerCapture(event.pointerId);
  });

  heroTrack.addEventListener("pointermove", (event) => {
    if (!heroTrack.classList.contains("is-dragging")) return;

    const distance = event.clientX - dragStartX;
    if (Math.abs(distance) > 4) dragMoved = true;
    heroTrack.scrollLeft = dragStartScroll - distance;
    event.preventDefault();
  });

  function finishHeroDrag(event, cancelled = false) {
    if (pointerIgnored) {
      pointerIgnored = false;
      return;
    }

    pointerActive = false;
    const swipeDistance = event.clientX - dragStartX;
    const swipeThreshold = Math.min(heroTrack.clientWidth * 0.14, 72);
    const changedBySwipe = !cancelled && Math.abs(swipeDistance) >= swipeThreshold;

    if (heroTrack.classList.contains("is-dragging")) {
      heroTrack.classList.remove("is-dragging");
      if (heroTrack.hasPointerCapture(event.pointerId))
        heroTrack.releasePointerCapture(event.pointerId);
    }

    if (dragMoved || changedBySwipe) suppressClickUntil = Date.now() + 250;

    if (changedBySwipe) {
      const direction = swipeDistance < 0 ? 1 : -1;
      const targetIndex = Math.max(
        0,
        Math.min(dragStartSlide + direction, renderedHeroSlides.length - 1),
      );
      scrollToRenderedSlide(renderedHeroSlides[targetIndex]);
    } else if (dragMoved) {
      scrollToRenderedSlide(nearestHeroSlide());
    }
  }

  heroTrack.addEventListener("pointerup", finishHeroDrag);
  heroTrack.addEventListener("pointercancel", (event) => finishHeroDrag(event, true));
  heroTrack.addEventListener(
    "click",
    (event) => {
      if (Date.now() > suppressClickUntil) return;
      event.preventDefault();
      event.stopPropagation();
    },
    true,
  );
  heroTrack.addEventListener(
    "scroll",
    () => {
      requestHeroFadeUpdate();
      clearTimeout(loopTimer);
      loopTimer = setTimeout(normalizeHeroLoop, 140);
    },
    { passive: true },
  );
  window.addEventListener("resize", requestHeroFadeUpdate);

  const heroObserver = new IntersectionObserver(
    (entries) => {
      const visibleSlide = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleSlide) updateHeroControls(Number(visibleSlide.target.dataset.slideIndex));
    },
    { root: heroTrack, threshold: [0.55, 0.75, 0.95] },
  );

  renderedHeroSlides.forEach((slide) => heroObserver.observe(slide));
  heroTrack.classList.add("is-loop-jump");
  heroTrack.scrollLeft = heroSlides[0].offsetLeft;
  requestAnimationFrame(() => heroTrack.classList.remove("is-loop-jump"));
  updateHeroControls(0);
  updateHeroFade();
}
