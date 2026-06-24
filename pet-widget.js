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
  const THEME_KEY = 'byte.theme';
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

  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) document.documentElement.dataset.byteTheme = savedTheme;
  } catch {}

  let dragging = false;
  let moved = false;
  let startX = 0;
  let startY = 0;
  let originLeft = 0;
  let originTop = 0;
  let greetTimer;

  function greetByte() {
    widget.classList.add('is-greeting');
    clearTimeout(greetTimer);
    greetTimer = window.setTimeout(() => widget.classList.remove('is-greeting'), 900);
  }

  function showBubble() {
    bubble.textContent = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    bubble.classList.add('is-visible');
    window.setTimeout(() => bubble.classList.remove('is-visible'), 3200);
  }

  window.setTimeout(showBubble, 1500);
  window.setInterval(showBubble, 25000);

  widget.addEventListener('pointerenter', greetByte);

  widget.addEventListener('pointerdown', (e) => {
    dragging = true;
    moved = false;
    widget.classList.add('is-dragging');
    greetByte();
    const rect = widget.getBoundingClientRect();
    originLeft = rect.left;
    originTop = rect.top;
    startX = e.clientX;
    startY = e.clientY;
    widget.setPointerCapture(e.pointerId);
  });

  widget.addEventListener('pointermove', (e) => {
    greetByte();
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

  function positionChatNearWidget() {
    const rect = widget.getBoundingClientRect();
    const gap = 12;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const chatWidth = chat.offsetWidth;
    const chatHeight = chat.offsetHeight;

    let top = rect.top > vh / 2 ? rect.top - chatHeight - gap : rect.bottom + gap;
    top = Math.min(Math.max(8, top), vh - chatHeight - 8);

    let left = rect.left > vw / 2 ? rect.right - chatWidth : rect.left;
    left = Math.min(Math.max(8, left), vw - chatWidth - 8);

    chat.style.right = 'auto';
    chat.style.bottom = 'auto';
    chat.style.left = left + 'px';
    chat.style.top = top + 'px';
  }

  function toggleChat() {
    const opening = !chat.classList.contains('is-open');
    if (opening) {
      chat.classList.add('is-open');
      positionChatNearWidget();
      input.focus();
    } else {
      chat.classList.remove('is-open');
    }
    chat.setAttribute('aria-hidden', opening ? 'false' : 'true');
  }

  window.addEventListener('resize', () => {
    if (chat.classList.contains('is-open')) positionChatNearWidget();
  });

  closeBtn?.addEventListener('click', () => {
    chat.classList.remove('is-open');
    chat.setAttribute('aria-hidden', 'true');
  });

  function scrollMessagesToEnd() {
    messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });
  }

  function addMessage(from, text) {
    const el = document.createElement('div');
    el.className = `pet-msg from-${from}`;
    el.textContent = text;
    messages.appendChild(el);
    scrollMessagesToEnd();
    return el;
  }

  function addImageMessage(from, src, caption) {
    const el = document.createElement('div');
    el.className = `pet-msg pet-msg-image from-${from}`;
    const img = document.createElement('img');
    img.src = src;
    img.alt = caption || '';
    img.loading = 'lazy';
    el.appendChild(img);
    if (caption) {
      const cap = document.createElement('span');
      cap.className = 'pet-msg-caption';
      cap.textContent = caption;
      el.appendChild(cap);
    }
    messages.appendChild(el);
    scrollMessagesToEnd();
    return el;
  }

  function addActionMessage(from, label, href) {
    const el = document.createElement('div');
    el.className = `pet-msg from-${from}`;
    const link = document.createElement('a');
    link.className = 'pet-action-btn';
    link.href = href;
    if (/^https?:\/\//i.test(href)) {
      link.target = '_blank';
      link.rel = 'noreferrer';
    }
    link.textContent = label;
    el.appendChild(link);
    messages.appendChild(el);
    scrollMessagesToEnd();
    return el;
  }

  function addThemeMessage() {
    const el = document.createElement('div');
    el.className = 'pet-msg from-pet';
    el.appendChild(document.createTextNode('Pick a mood. I will remember it on this browser.'));
    const row = document.createElement('div');
    row.className = 'pet-theme-row';
    [
      ['Classic', 'classic'],
      ['Mint', 'mint'],
      ['Midnight', 'midnight'],
    ].forEach(([label, theme]) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pet-theme-btn';
      btn.textContent = label;
      btn.addEventListener('click', () => setTheme(theme));
      row.appendChild(btn);
    });
    el.appendChild(row);
    messages.appendChild(el);
    scrollMessagesToEnd();
    return el;
  }

  const PHOTO_INTENT = /\b(photo|picture|pic|selfie|face|look like|looks like|what does he look)\b/i;
  const CONTACT_INTENT = /\b(email|e-?mail|mail him|contact|reach out|get in touch|connect with him|send him a message)\b/i;
  const HIRE_INTENT = /\b(hire|hiring|recruit|recruiter|job|opportunity|work with|should i hire)\b/i;
  const THEME_INTENT = /\b(theme|dark|night|midnight|light|classic|green|mint|colour|color|background|mood)\b/i;
  const ACTION_INTENT = /\b(open|show|view|take me|go to|download|see)\b/i;
  const RESUME_INTENT = /\b(resume|cv)\b/i;
  const PROJECTS_INTENT = /\b(projects?|work samples?|portfolio work)\b/i;
  const BLOG_INTENT = /\b(blog|posts?|articles?|linkedin activity|notes)\b/i;
  const LINKEDIN_INTENT = /\b(linkedin|profile)\b/i;

  function draftParts() {
    const to = 'jiteshsolankii2005@gmail.com';
    const subject = 'Hey, wanted to connect!';
    const body = [
      'Hi Jitesh,',
      '',
      'I came across your portfolio and wanted to connect with you.',
      '',
      '[Add your message here]',
      '',
      'Looking forward to hearing from you!',
    ].join('\n');
    return { to, subject, body };
  }

  function mailDraftUrl() {
    const { to, subject, body } = draftParts();
    return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function gmailDraftUrl() {
    const { to, subject, body } = draftParts();
    const params = new URLSearchParams({
      view: 'cm',
      fs: '1',
      to,
      su: subject,
      body,
    });
    return `https://mail.google.com/mail/?${params.toString()}`;
  }

  function openContactDraft() {
    addActionMessage('pet', 'Open Gmail draft', gmailDraftUrl());
    addActionMessage('pet', 'Open email app draft', mailDraftUrl());
    const opened = window.open(gmailDraftUrl(), '_blank', 'noopener,noreferrer');
    if (!opened) {
      addMessage('pet', 'Your browser blocked the draft popup. Use one of the buttons above.');
    }
  }

  function openVisitorAction(url, blockedMessage) {
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    if (!opened && blockedMessage) addMessage('pet', blockedMessage);
  }

  function handlePageActions(question) {
    const wantsAction = ACTION_INTENT.test(question);

    if (RESUME_INTENT.test(question)) {
      addActionMessage('pet', 'Open resume PDF', 'assets/Jitesh_Solanki_Resume.pdf');
      if (wantsAction) openVisitorAction('assets/Jitesh_Solanki_Resume.pdf', 'Your browser blocked the resume popup. Use the button above.');
    }

    if (PROJECTS_INTENT.test(question)) {
      addActionMessage('pet', 'Open Projects', 'projects.html');
      if (wantsAction) window.location.href = 'projects.html';
    }

    if (BLOG_INTENT.test(question)) {
      addActionMessage('pet', 'Open Blog', 'blog.html');
      if (wantsAction) window.location.href = 'blog.html';
    }

    if (LINKEDIN_INTENT.test(question)) {
      const linkedinUrl = 'https://www.linkedin.com/in/jitesh-solanki-805598375/';
      addActionMessage('pet', 'Open LinkedIn', linkedinUrl);
      if (wantsAction) openVisitorAction(linkedinUrl, 'Your browser blocked LinkedIn. Use the button above.');
    }
  }

  function setTheme(theme) {
    const safeTheme = ['classic', 'mint', 'midnight'].includes(theme) ? theme : 'classic';
    document.documentElement.dataset.byteTheme = safeTheme;
    try {
      localStorage.setItem(THEME_KEY, safeTheme);
    } catch {}
    addMessage('pet', safeTheme === 'classic' ? 'Back to the original look.' : `Done. I changed the site mood to ${safeTheme}.`);
  }

  function handleLocalActions(question) {
    if (CONTACT_INTENT.test(question)) {
      openContactDraft();
    }

    if (HIRE_INTENT.test(question) && !CONTACT_INTENT.test(question)) {
      addActionMessage('pet', 'Email Jitesh about an opportunity', gmailDraftUrl());
    }

    handlePageActions(question);

    if (THEME_INTENT.test(question)) {
      if (/\b(dark|night|midnight)\b/i.test(question)) {
        setTheme('midnight');
      } else if (/\b(green|mint)\b/i.test(question)) {
        setTheme('mint');
      } else if (/\b(light|classic|reset|original)\b/i.test(question)) {
        setTheme('classic');
      } else {
        addThemeMessage();
      }
    }

    if (PHOTO_INTENT.test(question)) {
      addImageMessage('pet', 'assets/jitesh-profile-4k.jpg', 'That\'s Jitesh!');
    }
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    addMessage('user', question);
    input.value = '';
    handleLocalActions(question);

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
      addMessage('pet', "My cloud brain is slow right now, but I can still help with contact, theme, projects, resume, blog, and Jitesh's basics.");
    }
  });
})();
