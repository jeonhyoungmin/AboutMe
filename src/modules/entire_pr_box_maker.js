class pr_page_maker {
  /**
   * @param {parentNode} parentNode 페이지 소개를 붙일 parentNode(ex contents)
   * @description 프로젝트의 각 페이지를 소개하는 태그를 한 번에 생성하는 module, video와 image 각각에 적용
   */
  constructor(parentNode, path) {
    const page = document.createElement('div');
    const entire_pr_box = document.createElement('div');
    const video_media_box = document.createElement('div');
    const pr_box = document.createElement('div');
    const page_media = document.createElement('video');

    page.className = 'page';
    entire_pr_box.className = 'entire_pr_box';
    video_media_box.className = 'video_media_box';
    pr_box.className = 'pr_box';
    page_media.className = 'page_media';

    page_media.setAttribute('src', path);
    page_media.autoplay = 'true';
    page_media.muted = 'true';
    page_media.loop = 'true';

    parentNode.appendChild(page);
    page.appendChild(entire_pr_box);
    entire_pr_box.appendChild(video_media_box);
    entire_pr_box.appendChild(pr_box);
    video_media_box.appendChild(page_media);
    if (page === parentNode.children[0]) {
      page.style.borderRadius = '5% 5% 0 0';
    }
  }
}

export default pr_page_maker;
