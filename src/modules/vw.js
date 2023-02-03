export const vw = (px, viewport) => {
  const value = (px * 100) / viewport;
  return value + 'vw';
};
