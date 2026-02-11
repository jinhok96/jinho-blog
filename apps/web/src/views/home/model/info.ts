import type { Timeline } from '@/views/home/types';

import { LINKS } from '@/core/constants';

export const CAREER_LIST: Required<Timeline>[] = [
  {
    name: '트립머니 주식회사',
    date: {
      start: '2025.07',
      end: '2026.02',
    },
    info: '핀테크 스타트업',
    job: '프론트엔드 & UI/UX 디자이너',
    works: [
      '키오스크 앱 UI/UX 디자인 및 프론트엔드 개발',
      '키오스크 앱 Vue3+Vite+Electron 환경 마이그레이션',
      '홈페이지 UI/UX 디자인 및 프론트엔드 개발',
      '어드민 UI/UX 리디자인 및 프론트엔드 개발',
      '백엔드 API 구현 및 유지보수',
      '레거시 코드 개선 (중복 코드 모듈화, 번들 최적화, 에러 처리 및 로깅 등)',
    ],
  },
];

export const EDUCATION_LIST: Omit<Timeline, 'job'>[] = [
  {
    name: '코드잇 부트캠프',
    date: {
      start: '2023.12',
      end: '2024.06',
    },
    info: '프론트엔드',
  },
  {
    name: '세종대학교',
    date: {
      start: '2017.03',
      end: '2024.02',
    },
    info: '디자인이노베이션 전공, 소프트웨어 복수전공',
    works: [
      '시각디자인을 전공하여 타이포그래피, 그래픽디자인, UI/UX 디자인, 모션그래픽 학습',
      'C, Python, 자료구조, 알고리즘 등 기초 CS 지식 학습',
    ],
  },
  {
    name: '화성고등학교',
    date: {
      start: '2012.03',
      end: '2015.02',
    },
    info: '이과',
  },
];

type Contact = {
  label: string;
  value: string;
  href?: string;
};

export const CONTACT_LIST: Contact[] = [
  {
    label: '전화번호',
    value: '010-8975-9268',
  },
  {
    label: '이메일',
    value: 'jinhok96a@gmail.com',
  },
  {
    label: 'Github',
    value: '@jinhok96',
    href: LINKS.GITHUB,
  },
];
