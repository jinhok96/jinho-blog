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
  HOME_SECTION_ID_LABEL_MAP.PROJECTS,
  HOME_SECTION_ID_LABEL_MAP.CAREER,
  HOME_SECTION_ID_LABEL_MAP.BLOG,
  HOME_SECTION_ID_LABEL_MAP.EDUCATION,
  HOME_SECTION_ID_LABEL_MAP.CONTACT,
]);
