import '../../public/img/move.png';
import '../../public/img/run.png';
import '../../public/img/jump.png';
import '../../public/img/mouse.png';
import '../../public/img/root_loading.png';

class howtouse {
  constructor() {
    const how_to_use = document.getElementById('howtouse');
    const loading = document.querySelector('.loading');
    loading.style.opacity = '0';
    loading.style.animation = '';
    loading.style.transition = '1s';
    loading.style.transitionDelay = '8s';
    how_to_use.addEventListener('click', () => {
      how_to_use.style.transform = 'rotateY(90deg)';
      how_to_use.style.transition = '1s';
    });
  }
}

export default howtouse;
