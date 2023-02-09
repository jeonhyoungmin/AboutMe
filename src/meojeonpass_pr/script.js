import '../theme/meojeonpass_color.css';
import '../theme/fonts.css';
import './desktop.css';
import './mobile_horizontal.css';
import './mobile_vertical.css';
import entire_pr_page_maker from '../modules/entire_pr_box_maker.js';
import observer_event from '../modules/observer_event.js';
import { contents, team_member } from './meojeonpass_pr_contents.js';
import team_introduction_maker from '../modules/team_introduction_maker.js';
import team_introduction_event from '../modules/team_introduction_event.js';

class Meojeonpass_pr {
  constructor() {
    this._root = document.getElementById('root');
    this._loading = document.querySelector('.loading');
    this._loading_box = document.querySelector('.loading_box');
    this._hiding_box = document.querySelector('.hiding_box');
    this._title = document.querySelector('.title');
    this._contents = document.querySelector('.contents');
    this._time = 0;
    this.bottom = 20;

    // tag 생성
    this.pr_maker();
    this.team_introduction();

    // event
    this.observer_event();
    this.loading_animation();
    this.team_introduction_event();
  }

  pr_maker() {
    contents.forEach((e) => {
      new entire_pr_page_maker(this._root.children[1], e[0], e[1], e[2], e[3]);
    });
  }

  observer_event() {
    new observer_event('.page_media');
    new observer_event('.word_array');
  }

  team_introduction() {
    new team_introduction_maker(this._root.children[1], team_member);
  }

  team_introduction_event() {
    new team_introduction_event();
  }

  loading_animation() {
    const animation = () => {
      if (this._time === 0) {
        this._hiding_box.className = 'hiding_box_move';
      }
      if (this._time === 50) {
        this._loading_box.style.color = 'rgb(var(--main-1))';
      }
      if (this._time === 70) {
        this._loading_box.className = 'loading_box_move';
        this._root.style.display = 'contents';
      }
      if (this._time === 110) {
        this._title.style.position = 'fixed';
      }

      this._time++;
      const loadingAnimation = requestAnimationFrame(animation);

      if (this._time === 120) {
        this._loading.style.backgroundColor = 'rgb(var(--main-1))';
        this._loading_box.style.backgroundColor = 'rgb(var(--main-1))';
        this._loading_box.style.color = 'rgb(var(--main-4))';
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
  }
}

window.onload = () => {
  new Meojeonpass_pr();
};
