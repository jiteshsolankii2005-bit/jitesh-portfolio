(function () {
  const posts = window.BLOG_POSTS || [];
  const grid = document.getElementById('blog-grid');
  const reader = document.getElementById('blog-reader');
  const track = document.getElementById('reader-track');
  const dotsEl = document.getElementById('reader-dots');
  const carouselWrap = document.getElementById('reader-carousel');

  let activeImages = [];
  let activeIndex = 0;

  function excerptOf(post) {
    const text = (post.paragraphs[0] || '').replace(/\n/g, ' ');
    return text.length > 140 ? text.slice(0, 137).trim() + '…' : text;
  }

  function fullTextOf(post) {
    return post.paragraphs.join('\n\n');
  }

  function cardHtml(post) {
    const hasImages = post.images.length > 0;
    const cover = post.images[0];
    const media = hasImages
      ? `<div class="blog-card-media"><img src="${cover}" alt="" loading="lazy">${
          post.images.length > 1 ? `<span class="blog-card-count">${post.images.length} photos</span>` : ''
        }</div>`
      : '';

    const title = hasImages ? `<h3 class="blog-card-title">${escapeHtml(post.title)}</h3>` : '';
    const bodyText = hasImages
      ? `<p class="blog-card-excerpt">${escapeHtml(excerptOf(post))}</p>
         <div class="blog-card-expand"><p class="blog-card-full">${escapeHtml(fullTextOf(post))}</p></div>
         <span class="blog-card-readmore">Read post →</span>`
      : `<p class="blog-card-excerpt blog-card-full">${escapeHtml(fullTextOf(post))}</p>`;

    return `
      <button class="blog-card${hasImages ? '' : ' blog-card--text-only'}" type="button" data-post-id="${post.id}">
        ${media}
        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span>${post.relativeTime || 'LinkedIn'}</span>
            ${post.isRepost ? '<span class="blog-repost-tag">· Repost</span>' : ''}
          </div>
          ${title}
          ${bodyText}
        </div>
      </button>
    `;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderGrid() {
    grid.innerHTML = posts.map(cardHtml).join('');
    grid.querySelectorAll('.blog-card').forEach((card) => {
      card.addEventListener('click', () => openPost(Number(card.dataset.postId)));
    });
  }

  function renderCarousel(images) {
    activeImages = images;
    activeIndex = 0;
    if (images.length === 0) {
      carouselWrap.hidden = true;
      return;
    }
    carouselWrap.hidden = false;
    track.innerHTML = images.map((src) => `<img src="${src}" alt="">`).join('');
    dotsEl.innerHTML = images.map((_, i) => `<span data-dot="${i}"></span>`).join('');
    updateCarousel();
  }

  function updateCarousel() {
    track.style.transform = `translateX(-${activeIndex * 100}%)`;
    dotsEl.querySelectorAll('span').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === activeIndex);
    });
  }

  function openPost(id) {
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    document.getElementById('reader-time').textContent = post.relativeTime || 'LinkedIn post';
    document.getElementById('reader-repost').hidden = !post.isRepost;
    document.getElementById('reader-title').textContent = post.title;
    document.getElementById('reader-text').innerHTML = post.paragraphs
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join('');

    const quotedEl = document.getElementById('reader-quoted');
    if (post.quoted && post.quoted.length) {
      quotedEl.hidden = false;
      quotedEl.innerHTML = post.quoted
        .map(
          (q) =>
            `<div class="blog-quoted-author">${escapeHtml(q.author)} wrote:</div><div class="blog-quoted-text">${escapeHtml(q.text)}</div>`
        )
        .join('');
    } else {
      quotedEl.hidden = true;
      quotedEl.innerHTML = '';
    }

    renderCarousel(post.images);
    reader.classList.add('is-open');
    reader.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeReader() {
    reader.classList.remove('is-open');
    reader.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  reader.querySelectorAll('[data-reader-close]').forEach((el) => el.addEventListener('click', closeReader));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && reader.classList.contains('is-open')) closeReader();
  });

  document.querySelector('[data-carousel-prev]').addEventListener('click', () => {
    if (!activeImages.length) return;
    activeIndex = (activeIndex - 1 + activeImages.length) % activeImages.length;
    updateCarousel();
  });
  document.querySelector('[data-carousel-next]').addEventListener('click', () => {
    if (!activeImages.length) return;
    activeIndex = (activeIndex + 1) % activeImages.length;
    updateCarousel();
  });
  dotsEl.addEventListener('click', (e) => {
    const dot = e.target.closest('[data-dot]');
    if (!dot) return;
    activeIndex = Number(dot.dataset.dot);
    updateCarousel();
  });

  renderGrid();
})();
