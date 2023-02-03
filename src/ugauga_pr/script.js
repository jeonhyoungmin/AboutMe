import './style.css';

class Ugauga_pr {
  constructor() {
    const root = document.getElementById('root');
    console.log(root.children[0]);

    root.addEventListener('click', (e) => {
      root.children[0].classList.toggle('test');
      console.log(e);
    });
  }
}

window.onload = () => {
  new Ugauga_pr();
};
