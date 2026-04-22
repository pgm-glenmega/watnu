document.addEventListener("DOMContentLoaded", () => {
  const CONFIG = {
    storageKey: "watnuTopicUnderlineFrom",
    fallbackColor: "#4C40FD",
    durationMs: 600,
    opacityDurationMs: 160,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    resizeDebounceMs: 60,
  };

  const menu = document.getElementById("topicMenu");
  const underline = document.getElementById("topicUnderline");
  const pills = Array.from(document.querySelectorAll("[data-topic-pill]"));

  if (!menu || !underline || pills.length === 0) return;

  underline.style.setProperty(
    "--topic-underline-duration",
    `${CONFIG.durationMs}ms`,
  );
  underline.style.setProperty(
    "--topic-underline-opacity-duration",
    `${CONFIG.opacityDurationMs}ms`,
  );
  underline.style.setProperty("--topic-underline-easing", CONFIG.easing);

  function getActivePill() {
    return (
      menu.querySelector('.topic-pill[aria-selected="true"]') ||
      menu.querySelector(".topic-pill.is-active")
    );
  }

  function getPillBySlug(slug) {
    if (!slug) return null;
    return menu.querySelector(`[data-topic-slug="${slug}"]`);
  }

  function getPillColor(pill) {
    return pill?.dataset.topicColor || CONFIG.fallbackColor;
  }

  function readPreviousState() {
    const raw = sessionStorage.getItem(CONFIG.storageKey);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function clearPreviousState() {
    sessionStorage.removeItem(CONFIG.storageKey);
  }

  function saveCurrentState() {
    const activePill = getActivePill();
    if (!activePill) return;

    sessionStorage.setItem(
      CONFIG.storageKey,
      JSON.stringify({
        slug: activePill.dataset.topicSlug,
        color: getPillColor(activePill),
      }),
    );
  }

  function getMetrics(target) {
    const menuRect = menu.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    return {
      left: targetRect.left - menuRect.left,
      width: targetRect.width,
    };
  }

  function setInstantMode(isInstant) {
    underline.classList.toggle("is-instant", isInstant);
  }

  function moveUnderline(target, { instant = false, color } = {}) {
    if (!target) return;

    const { left, width } = getMetrics(target);

    setInstantMode(instant);

    underline.style.width = `${width}px`;
    underline.style.transform = `translateX(${left}px)`;
    underline.style.opacity = "1";

    if (color) {
      underline.style.backgroundColor = color;
    }
  }

  function animateFromPreviousToCurrent() {
    const currentPill = getActivePill();
    const previousState = readPreviousState();

    if (!currentPill) {
      clearPreviousState();
      return;
    }

    const currentColor = getPillColor(currentPill);
    const previousPill = previousState?.slug
      ? getPillBySlug(previousState.slug)
      : null;
    const previousColor = previousState?.color || getPillColor(previousPill);

    if (previousPill && previousPill !== currentPill) {
      moveUnderline(previousPill, {
        instant: true,
        color: previousColor,
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          moveUnderline(currentPill, {
            instant: false,
            color: currentColor,
          });
          clearPreviousState();
        });
      });
    } else {
      moveUnderline(currentPill, {
        instant: true,
        color: currentColor,
      });

      requestAnimationFrame(() => {
        setInstantMode(false);
      });

      clearPreviousState();
    }
  }

  function handleResize() {
    const currentPill = getActivePill();
    if (!currentPill) return;

    moveUnderline(currentPill, {
      instant: true,
      color: getPillColor(currentPill),
    });

    requestAnimationFrame(() => {
      setInstantMode(false);
    });
  }

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, CONFIG.resizeDebounceMs);
  });

  pills.forEach((pill) => {
    pill.addEventListener("click", saveCurrentState);
  });

  animateFromPreviousToCurrent();
});
