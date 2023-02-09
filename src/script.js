import '../public/img/wallpaper.jpg';
import '../public/img/wallpaper_chrome.png';
import '../public/img/wallpaper_trashcan.png';
import '../public/img/wallpaper_vscode.png';
import '../public/img/wallpaper_youtube.png';
import './style.css';

class WallPaper {
  constructor() {
    const vscode = document.querySelector('.vscode');
    let time = 0;
    vscode.addEventListener('click', () => {
      const animation = () => {
        const run = requestAnimationFrame(animation);
        if (time === 0) {
          vscode.style.transform = 'translateZ(100px)';
          vscode.style.transition = '1s';
        }
        if (time === 55) {
          location.href = '/root.html';
          cancelAnimationFrame(run);
        }
        time++;
      };
      requestAnimationFrame(animation);
    });
  }
}

window.onload = () => {
  new WallPaper();
};
