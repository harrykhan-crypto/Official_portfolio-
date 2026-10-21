/* shared.js — nav, footer, page transitions, scroll reveals, card spotlight */
(function () {
  const page = document.body.dataset.page || 'home';
  const links = [['home','index.html','Home'],['services','services.html','Services'],['about','about.html','About me'],['portfolio','portfolio.html','Portfolio'],['contact','contact.html','Contact me']];

  /* nav */
  const slot = document.getElementById('site-nav');
  if (slot) {
    slot.innerHTML = `
    <header id="nav" class="relative z-30 mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-10">
      <a href="index.html" class="font-sora text-xl font-extrabold tracking-tight text-red-500">LOGO</a>
      <nav class="hidden items-center gap-10 text-sm font-semibold md:flex">
        ${links.map(l => `<a href="${l[1]}" class="nav-link ${l[0]===page?'active':''}">${l[2]}</a>`).join('')}
      </nav>
      <div class="flex items-center gap-3">
        <a href="contact.html" class="btn btn-primary magnetic !px-6 !py-2.5 text-xs">Hire Me</a>
        <button id="burger" class="grid h-10 w-10 place-items-center rounded-md border border-zinc-700 md:hidden" aria-label="Menu">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2.5"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
      </div>
    </header>
    <div id="mmenu" class="fixed inset-0 z-40 hidden flex-col items-center justify-center gap-8 bg-[#0d0d0f]/95 text-2xl font-bold backdrop-blur">
      ${links.map(l => `<a href="${l[1]}" class="${l[0]===page?'text-brand':'text-zinc-300'}">${l[2]}</a>`).join('')}
      <button id="mclose" class="mt-4 text-sm text-zinc-500">Close</button></div>`;
    const m = document.getElementById('mmenu');
    document.getElementById('burger').onclick = () => { m.classList.remove('hidden'); m.classList.add('flex'); };
    document.getElementById('mclose').onclick = () => { m.classList.add('hidden'); m.classList.remove('flex'); };
  }

  /* footer */
  const foot = document.getElementById('site-footer');
  if (foot) foot.innerHTML = `
    <footer class="relative z-10 mt-24 border-t border-zinc-800/80">
      <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-zinc-500 md:flex-row lg:px-10">
        <span>© ${new Date().getFullYear()} Hasnain Maqsood. Designed with care.</span>
        <div class="flex gap-6">${links.map(l => `<a class="hover:text-brand" href="${l[1]}">${l[2]}</a>`).join('')}</div>
      </div></footer>`;

  /* background glow that follows the mouse (index.html has its own) */
  if (!document.getElementById('glow')) {
    const g = document.createElement('div'); g.id = 'glow'; document.body.prepend(g);
    document.body.prepend(Object.assign(document.createElement('div'), { className: 'grid-bg' }));
    addEventListener('mousemove', e => gsap.to(g, { left: e.clientX, top: e.clientY, duration: .8, ease: 'power2.out' }));
  }

  /* page transition curtain */
  const c = document.createElement('div'); c.id = 'curtain'; c.innerHTML = '<b></b>'; document.body.appendChild(c);
  gsap.set(c, { yPercent: 0 });
  gsap.fromTo(c, { yPercent: 0 }, { yPercent: -100, duration: .8, ease: 'power4.inOut', delay: .05 });
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]'); if (!a) return;
    const h = a.getAttribute('href');
    if (!h || h.startsWith('#') || h.startsWith('http') || h.startsWith('mailto') || a.hasAttribute('download')) return;
    e.preventDefault();
    gsap.fromTo(c, { yPercent: 100 }, { yPercent: 0, duration: .6, ease: 'power4.inOut', onComplete: () => location.href = h });
  });
  addEventListener('pageshow', ev => { if (ev.persisted) gsap.set(c, { yPercent: -100 }); });

  /* scroll reveal (in AND out) + skill bars + counters */
  const io = new IntersectionObserver(es => es.forEach(en => {
    const el = en.target;
    el.classList.toggle('in', en.isIntersecting);
    if (el.dataset.w !== undefined) el.firstElementChild.style.width = en.isIntersecting ? el.dataset.w + '%' : '0';
  }), { threshold: .15 });
  document.querySelectorAll('.reveal,.bar').forEach(el => io.observe(el));

  const cio = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting || en.target._done) return; en.target._done = 1;
    const end = +en.target.dataset.count, o = { v: 0 };
    gsap.to(o, { v: end, duration: 2, ease: 'power2.out', onUpdate: () => en.target.textContent = Math.round(o.v) });
  }), { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => { if (!el.closest('#home')) cio.observe(el); });

  /* card spotlight + tilt */
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      card.style.setProperty('--mx', x + 'px'); card.style.setProperty('--my', y + 'px');
      if (card.dataset.tilt !== undefined) gsap.to(card, { rotationY: (x / r.width - .5) * 8, rotationX: -(y / r.height - .5) * 8, transformPerspective: 800, duration: .4 });
    });
    card.addEventListener('mouseleave', () => gsap.to(card, { rotationX: 0, rotationY: 0, duration: .6 }));
  });

  /* magnetic buttons */
  document.querySelectorAll('.magnetic').forEach(b => {
    b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .3 }); });
    b.addEventListener('mouseleave', () => gsap.to(b, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.4)' }));
  });
})();
