class team_introduction_event {
  /**
   *@param {parentNode} parentNode 팀원 소개를 붙일 parentNode
   */
  constructor() {
    const co_worker = document.querySelectorAll('.team_introduction_box')[0]
      .children;
    let card_back_contents = document.querySelectorAll('.card_back_contents');
    let card_back_introduction = document.querySelectorAll(
      '.card_back_introduction'
    );
    let card_back_image = document.querySelectorAll('.card_back_image');

    console.log(card_back_contents);
    for (let i = 0; i < co_worker.length; i++) {
      co_worker[i].addEventListener('mouseover', (e) => {
        co_worker[i].style.transform = 'rotateY(180deg)';
        co_worker[i].style.transition = '2s';

        card_back_contents[i].style.transition = '1s';
        card_back_contents[i].style.transitionDelay = '0.5s';
        card_back_contents[i].style.animation =
          '2s linear left_rigth infinite alternate';

        card_back_introduction[i].style.opacity = '1';
        card_back_introduction[i].style.transition = '1s';
        card_back_introduction[i].style.transitionDelay = '0.5s';
        // card_back_introduction[i].style.transform =
        //   'rotateY(180deg) translateZ(100px)';

        card_back_image[i].style.opacity = '1';
        card_back_image[i].style.transition = '1s';
        card_back_image[i].style.transitionDelay = '0.5s';
        // card_back_image[i].style.animation =
        //   '2s linear left_rigth infinite alternate';
      });

      co_worker[i].addEventListener('mouseout', (e) => {
        co_worker[i].style.transform = 'rotateY(0deg)';
        co_worker[i].style.transition = '2s';

        card_back_contents[i].style.transform = 'translateZ(0px)';
        card_back_contents[i].style.transitionDelay = '0s';

        card_back_introduction[i].style.opacity = '0';
        card_back_introduction[i].style.transition = '1s';
        // card_back_introduction[i].style.transform =
        // 'rotateY(0deg) translateZ(0px)';

        card_back_introduction[i].style.transitionDelay = '0s';
        card_back_image[i].style.opacity = '0';
        card_back_image[i].style.transitionDelay = '0s';
        card_back_contents[i].style.animation = '';
      });
    }
  }
}

export default team_introduction_event;
