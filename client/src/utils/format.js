export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  });
};

export const formatNumber = (number) => {
  if (number === undefined || number === null) return '0';
  return number >= 1000 ? `${(number / 1000).toFixed(1)}k` : number.toString();
};

export const formatSize = (kb) => {
  if (kb === undefined || kb === null) return '0 KB';
  if (kb < 1024) return `${kb} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(1)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(1)} GB`;
};