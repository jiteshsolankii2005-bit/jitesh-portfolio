const { isDashboardAuthorized } = require('../lib/session');
const { renderShell } = require('../lib/dashboard-layout');

const EXTRA_STYLE = `
  .video-layout { display:grid; grid-template-columns: 1.6fr 1fr; gap:16px; margin-top:14px; }
  .video-frame { position:relative; padding-top:56.25%; background:#000; border-radius:var(--radius); overflow:hidden; }
  .video-frame iframe { position:absolute; inset:0; width:100%; height:100%; border:0; }
  .video-notes { display:flex; flex-direction:column; }
  .video-notes textarea { flex:1; min-height:220px; }
  @media (max-width: 760px) { .video-layout { grid-template-columns: 1fr; } }
`;

const BODY_HTML = `
    <section class="card" style="grid-column: 1 / -1;">
      <span class="sub">Learning</span>
      <h2>Tabs</h2>
      <div class="video-layout">
        <div class="video-frame">
          <iframe
            src="https://www.youtube-nocookie.com/embed/dFc-BUe506s"
            title="Learning video"
            frameborder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </div>
        <div class="video-notes">
          <textarea id="video-notes-area" placeholder="Notes while watching..."></textarea>
          <span class="saved-tag" id="video-notes-saved">Saved</span>
        </div>
      </div>
    </section>
`;

const SCRIPT = `
(function () {
  const videoNotesKey = "personal.video-notes";
  const videoNotesArea = document.getElementById("video-notes-area");
  const videoNotesSaved = document.getElementById("video-notes-saved");
  videoNotesArea.value = localStorage.getItem(videoNotesKey) || "";
  let videoNotesTimer;
  videoNotesArea.addEventListener("input", () => {
    clearTimeout(videoNotesTimer);
    videoNotesTimer = setTimeout(() => {
      localStorage.setItem(videoNotesKey, videoNotesArea.value);
      videoNotesSaved.classList.add("is-visible");
      setTimeout(() => videoNotesSaved.classList.remove("is-visible"), 1200);
    }, 500);
  });
})();
`;

module.exports = async function handler(req, res) {
  if (!isDashboardAuthorized(req)) {
    res.status(404).end('Not Found');
    return;
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).end(
    renderShell({ title: 'Tabs', navActive: 'tabs', bodyHtml: BODY_HTML, extraStyle: EXTRA_STYLE, extraScript: SCRIPT })
  );
};
