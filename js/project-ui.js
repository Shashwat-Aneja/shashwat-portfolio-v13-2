(() => {
  const projects = window.PORTFOLIO_PROJECTS || [];
  const list = document.querySelector('[data-project-list]');
  const controls = document.querySelector('[data-project-controls]');
  const count = document.querySelector('[data-project-count]');
  const active = document.querySelector('[data-project-active]');
  if (!list || !controls) return;

  const tabs = ['ALL','AI / ML','DATA','SOFTWARE','GAMES','VR / 3D','HARDWARE','AUTOMATION','EXPERIMENTS','ARCHIVE'];
  const icon = p => `<span class="project-icon" aria-hidden="true">${p.icon}</span>`;
  const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  controls.innerHTML = tabs.map((tab, i) => `<button type="button" class="project-filter${i===0?' is-active':''}" data-filter="${tab}">${tab}<sup>${tab==='ALL'?projects.length:projects.filter(p=>p.categories.includes(tab)).length}</sup></button>`).join('');

  function render(filter='ALL') {
    const visible = filter === 'ALL' ? projects : projects.filter(p => p.categories.includes(filter));
    list.innerHTML = visible.map((p, i) => {
      const n = String(i+1).padStart(2,'0');
      return `<a class="project-row" href="https://github.com/Shashwat-Aneja/${encodeURIComponent(p.slug)}" target="_blank" rel="noopener noreferrer" data-project="${escapeHTML(p.name)}">
        <div class="project-row__index mono">${n}</div>
        <div class="project-row__icon">${icon(p)}</div>
        <div class="project-row__main"><span class="mono">${escapeHTML(p.type)}</span><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.description)}</p></div>
        <div class="project-row__meta"><span class="mono">${p.categories.join(' / ')}</span><strong>REPO ↗</strong></div>
      </a>`;
    }).join('');
    count.textContent = `${String(visible.length).padStart(2,'0')} PROJECTS`;
    active.textContent = `${filter} / ${visible.length}`;
    list.querySelectorAll('.project-row').forEach(row => {
      row.addEventListener('mouseenter', () => row.classList.add('is-hovered'));
      row.addEventListener('mouseleave', () => row.classList.remove('is-hovered'));
    });
  }
  controls.addEventListener('click', e => {
    const btn = e.target.closest('[data-filter]'); if (!btn) return;
    controls.querySelectorAll('.project-filter').forEach(x => x.classList.remove('is-active'));
    btn.classList.add('is-active'); render(btn.dataset.filter);
  });
  render();

  const strip = document.querySelector('[data-project-strip]');
  if (strip) {
    strip.addEventListener('mouseenter', e => { const card=e.target.closest('.project-preview'); if(card){strip.classList.add('has-hover');card.classList.add('is-expanded');} });
    strip.addEventListener('mouseleave', () => { strip.classList.remove('has-hover'); strip.querySelectorAll('.project-preview').forEach(c=>c.classList.remove('is-expanded')); });
    strip.addEventListener('mouseover', e => { const card=e.target.closest('.project-preview'); if(!card)return; strip.querySelectorAll('.project-preview').forEach(c=>c.classList.toggle('is-expanded', c===card)); });
  }
})();
