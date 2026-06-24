(function () {
  const tools = window.AI_TOOLS || [];
  const grid = document.getElementById("ai-tools-grid");
  const filters = document.getElementById("ai-tools-filters");
  const toggle = document.getElementById("ai-tools-toggle");
  const panel = document.getElementById("ai-tools-panel");
  const countEl = document.getElementById("ai-tools-count");
  if (!grid) return;

  const PALETTE = ["accent", "rust", "gold"];

  function initialsOf(name) {
    const words = name.replace(/[.]/g, "").split(/\s+/).filter(Boolean);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  function cardHtml(tool, index) {
    const colorClass = PALETTE[index % PALETTE.length];
    const tagsHtml = tool.tags.map((t) => `<span class="ai-tool-tag">${t}</span>`).join("");
    return `
      <article class="ai-tool-card" data-tags="${tool.tags.join(",")}" tabindex="0">
        <span class="ai-tool-badge is-${colorClass}">${initialsOf(tool.name)}</span>
        <div class="ai-tool-info">
          <h3>${tool.name}</h3>
          <span class="ai-tool-maker">${tool.maker} · ${tool.category}</span>
          <div class="ai-tool-tags">${tagsHtml}</div>
        </div>
      </article>
    `;
  }

  function render() {
    grid.innerHTML = tools.map(cardHtml).join("");
    if (countEl) countEl.textContent = String(tools.length);
  }

  render();

  filters?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-ai-filter]");
    if (!btn) return;
    filters.querySelectorAll("button").forEach((b) => b.classList.toggle("is-active", b === btn));
    const filter = btn.dataset.aiFilter;
    grid.querySelectorAll(".ai-tool-card").forEach((card) => {
      const tags = card.dataset.tags.split(",");
      const match = filter === "all" || tags.includes(filter);
      card.classList.toggle("is-dimmed", !match);
    });
  });

  toggle?.addEventListener("click", () => {
    const open = !panel.classList.contains("is-open");
    panel.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.classList.toggle("is-open", open);
  });
})();
