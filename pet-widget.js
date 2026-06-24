(function () {
  const widget = document.getElementById('pet-widget');
  const bubble = document.getElementById('pet-bubble');
  const chat = document.getElementById('pet-chat');
  const closeBtn = document.getElementById('pet-chat-close');
  const messages = document.getElementById('pet-chat-messages');
  const form = document.getElementById('pet-chat-form');
  const input = document.getElementById('pet-chat-input');
  if (!widget) return;

  const POS_KEY = 'pet-widget.position';
  const GREETINGS = [
    "Hey, I'm Byte 👋",
    'Ask me about Jitesh!',
    'Curious about my friend?',
    'Drag me anywhere!',
    'Got a question for me?',
  ];

  function applyPosition(pos) {
    if (!pos) return;
    widget.style.right = 'auto';
    widget.style.bottom = 'auto';
    widget.style.left = pos.left + 'px';
    widget.style.top = pos.top + 'px';
  }

  try {
    const saved = JSON.parse(localStorage.getItem(POS_KEY) || 'null');
    if (saved) applyPosition(saved);
  } catch {}

  let dragging = false;
  let moved = false;
  let startX = 0;
  let startY = 0;
  let originLeft = 0;
  let originTop = 0;

  function showBubble() {
    bubble.textContent = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    bubble.classList.add('is-visible');
    window.setTimeout(() => bubble.classList.remove('is-visible'), 3200);
  }

  window.setTimeout(showBubble, 1500);
  window.setInterval(showBubble, 25000);

  widget.addEventListener('pointerdown', (e) => {
    dragging = true;
    moved = false;
    widget.classList.add('is-dragging');
    const rect = widget.getBoundingClientRect();
    originLeft = rect.left;
    originTop = rect.top;
    startX = e.clientX;
    startY = e.clientY;
    widget.setPointerCapture(e.pointerId);
  });

  widget.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
    if (!moved) return;

    let left = originLeft + dx;
    let top = originTop + dy;
    const maxLeft = window.innerWidth - widget.offsetWidth - 4;
    const maxTop = window.innerHeight - widget.offsetHeight - 4;
    left = Math.min(Math.max(4, left), maxLeft);
    top = Math.min(Math.max(4, top), maxTop);
    applyPosition({ left, top });
  });

  widget.addEventListener('pointerup', (e) => {
    dragging = false;
    widget.classList.remove('is-dragging');
    try {
      widget.releasePointerCapture(e.pointerId);
    } catch {}
    if (moved) {
      const rect = widget.getBoundingClientRect();
      localStorage.setItem(POS_KEY, JSON.stringify({ left: rect.left, top: rect.top }));
    } else {
      toggleChat();
    }
  });

  function toggleChat() {
    const open = chat.classList.toggle('is-open');
    chat.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) input.focus();
  }

  closeBtn?.addEventListener('click', () => {
    chat.classList.remove('is-open');
    chat.setAttribute('aria-hidden', 'true');
  });

  function addMessage(from, text) {
    const el = document.createElement('div');
    el.className = `pet-msg from-${from}`;
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
    return el;
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    addMessage('user', question);
    input.value = '';

    const loadingEl = addMessage('pet', 'Byte is thinking…');
    loadingEl.classList.add('is-loading');

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      loadingEl.remove();
      addMessage('pet', data.answer || "Hmm, I couldn't think of an answer to that — try asking me something else about Jitesh.");
    } catch (err) {
      loadingEl.remove();
      addMessage('pet', "I can't reach my brain right now. Try again in a bit, or just email Jitesh directly.");
    }
  });
})();
