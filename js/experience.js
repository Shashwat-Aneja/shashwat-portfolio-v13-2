(() => {
  const cursor = document.querySelector('[data-cursor]');
  const robot = document.querySelector('[data-guide-robot]');
  const label = document.querySelector('[data-guide-label]');
  const code = document.querySelector('[data-scroll-codebar]');
  const sections = [...document.querySelectorAll('[data-scroll-section]')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (cursor && matchMedia('(pointer:fine)').matches) {
    addEventListener('pointermove', e => {
      cursor.style.setProperty('--x', `${e.clientX}px`);
      cursor.style.setProperty('--y', `${e.clientY}px`);
    }, {passive:true});
    document.addEventListener('mouseover', e => {
      const interactive = e.target.closest('a,button,[role="button"],.project-preview,[data-workshop-station]');
      cursor.classList.toggle('is-active', !!interactive);
    });
  }

  const guideCopy = {work:'PROJECTS',workshop:'WORKSHOP / THINK',journey:'JOURNEY',contact:'EDGE / CONNECT',introduction:'ENTERING',top:'ORIGIN'};
  let currentSection = null;
  let tx = innerWidth * .78, ty = innerHeight * .30, x = tx, y = ty;
  let sectionIndex = 0;
  let robotState = 'idle';
  let stateUntil = 0;
  let finaleStarted = false;
  let robotHovered = false;
  let pointerX = innerWidth * .5, pointerY = innerHeight * .5;

  function updateProgress(){
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const value = Math.max(0, Math.min(1, scrollY / max));
    code?.style.setProperty('--scroll-progress', value.toFixed(4));
    code?.setAttribute('aria-valuenow', String(Math.round(value * 100)));
  }

  function updateContext(){
    const point = scrollY + innerHeight * .46;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const nearFinish = scrollY / maxScroll > .965;
    if (nearFinish && !finaleStarted) {
      finaleStarted = true;
      tx = innerWidth * .50;
      ty = innerHeight * .60;
    }
    currentSection = sections.find(s => point >= s.offsetTop && point < s.offsetTop + s.offsetHeight) || sections[0];
    sectionIndex = Math.max(0, sections.indexOf(currentSection));
    const id = currentSection?.id || 'introduction';
    if(label) label.textContent = guideCopy[id] || 'FOLLOWING';
    robot?.classList.toggle('is-lab', false);

    // Each section gets its own 2D "air lane". When its title enters the viewport,
    // the robot gently docks above it. Otherwise it keeps roaming through that lane.
    const heading = currentSection?.querySelector('.section-heading h2, .section-heading .mono, .work-heading');
    const rect = heading?.getBoundingClientRect();
    const headingVisible = rect && rect.bottom > 30 && rect.top < innerHeight - 30;
    const lanes = [
      [.18,.24],[.78,.22],[.30,.72],[.74,.64],[.20,.55],[.82,.42],[.46,.76],[.66,.26]
    ];
    const lane = lanes[sectionIndex % lanes.length];
    if (headingVisible) {
      tx = Math.max(90, Math.min(innerWidth - 90, rect.left + rect.width * .72));
      ty = Math.max(92, rect.top - 92);
    } else {
      tx = innerWidth * lane[0];
      ty = innerHeight * lane[1];
    }
  }

  function setRobotState(next, now){
    if (!robot || robotState === next) return;
    robotState = next;
    stateUntil = now + (next === 'rest' ? 2200 : next === 'idle' ? 1500 : 0);
    robot.classList.remove('is-idle','is-rest','is-moving','is-observing','is-celebrate');
    robot.classList.add(`is-${next}`);
    if(label){
      const stateCopy = {idle:'IDLE',rest:'RESTING',moving:'MOVING',observing:'OBSERVING',celebrate:'SIGNAL SENT'};
      label.textContent = stateCopy[next] || guideCopy[currentSection?.id] || 'FOLLOWING';
    }
  }

  function tick(now){
    const t = now * .001;
    const dist = Math.hypot(tx - x, ty - y);
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const nearFinish = scrollY / maxScroll > .965;
    if (reduce) {
      x = tx; y = ty;
      setRobotState('idle', now);
    } else {
      if (nearFinish) {
        x += (tx - x) * .035;
        y += (ty - y) * .035;
        if (Math.hypot(tx - x, ty - y) < 35) setRobotState('celebrate', now);
      }
      const docked = currentSection && currentSection.querySelector('.section-heading h2, .section-heading .mono, .work-heading')?.getBoundingClientRect();
      const headingVisible = docked && docked.bottom > 30 && docked.top < innerHeight - 30;
      if (!nearFinish && headingVisible && dist < 26) {
        setRobotState('rest', now);
      } else if (!nearFinish && dist > 120) {
        setRobotState('moving', now);
      } else if (!nearFinish && now < stateUntil && robotState === 'rest') {
        setRobotState('rest', now);
      } else if (!nearFinish) {
        setRobotState('idle', now);
      }

      // Smooth 2D navigation, plus independent drifting in both axes.
      const followEase = nearFinish ? .035 : (robotState === 'moving' ? .055 : .028);
      x += (tx - x) * followEase;
      y += (ty - y) * followEase;
      const roamX = nearFinish ? 0 : Math.sin(t * .63 + sectionIndex * 1.7) * 34 + Math.sin(t * .29) * 16;
      const roamY = nearFinish ? 0 : Math.cos(t * .79 + sectionIndex * .8) * 26 + Math.sin(t * .37) * 13;
      const bob = robotState === 'rest' ? Math.sin(t * 1.2) * 2 : Math.sin(t * 1.6) * 5;
      const finalX = Math.max(54, Math.min(innerWidth - 54, x + roamX));
      const finalY = Math.max(70, Math.min(innerHeight - 80, y + roamY + bob));
      robot?.style.setProperty('--rx', `${finalX}px`);
      robot?.style.setProperty('--ry', `${finalY}px`);
    }
    if (reduce) {
      robot?.style.setProperty('--rx', `${x}px`);
      robot?.style.setProperty('--ry', `${y}px`);
    }
    requestAnimationFrame(tick);
  }

  if (robot) {
    robot.addEventListener('pointerenter', () => {
      robotHovered = true;
      robot.classList.add('is-hovered');
      if (!finaleStarted) setRobotState('observing', performance.now());
    });
    robot.addEventListener('pointerleave', () => {
      robotHovered = false;
      robot.classList.remove('is-hovered');
      if (!finaleStarted) setRobotState('idle', performance.now());
    });
    robot.addEventListener('pointermove', e => {
      pointerX = e.clientX;
      pointerY = e.clientY;
      const rect = robot.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.max(-1, Math.min(1, (pointerX - cx) / 90));
      const dy = Math.max(-1, Math.min(1, (pointerY - cy) / 90));
      robot.style.setProperty('--look-x', dx.toFixed(3));
      robot.style.setProperty('--look-y', dy.toFixed(3));
    });
  }

  addEventListener('scroll', () => { updateContext(); updateProgress(); }, {passive:true});
  addEventListener('resize', () => { updateContext(); updateProgress(); }, {passive:true});
  updateContext();
  updateProgress();
  requestAnimationFrame(tick);
})();
