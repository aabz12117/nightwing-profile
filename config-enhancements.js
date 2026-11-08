(() => {
  const root = document.documentElement;
  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (!element || !value) return;
    element.textContent = value;
    element.hidden = false;
  };

  if (config.theme) {
    const theme = config.theme;
    root.style.setProperty("--config-background", theme.background);
    root.style.setProperty("--config-surface", theme.surface);
    root.style.setProperty("--config-secondary", theme.secondary);
    root.style.setProperty("--config-primary", theme.primary);
    root.style.setProperty("--config-accent", theme.accent);
    root.style.setProperty("--config-text", theme.text);
    root.style.setProperty("--config-muted", theme.muted);
    root.style.setProperty("--config-border", theme.border);
  }

  if (config.appearance) {
    Object.entries(config.appearance).forEach(([key, value]) => {
      root.dataset[key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)] = value;
    });
  }

  setText("#pronouns", config.pronouns);
  if (config.identity) {
    const { heroName, realName, city, team } = config.identity;
    setText("#identity", [heroName, realName, city, team].filter(Boolean).join(" · "));
  }

  if (config.tag) {
    const tag = document.querySelector("#profile-tag");
    if (tag) {
      tag.innerHTML = `<i class="${config.tag.icon}" aria-hidden="true"></i><span></span>`;
      tag.querySelector("span").textContent = config.tag.name;
      tag.style.color = config.tag.color;
      tag.style.background = config.tag.background;
      tag.style.borderColor = config.tag.border;
      tag.hidden = false;
    }
  }

  if (config.presence) {
    const applyPresence = () => {
      const indicator = document.querySelector("#status");
      const customStatus = document.querySelector("#custom-status");
      if (indicator) {
        const statusClass = `status-indicator ${config.presence.status || "offline"}`;
        if (indicator.className !== statusClass) indicator.className = statusClass;
        indicator.tabIndex = config.presence.status === "dnd" ? 0 : -1;
        indicator.setAttribute("aria-label", `Discord status: ${config.presence.status || "offline"}`);
      }
      if (customStatus && config.presence.customStatus) {
        document.querySelector("#cs-emoji").textContent = config.presence.emoji || "";
        document.querySelector("#cs-text").textContent = config.presence.customStatus;
        customStatus.hidden = false;
      }
    };
    document.addEventListener("DOMContentLoaded", () => {
      applyPresence();
      new MutationObserver(applyPresence).observe(document.querySelector("#status"), { attributes: true, attributeFilter: ["class"] });
      new MutationObserver(applyPresence).observe(document.querySelector("#custom-status"), { attributes: true, attributeFilter: ["hidden"] });
    });
  }
})();
