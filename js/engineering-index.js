(() => {
  const workshop = document.querySelector('#workshop');
  const journey = document.querySelector('#journey');
  if (!workshop || !journey) return;

  const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
  const nextCards = [...document.querySelectorAll('[data-project-strip] .project-preview')];
  const categories = ['AI / ML','DATA','SOFTWARE','GAMES','VR / 3D','HARDWARE','AUTOMATION','EXPERIMENTS','ARCHIVE'];
  const categoryCounts = categories.map(category => ({
    category,
    count: projects.filter(project => Array.isArray(project.categories) && project.categories.includes(category)).length
  })).filter(item => item.count > 0).sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
  const maxCount = Math.max(1, ...categoryCounts.map(item => item.count));
  const inDevelopment = nextCards.filter(card => card.querySelector('.project-preview__body > span')?.textContent.trim() === 'IN DEVELOPMENT').length;
  const workshopCases = document.querySelectorAll('[data-workshop-station]').length;

  const section = document.createElement('section');
  section.className = 'engineering-index';
  section.id = 'engineering-index';
  section.dataset.scrollSection = '';

  const nextItems = nextCards.map((card, index) => {
    const title = card.querySelector('h3')?.textContent.replace(/\s+/g, ' ').trim() || `Build ${index + 1}`;
    const description = card.querySelector('p')?.textContent.replace(/\s+/g, ' ').trim() || '';
    const status = card.querySelector('dl dd:last-child')?.textContent.trim() || 'BUILDING';
    return `<div class="engineering-index__item"><span class="engineering-index__item-index">${String(index + 1).padStart(2, '0')}</span><div><h3>${escapeHTML(title)}</h3><p>${escapeHTML(description)}</p></div><span class="engineering-index__status">${escapeHTML(status)}</span></div>`;
  }).join('');

  const bars = categoryCounts.map(item => `<div class="engineering-index__bar"><span class="engineering-index__bar-label">${escapeHTML(item.category)}</span><span class="engineering-index__track"><span class="engineering-index__fill" style="--fill:${(item.count / maxCount * 100).toFixed(2)}%"></span></span><span class="engineering-index__bar-count">${item.count}</span></div>`).join('');

  section.innerHTML = `
    <div class="section-heading">
      <h2 class="mono">04 / ENGINEERING INDEX</h2>
      <p>A factual layer behind the visual archive. Counts below are generated from the project catalogue and the work already present on this page.</p>
    </div>
    <div class="engineering-index__intro">
      <div class="engineering-index__lead">Builds are evidence.<br><em>The archive shows the range.</em></div>
      <p class="engineering-index__copy">The point is not to turn the portfolio into a dashboard. This layer makes the underlying engineering record easier to inspect without inventing metrics, dates or accomplishments that are not already documented.</p>
    </div>
    <div class="engineering-index__grid">
      <div class="engineering-index__map">
        <div class="engineering-index__map-head"><span class="mono">PROJECT DISTRIBUTION</span><span class="mono">${projects.length} CATALOGUED</span></div>
        <div class="engineering-index__bars">${bars}</div>
      </div>
      <div class="engineering-index__exploring">
        <div class="engineering-index__exploring-head"><span class="mono">CURRENTLY EXPLORING</span><span class="mono">NEXT / FIVE</span></div>
        <div class="engineering-index__items">${nextItems || '<p class="engineering-index__copy">No in-development work is currently listed.</p>'}</div>
      </div>
    </div>
    <div class="engineering-index__stats" aria-label="Portfolio counts">
      <div class="engineering-index__stat"><strong>${projects.length}</strong><span>Projects catalogued</span></div>
      <div class="engineering-index__stat"><strong>${categoryCounts.length}</strong><span>Disciplines represented</span></div>
      <div class="engineering-index__stat"><strong>${inDevelopment}</strong><span>Builds in development</span></div>
      <div class="engineering-index__stat"><strong>${workshopCases}</strong><span>Workshop cases</span></div>
    </div>
    <div class="engineering-index__proof">
      <span class="engineering-index__proof-label mono">EVIDENCE STANDARD</span>
      <p class="engineering-index__proof-copy"><strong>No invented proof.</strong> Technical claims should be backed by the repository, an actual demo, an implementation note, or project media. Until those artefacts are available, the interface deliberately labels work as a catalogue entry rather than manufacturing benchmarks, dates, user counts or performance claims.</p>
    </div>
  `;

  journey.parentNode.insertBefore(section, journey);

  const headingMap = [
    ['#journey .section-heading h2', '05 / JOURNEY'],
    ['.philosophy-section .section-heading h2', '06 / HOW I THINK'],
    ['#contact .contact-inner > .mono', '07 / CONTACT']
  ];
  headingMap.forEach(([selector, text]) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = text;
  });

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
  }
})();
