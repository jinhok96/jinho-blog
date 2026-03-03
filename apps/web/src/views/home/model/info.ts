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
      '키오스크 앱, 사내 어드민 웹, 홈페이지 등 자사 서비스 전반의 UI/UX 디자인, 프론트엔드 개발 및 유지보수 담당',
      '키오스크 스플래시 화면 기획·디자인·구현 (주간 평균 거래 건수 50.8% 상승)',
      '사내 어드민 빌드 최적화 및 캐시 전략 개선 (번들 크기 66% 감소, 로드 시간 68% 단축)',
      '주요 비즈니스 로직 모듈화, 로깅 세분화로 현장 장애 대응력 강화',
      '키오스크 앱 전면 UI/UX 리디자인 및 디자인 시스템 구축',
      '홈페이지 디자인 및 프론트엔드 개발',
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
