import './style.css';
import '../public/img/wallpaper.jpg';

const sizeUp = () => {
  let vwSize = 3;
  const volumnUP = setInterval(() => {
    vwSize = vwSize + 2;
    svg.style.width = vwSize + 'vw';
    svg.style.height = vwSize + 'vw';
    if (vwSize >= 100) {
      clearInterval(volumnUP);
      location.href = '/root.html';
    }
  }, 16);
};

const svg = document.getElementById('svg');
svg.addEventListener('dblclick', () => {
  sizeUp();
});
