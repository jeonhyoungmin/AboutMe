import './desktop.css';
import './tablet.css';
import './mobile.css';
import '../theme/fonts.css';
import '../theme/color.css';
import '../../public/video/intro.mp4';
import '../../public/video/congestion&info.mp4';
import '../../public/video/limit.mp4';
import '../../public/video/cctv.mp4';
import pr_page_maker from '../modules/entire_pr_box_maker.js';

class Meojeonpass_pr {
  constructor() {
    this._root = document.getElementById('root');
    this._loading = document.querySelector('.loading');
    this._loading_box = document.querySelector('.loading_box');
    this._hiding_box = document.querySelector('.hiding_box');
    this._meojeon = document.querySelector('.meojeon');
    this._contents = document.querySelector('.contents');
    this._time = 0;
    this.bottom = 20;

    const animation = () => {
      if (this._time === 0) {
        this._hiding_box.className = 'hiding_box_move';
      }
      if (this._time === 50) {
        this._loading_box.style.color = 'rgb(var(--green-1))';
      }
      if (this._time === 70) {
        this._loading_box.className = 'loading_box_move';
        this._root.style.display = 'contents';
      }
      if (this._time === 110) {
        this._meojeon.style.position = 'fixed';
      }

      this._time++;
      const loadingAnimation = requestAnimationFrame(animation);

      if (this._time === 120) {
        this._loading.style.backgroundColor = 'rgb(var(--green-1))';
        this._loading_box.style.backgroundColor = 'rgb(var(--green-1))';
        this._loading_box.style.color = 'rgb(var(--white))';
        this._loading_box.style.transition = '1s';
        this._loading.style.transition = '1s';
      }
      if (this._time === 140) {
        this._loading.style.display = 'none ';
        this._contents.className = 'contents_up';
        cancelAnimationFrame(loadingAnimation);
      }
    };
    requestAnimationFrame(animation);

    this.pr_maker();
    this.observer_event();
    this.scroll_event();
  }

  pr_maker() {
    new pr_page_maker(this._root.children[1], '../../public/video/intro.mp4');
    new pr_page_maker(
      this._root.children[1],
      '../../public/video/congestion&info.mp4'
    );
    new pr_page_maker(this._root.children[1], '../../public/video/limit.mp4');
    new pr_page_maker(this._root.children[1], '../../public/video/cctv.mp4');
  }
  observer_event() {
    this._page_media = document.querySelectorAll('.page_media');
    const observer = new IntersectionObserver((e) => {
      console.log(e);
      e.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transition = '1s';
        } else {
          e.target.style.opacity = '0';
          e.target.style.transition = '1s';
        }
      });
    });
    for (let i = 0; i < this._page_media.length; i++) {
      observer.observe(this._page_media[i]);
    }
  }
  scroll_event() {}
}

window.onload = () => {
  new Meojeonpass_pr();
};
