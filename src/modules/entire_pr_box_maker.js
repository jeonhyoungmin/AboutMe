class entire_pr_page_maker {
  /**
   * @param {parentNode} parentNode 페이지 소개를 붙일 parentNode(ex contents)
   * @param {string} path 미디어 매체 경로 작성
   * @param {string} pageName 페이지 이름
   * @param {string} nickName 해당 페이지 제작자 이름 혹은 이명
   * @param {string} description 해당 페이지 설명
   * @param {boolean} video 미디어 매체가 비디오인지 아닌지 작성, 기본 값 = true
   * @description 프로젝트의 각 페이지를 소개하는 태그를 한 번에 생성하는 module, video와 image 각각에 적용
   * @description className 추가 및 변경 시, observer_event.js 함수 추가 및 변경 필요
   */
  constructor(parentNode, path, pageName, nickName, description, video = true) {
    // create tag
    const page = document.createElement('div');
    const entire_pr_box = document.createElement('div');
    const media_box = document.createElement('div');
    const pr_box = document.createElement('div');
    const page_name = document.createElement('div');
    const maker_nickname = document.createElement('div');
    const page_description = document.createElement('div');
    let page_media;
    if (video) {
      page_media = document.createElement('video');
    } else {
      page_media = document.createElement('div');
    }

    // 소개하는 글의 글자 생성
    this.pr_box_span_maker(page_name, pageName);
    this.pr_box_span_maker(maker_nickname, nickName);
    this.pr_box_span_maker(page_description, description);

    // attach className
    page.className = 'page';
    entire_pr_box.className = 'entire_pr_box';
    media_box.className = 'media_box';
    pr_box.className = 'pr_box';
    page_media.className = 'page_media';
    page_name.className = 'page_name';
    maker_nickname.className = 'maker_nickname';
    page_description.className = 'page_description';

    // mp4가 아니면 이미지 처리
    if (video) {
      page_media.setAttribute('src', path);
      page_media.autoplay = 'true';
      page_media.muted = 'true';
      page_media.loop = 'true';
    } else {
      page_media.setAttribute('src', path);
    }

    // 부모 태그에 append
    parentNode.appendChild(page);
    page.appendChild(entire_pr_box);
    entire_pr_box.appendChild(media_box);
    entire_pr_box.appendChild(pr_box);
    media_box.appendChild(page_media);
    pr_box.appendChild(page_name);
    pr_box.appendChild(maker_nickname);
    pr_box.appendChild(page_description);
    if (page === parentNode.children[0]) {
      page.style.borderRadius = '5% 5% 0 0';
    }
  }
  pr_box_span_maker(parent, contents) {
    for (let i = 0; i < contents.length; i++) {
      let word = document.createElement('span');
      word.className = 'word_array';
      word.innerHTML = `${contents[i]}`;
      parent.appendChild(word);
    }
  }
}

export default entire_pr_page_maker;
