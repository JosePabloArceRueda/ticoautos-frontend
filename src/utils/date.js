// Handles both ISO strings and Unix timestamps (number or numeric string)
export const parseDate = (val) => {
  if (!val) return null;
  const num = Number(val);
  return new Date(!isNaN(num) && num > 1000000000 ? num : val);
};

export const formatDate = (val, options = {}) => {
  const date = parseDate(val);
  if (!date || isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-CR', options);
};

export const formatDateTime = (val) => {
  const date = parseDate(val);
  if (!date || isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-CR', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

export const formatTime = (val) => {
  const date = parseDate(val);
  if (!date || isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
};
