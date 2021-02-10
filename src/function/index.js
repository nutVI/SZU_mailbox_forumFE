/**
 * load style file
 * @param {String} url 
 */
export const loadStyle = (url) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = url;
  link.media = 'all';
  document.documentElement.appendChild(link);
}