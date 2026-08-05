export const formatTimestamp = (date_string) => {
  const date = new Date(date_string);

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const formatDate = (date_string) => {
  const date = new Date(date_string);

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
};

export default { formatTimestamp, formatDate };
