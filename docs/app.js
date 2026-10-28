const REPOSITORY = 'https://github.com/holy-cursor/mascot-motion-director';
const grid = document.getElementById('gallery-grid');
const countLabel = document.getElementById('gallery-count');
const emptyState = document.getElementById('no-results');
const player = document.getElementById('player-dialog');
const dialogContent = document.getElementById('dialog-content');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let entries = [];
let currentFilter = 'All';
let query = '';
let activeVideo = null;

function safeLink(raw) {
  if (!raw) return '';
  try {
    const url = new URL(raw, window.location.href);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}

// The gallery also supports base64-packed MP4s for hosts where text-only uploads are
// available. Decoding occurs once per animation; video elements receive normal MP4 blobs.
const packedVideoCache = new Map();
function resolveMedia(raw) {
  const url = safeLink(raw);
  if (!url) return Promise.reject(new Error('Invalid media URL'));
  if (!url.split('?')[0].endsWith('.mp4.b64')) return Promise.resolve(url);
  if (!packedVideoCache.has(url)) {
    const promise = fetch(url)
      .then(resp => { if (!resp.ok) throw new Error('Media file unavailable'); return resp.text(); })
      .then(encoded => {
        const decoded = atob(encoded.trim());
        const bytes = new Uint8Array(decoded.length);
        for (let i = 0; i < decoded.length; i++) bytes[i] = decoded.charCodeAt(i);
        return URL.createObjectURL(new Blob([bytes], { type: 'video/mp4' }));
      });
    packedVideoCache.set(url, promise);
  }
  return packedVideoCache.get(url);
}

function node(tag, cls, text) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (text !== undefined) el.textContent = text;
  return el;
}
function makeVideo(item, cls, controls = false) {
  const video = document.createElement('video');
  video.className = cls;
  video.muted = !controls;
  video.loop = !controls;
  video.playsInline = true;
  video.preload = controls ? 'auto' : 'metadata';
  video.controls = controls;
  if (!controls && !prefersReducedMotion) video.autoplay = true;
  if (item.poster) video.poster = safeLink(item.poster);
  const source = document.createElement('source');
  source.type = item.media.toLowerCase().split('?')[0].endsWith('.webm') ? 'video/webm' : 'video/mp4';
  video.append(source);
  resolveMedia(item.media).then(url => {
    source.src = url;
    video.load();
    if (video.isConnected && !prefersReducedMotion && (controls || video.autoplay)) {
      video.play().catch(() => {});
    }
  }).catch(err => {
    video.dataset.error = 'true';
    video.setAttribute('aria-label', `Preview unavailable: ${item.title}`);
    console.warn('Gallery video could not load', item.title, err);
  });
  return video;
}
function expandIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 24 24');
  svg.setAttribute('aria-hidden','true');
  svg.innerHTML='<path d="M6 18 18 6M7 6h11v11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
  return svg;
}
function openPreview(item) {
  dialogContent.replaceChildren();
  const video = makeVideo(item, 'dialog-video', true);
  video.muted = true;
  const description = node('div', 'dialog-copy');
  description.append(node('div','eyebrow',`${item.category} / MASCOT MOTION`));
  description.append(node('h3', '', item.title));
  description.append(node('p', '', item.description || item.subtitle));
  description.append(node('div','dialog-meta', `By ${item.creator}`));
  if (item.link) {
    const link = node('a','btn btn-outline btn-modal','Creator / project ↗');
    link.href = safeLink(item.link); link.target='_blank'; link.rel='noopener noreferrer';
    description.append(link);
  }
  dialogContent.append(video, description);
  player.showModal();
  document.body.classList.add('no-scroll');
  activeVideo = video;
  if (!prefersReducedMotion) video.play().catch(() => {});
}
function closePreview() {
  if (!player.open) return;
  player.close();
}
player.addEventListener('close', () => {
  document.body.classList.remove('no-scroll');
  if (activeVideo) {activeVideo.pause();activeVideo = null;}
  dialogContent.replaceChildren();
});
document.getElementById('dialog-close').addEventListener('click',closePreview);
player.addEventListener('click', ev => { if (ev.target === player) closePreview(); });

const cardObserver = new IntersectionObserver((records) => {
  for (const record of records) {
    const video = record.target;
    if (prefersReducedMotion || !record.isIntersecting) video.pause();
    else video.play().catch(() => {});
  }
},{threshold:0.25});

function render() {
  const matching = entries.filter(item => {
    const matchCategory = currentFilter === 'All' || item.category === currentFilter;
    const matchQuery = `${item.title} ${item.subtitle} ${item.category} ${item.creator} ${item.description}`.toLowerCase().includes(query);
    return matchCategory && matchQuery;
  });
  grid.querySelectorAll('video').forEach(video => cardObserver.unobserve(video));
  grid.replaceChildren();
  emptyState.hidden = matching.length > 0;
  countLabel.textContent = String(entries.length).padStart(2,'0');
  for (const item of matching) {
    const card = node('article','work-card');
    const media = node('div','work-media');
    const video = makeVideo(item,'work-video');
    media.append(video,node('div','work-media-shade'),node('div','work-tag',item.category));
    const expand = node('button','work-expand');
    expand.type='button'; expand.setAttribute('aria-label',`Preview ${item.title}`);
    expand.append(expandIcon());
    media.append(expand);
    const info = node('div','work-info');
    const infoInner = node('div');
    infoInner.append(node('h3','',item.title),node('p','',item.subtitle));
    info.append(infoInner,node('span','work-credit',item.creator));
    card.append(media,info);
    card.addEventListener('click',()=>openPreview(item));
    cardObserver.observe(video);
    grid.append(card);
  }
}

for (const btn of document.querySelectorAll('[data-filter]')) {
  btn.addEventListener('click',()=> {
    currentFilter = btn.dataset.filter;
    for(const other of document.querySelectorAll('[data-filter]')){
      other.classList.toggle('active', other===btn);
      other.setAttribute('aria-pressed',String(other===btn));
    }
    render();
  });
}
document.getElementById('search').addEventListener('input', e => {query=e.target.value.trim().toLowerCase();render();});

fetch('./gallery.json')
  .then(resp => {if(!resp.ok) throw new Error('Could not load gallery data');return resp.json();})
  .then(data => {
    if(!Array.isArray(data)) throw new Error('Gallery data must be an array');
    entries = data.filter(item=>item && item.title && item.media && safeLink(item.media))
      .sort((a,b)=>Number(Boolean(b.featured))-Number(Boolean(a.featured)));
    render();
  }).catch(() => {
    emptyState.hidden=false;
    emptyState.textContent='Could not load the showcase. Try reloading the page.';
  });

const submissionForm = document.getElementById('submission-form');
submissionForm.addEventListener('submit',ev=>{
  ev.preventDefault();
  if(!submissionForm.reportValidity()) return;
  const data = new FormData(submissionForm);
  const title = String(data.get('title')||'').trim();
  const creator = String(data.get('creator')||'').trim();
  const video = safeLink(String(data.get('video')||'').trim());
  const linkInput = String(data.get('link')||'').trim();
  const link = linkInput ? safeLink(linkInput) : '';
  if (!title || !creator || !video || (linkInput && !link)) {alert('Please enter valid names and http(s) links.');return;}
  const category=String(data.get('category')||'Mascot');
  const description=String(data.get('description')||'').trim();
  const issueURL = new URL(`${REPOSITORY}/issues/new`);
  issueURL.searchParams.set('template','showcase.yml');
  issueURL.searchParams.set('title',`[Showcase] ${title}`);
  issueURL.searchParams.set('creator',creator);
  issueURL.searchParams.set('category',category);
  issueURL.searchParams.set('video',video);
  if(link) issueURL.searchParams.set('project',link);
  if(description) issueURL.searchParams.set('description',description);
  // Same-tab navigation: issue draft is retained even when browser blocks popups.
  window.location.assign(issueURL.toString());
});
if(prefersReducedMotion){const heroVideo=document.getElementById('hero-video');heroVideo.pause();heroVideo.removeAttribute('autoplay');}