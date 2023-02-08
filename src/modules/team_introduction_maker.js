import { team_member } from '../meojeonpass_pr/meojeonpass_pr_contents.js';

class team_introduction_maker {
  /**
   *@param {parentNode} parentNode 팀원 소개를 붙일 parentNode
   */
  constructor(parentNode) {
    const team = document.createElement('div');
    const team_introduction = document.createElement('div');
    const team_introduction_box = document.createElement('div');

    for (let i = 0; i < team_member.length; i++) {
      let co_worker = document.createElement('div');

      co_worker.className = `co_worker_${i + 1}`;
      co_worker.innerHTML = `
      <div class="front" style="background-color:rgb(var(--team_member_background-${
        i + 1
      }">
        <div class="name">${team_member[i][0]}</div>
      </div>
      <div class="back">
        <div class="card_back_contents">
          <div class="card_back_introduction">
            <div>${team_member[i][0]}</div>
            <div>${team_member[i][1]}</div>
            <div>${team_member[i][2]}</div>
          </div>
          <img class="card_back_image" src=${team_member[i][3]} alt="jeon" />
        </div>
      </div>
          `;

      co_worker.style.display = 'flex';
      co_worker.style.justifyContent = 'center';
      co_worker.style.alignItems = 'center';
      co_worker.style.transformStyle = 'preserve-3d';

      team_introduction_box.appendChild(co_worker);
    }

    team.className = 'team';
    team_introduction.className = 'team_introduction';
    team_introduction_box.className = 'team_introduction_box';

    parentNode.appendChild(team);
    team.appendChild(team_introduction);
    team_introduction.appendChild(team_introduction_box);
  }
}

export default team_introduction_maker;
