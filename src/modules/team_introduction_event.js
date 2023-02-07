// class team_introduction_event {
//   /**
//  *@param {parentNode} parentNode 팀원 소개를 붙일 parentNode
//  */
//   constructor() {
//     const co_worker = document.querySelectorAll('.team_introduction_box')[0]
//       .children;
//     for (let i = 0; i < co_worker.length; i++) {
//       // if (i !== 2) {
//       co_worker[i].addEventListener('mouseover', (e) => {
//         this.team_member_pr_box_move(co_worker[2]);
//         this.team_leader_box_move(co_worker[3]);
//         console.log(i);
//       });
//       co_worker[i].addEventListener('mouseout', (e) => {
//         this.team_member_pr_box_reset(co_worker[2]);
//         this.team_leader_box_reset(co_worker[3]);
//         console.log(i);
//       });
//       // }
//     }
//   }

//   tag_finder(index) {
//     const co_worker = document.querySelectorAll('.team_introduction_box')[0]
//       .children;
//     return co_worker[index];
//   }

//   team_leader_box_move(object) {
//     object.style.gridColumn = '4/6';
//     object.style.transition = '0.5s';
//   }

//   team_leader_box_reset(object) {
//     object.style.gridColumn = '1/4';
//     object.style.transition = '0.5s';
//   }

//   team_member_pr_box_move(object) {
//     object.style.width = '100%';
//     object.style.gridColumn = '1/4';
//     object.style.transition = '0.5s';
//   }

//   team_member_pr_box_reset(object) {
//     object.style.width = '0%';
//     object.style.gridColumn = '';
//     object.style.transition = '0.5s';
//   }
// }

class team_introduction_event {
  /**
   *@param {parentNode} parentNode 팀원 소개를 붙일 parentNode
   */
  constructor() {
    const co_worker = document.querySelectorAll('.team_introduction_box')[0]
      .children;

    const root = document.getElementById('root');
    const contents_box = root.children[1];
    console.log(co_worker[0]);
    for (let i = 0; i < co_worker.length; i++) {
      co_worker[i].addEventListener('click', (e) => {
        // root.style.perspective = '800px';
        // contents_box.style.transform = 'rotateX(85deg)';
        // contents_box.style.transformStyle = 'preserve-3d';
        // contents_box.style.transformOrigin = 'bottom';
        // contents_box.style.transition = '3s';
        e.target.parentNode.parentNode.style.transform = 'rotateX(85deg)';
        e.target.parentNode.parentNode.style.transformStyle = 'preserve-3d';
        e.target.parentNode.parentNode.style.transformOrigin = 'bottom';
        e.target.parentNode.parentNode.style.transition = '3s';
        e.target.parentNode.style.perspective = '1000px';
        e.target.style.transformStyle = 'preserve-3d';
        e.target.style.transform = 'rotateX(-85deg)';
        e.target.style.transformOrigin = 'bottom';
        e.target.style.transition = '3s';

        console.log(e.target);
      });
      root.addEventListener('dblclick', (e) => {
        // root.style.perspective = '800px';
        // contents_box.style.transform = 'rotateX(0deg)';
        // contents_box.style.transformStyle = 'preserve-3d';
        // contents_box.style.transformOrigin = 'bottom';
        // contents_box.style.transition = '3s';
        e.target.parentNode.parentNode.style.transform = 'rotateX(0deg)';
        e.target.parentNode.parentNode.style.transformStyle = 'preserve-3d';
        e.target.parentNode.parentNode.style.transformOrigin = 'bottom';
        e.target.parentNode.parentNode.style.transition = '3s';
        // e.target.parentNode.style.perspective = '1000px';
        // e.target.parentNode.style.perspective = '800px';
        e.target.style.transformStyle = 'preserve-3d';
        e.target.style.transform = 'rotateX(0deg)';
        e.target.style.transformOrigin = 'bottom';

        e.target.style.transition = '3s';
      });
    }
  }
}

export default team_introduction_event;
