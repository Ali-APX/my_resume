(() => {
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem('portfolio-theme'); } catch {}
  root.dataset.theme = saved || root.dataset.theme || 'dark';
  const lang = root.lang || 'en';
  const accent = document.querySelector('meta[name="accent-color"]')?.content;
  if (/^#[\da-f]{6}$/i.test(accent || '')) {
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--accent-strong', accent);
  }
  document.querySelectorAll('[data-object-position]').forEach((image) => {
    if (/^\d{1,3}%\s+\d{1,3}%$/.test(image.dataset.objectPosition)) image.style.objectPosition = image.dataset.objectPosition;
  });
  document.querySelectorAll('a[href^="/"]').forEach((link) => {
    const url = new URL(link.href, location.href);
    if (!url.searchParams.has('lang')) url.searchParams.set('lang', lang);
    link.href = `${url.pathname}${url.search}${url.hash}`;
  });
  document.querySelector('#theme-toggle')?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch {}
  });
  document.querySelector('#lang-toggle')?.addEventListener('click', () => {
    const url = new URL(location.href);
    const current = root.lang || 'en';
    url.searchParams.set('lang', current === 'fa' ? 'en' : 'fa');
    location.href = url.toString();
  });
  const resumeSection = document.querySelector('#resume-download');
  const resumeButton = document.querySelector('.resume-generate');
  const resumeStatus = document.querySelector('.resume-status');
  let resumeBusy = false;
  resumeSection?.querySelectorAll('[data-resume-choice]').forEach(button => button.addEventListener('click', () => {
    if (resumeBusy) return;
    const group=button.dataset.resumeChoice;
    resumeSection.querySelectorAll(`[data-resume-choice="${CSS.escape(group)}"]`).forEach(option=>{
      const selected=option===button;option.classList.toggle('selected',selected);option.setAttribute('aria-pressed',String(selected));
    });
    if (resumeStatus) resumeStatus.textContent='';
  }));
  resumeButton?.addEventListener('click', async () => {
    if (resumeBusy) return;
    const choice=group=>resumeSection.querySelector(`[data-resume-choice="${CSS.escape(group)}"].selected`)?.dataset.value;
    const orientation=choice('Layout')||choice('چیدمان')||'portrait';
    const selectedLang=choice('Language')||choice('زبان')||lang;
    const format=choice('File format')||choice('قالب فایل')||'pdf';
    resumeBusy = true;
    resumeButton.disabled = true;
    resumeButton.setAttribute('aria-busy','true');
    const originalLabel=resumeButton.textContent.trim();
    resumeButton.textContent = selectedLang === 'fa' ? 'در حال آماده‌سازی…' : 'Preparing…';
    if (resumeStatus) resumeStatus.textContent = '';
    try {
      const response = await fetch(`/resume?lang=${selectedLang}&orientation=${orientation}&format=${format}`, {headers:{Accept:format==='pdf'?'application/pdf':'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}});
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || (selectedLang === 'fa' ? 'ساخت فایل انجام نشد.' : 'The resume could not be generated.'));
      }
      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition') || '';
      const encoded = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
      const fallback = disposition.match(/filename="?([^";]+)"?/i)?.[1];
      const filename = encoded ? decodeURIComponent(encoded) : fallback || `Resume-${selectedLang}-${orientation}.${format}`;
      const url = URL.createObjectURL(blob);
      const download = document.createElement('a'); download.href = url; download.download = filename; download.click();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      if (resumeStatus) resumeStatus.textContent = selectedLang === 'fa' ? 'فایل رزومه آماده شد.' : 'Your resume is ready.';
    } catch (error) {
      if (resumeStatus) resumeStatus.textContent = error.message;
    } finally {
      resumeBusy = false;
      resumeButton.disabled = false;
      resumeButton.removeAttribute('aria-busy');
      resumeButton.textContent=originalLabel;
    }
  });
})();
