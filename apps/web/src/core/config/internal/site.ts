// 사이트맵·canonical·OG URL이 상대 경로로 생성되는 것을 막기 위한 기본값
const DEFAULT_SITE_URL = 'https://jinho-blog.com';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
export const SITE_NAME = 'Jinho Blog';
export const SITE_DESCRIPTION = '프론트엔드 개발자 강진호입니다.';
export const AUTHOR_NAME = 'Jinho';
