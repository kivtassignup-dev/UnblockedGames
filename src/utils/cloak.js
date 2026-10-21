export const CLOAK_PRESETS = [
  {
    id: 'default',
    name: 'UnblockHub (Default)',
    title: 'UnblockHub - HTML5 Unblocked Games',
    icon: '/favicon.svg'
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    icon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico'
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Classes',
    icon: 'https://ssl.gstatic.com/classroom/favicon.png'
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    icon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png'
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    title: 'World War II - Wikipedia',
    icon: 'https://en.wikipedia.org/static/favicon/wikipedia.ico'
  }
];

export function applyCloak(preset) {
  document.title = preset.title;
  let link = document.querySelector("link[rel~='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  link.href = preset.icon;
  try {
    localStorage.setItem('unblock_cloak_id', preset.id);
  } catch (e) {}
}

export function openAboutBlank(iframeUrl, title) {
  const win = window.open('about:blank', '_blank');
  if (!win) {
    alert('Popup was blocked by your browser. Please allow popups for about:blank stealth launch.');
    return;
  }
  win.document.title = title || 'Document';
  const iframe = win.document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.inset = '0';
  iframe.style.width = '100vw';
  iframe.style.height = '100vh';
  iframe.style.border = 'none';
  iframe.style.margin = '0';
  iframe.style.padding = '0';
  iframe.src = iframeUrl.startsWith('http') ? iframeUrl : window.location.origin + iframeUrl;
  win.document.body.style.margin = '0';
  win.document.body.style.overflow = 'hidden';
  win.document.body.appendChild(iframe);
}
