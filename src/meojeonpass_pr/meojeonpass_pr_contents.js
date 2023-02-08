import '../../public/video/intro.mp4';
import '../../public/video/congestion&info.mp4';
import '../../public/video/limit.mp4';
import '../../public/video/cctv.mp4';
import '../../public/img/hipass_jeon.png';
import '../../public/img/hipass_lee.png';
import '../../public/img/hipass_yang.png';
import '../../public/img/hipass_hwang.png';
import '../../public/img/hipass_kim.png';

const contents = [
  ['../../public/video/intro.mp4', 'Intro', 'Jeon', '인트로'],
  [
    '../../public/video/congestion&info.mp4',
    'Congestion & Info',
    'Yang & Lee',
    '혼잡도와 돌발 안내',
  ],
  ['../../public/video/limit.mp4', 'Limit', 'Hwang', '제한속도'],
  ['../../public/video/cctv.mp4', 'cctv', 'Kim', '교통 카메라'],
];

const team_member = [
  ['Jeon', 'Intro', '조용한 서포터 !', '../../public/img/hipass_jeon.png'],
  ['Lee', 'Info', '개발도 재치있게 !', '../../public/img/hipass_lee.png'],
  [
    'Yang',
    'Congestion',
    '될때까지 컴퓨터랑 싸우는 !',
    '../../public/img/hipass_yang.png',
  ],
  [
    'Hwang',
    'Limit',
    '집 뿐만 아닌 코드도 정리 잘하는 !',
    '../../public/img/hipass_hwang.png',
  ],
  ['Kim', 'cctv', '흡수력이 빠른 !', '../../public/img/hipass_kim.png'],
];

export { contents, team_member };
