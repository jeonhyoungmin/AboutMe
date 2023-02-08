class observer_event {
  /**
   * @param {string} className observer의 대상이 되고 싶은 classname 작성 (.classname)
   * @description observer event 대상을 설정한 후, 원하는 기능 구현
   */
  constructor(className) {
    this._object = document.querySelectorAll(className);

    if (className === '.page_media') this.page_media();
    if (className === '.word_array') this.word_array();

    this._object.forEach((e) => {
      this._observer.observe(e);
    });
  }

  page_media() {
    this._observer = new IntersectionObserver((e) => {
      e.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transition = '2s';
        } else {
          e.target.style.opacity = '0';
        }
      });
    });
  }

  word_array() {
    this._observer = new IntersectionObserver((e) => {
      e.forEach((e, i) => {
        if (e.isIntersecting) {
          let time = 0.5;
          for (let t = 0; t < i; t++) {
            time += 0.05;
          }
          e.target.style.animation = `${time}s word_up_down`;
          e.target.style.opacity = '1';
        } else {
          e.target.style.opacity = '0';
          e.target.style.animation = '';
        }
      });
    });
  }
}

export default observer_event;
