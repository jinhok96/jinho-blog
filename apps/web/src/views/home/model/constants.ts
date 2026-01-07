type HomeSectionIdLabelMapKey = 'CORE_SKILLS' | 'TECH_STACK' | 'CAREER' | 'PROJECTS' | 'BLOG' | 'EDUCATION' | 'CONTACT';

export const HOME_SECTION_ID_LABEL_MAP: Readonly<Record<HomeSectionIdLabelMapKey, { id: string; label: string }>> =
  Object.freeze({
    CORE_SKILLS: { id: 'skills-section', label: '핵심 역량' },
    TECH_STACK: { id: 'stack-section', label: '기술 스택' },
    CAREER: { id: 'career-section', label: '경력 사항' },
    PROJECTS: { id: 'projects-section', label: '프로젝트' },
    BLOG: { id: 'blog-section', label: '블로그' },
    EDUCATION: { id: 'education-section', label: '교육' },
    CONTACT: { id: 'contact-section', label: '연락처' },
  } as const);

export const HOME_SECTION_TAB_LIST: Readonly<
  Array<(typeof HOME_SECTION_ID_LABEL_MAP)[keyof typeof HOME_SECTION_ID_LABEL_MAP]>
> = Object.freeze([
  HOME_SECTION_ID_LABEL_MAP.CORE_SKILLS,
  HOME_SECTION_ID_LABEL_MAP.TECH_STACK,
  HOME_SECTION_ID_LABEL_MAP.CAREER,
  HOME_SECTION_ID_LABEL_MAP.PROJECTS,
  HOME_SECTION_ID_LABEL_MAP.BLOG,
  HOME_SECTION_ID_LABEL_MAP.EDUCATION,
  HOME_SECTION_ID_LABEL_MAP.CONTACT,
]);

type Career = {
  name: string;
  date: { start: string; end: string };
  info: string;
  job: string;
  works: string[];
};

export const CAREER_LIST: Career[] = [
  {
    name: '트립머니 주식회사',
    date: {
      start: '2025.07',
      end: '현재',
    },
    info: '핀테크 스타트업',
    job: '프론트엔드 & UI/UX 디자이너',
    works: [
      '키오스크 앱 UI/UX 디자인 및 프론트엔드 개발',
      '홈페이지 UI/UX 디자인 및 프론트엔드 개발',
      '어드민 UI/UX 리디자인 및 프론트엔드 개발',
      '백엔드 API 구현 및 유지보수',
      '레거시 코드 개선 (중복 코드 모듈화, 번들 최적화, 에러 처리 및 로깅 등)',
    ],
  },
];

type Education = {
  name: string;
  date: { start: string; end: string };
  info: string;
  works?: string[];
};

export const EDUCATION_LIST: Education[] = [
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
