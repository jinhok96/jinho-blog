import { ERROR_CODES, type ErrorCode } from '@jinho-blog/shared';

export type ErrorUIMessage = {
  title: string;
  description: string;
  action?: string;
};

/**
 * 에러 코드별 사용자 대상 UI 메시지 (한국어)
 */
export const ERROR_UI_MESSAGES: Record<ErrorCode, ErrorUIMessage> = {
  // HTTP 에러
  [ERROR_CODES.BAD_REQUEST]: {
    title: '잘못된 요청입니다',
    description: '요청 형식이 올바르지 않습니다.',
    action: '다시 시도',
  },
  [ERROR_CODES.UNAUTHORIZED]: {
    title: '인증이 필요합니다',
    description: '로그인이 필요한 서비스입니다.',
    action: '로그인',
  },
  [ERROR_CODES.FORBIDDEN]: {
    title: '접근 권한이 없습니다',
    description: '이 리소스에 접근할 권한이 없습니다.',
    action: '홈으로 가기',
  },
  [ERROR_CODES.NOT_FOUND]: {
    title: '페이지를 찾을 수 없습니다',
    description: '요청하신 페이지가 존재하지 않습니다.',
    action: '홈으로 가기',
  },
  [ERROR_CODES.METHOD_NOT_ALLOWED]: {
    title: '허용되지 않는 요청입니다',
    description: '이 작업은 지원하지 않습니다.',
    action: '이전으로',
  },
  [ERROR_CODES.TIMEOUT]: {
    title: '요청 시간이 초과되었습니다',
    description: '네트워크 연결을 확인하고 다시 시도해주세요.',
    action: '다시 시도',
  },
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: {
    title: '서버 오류가 발생했습니다',
    description: '일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
    action: '다시 시도',
  },
  [ERROR_CODES.SERVICE_UNAVAILABLE]: {
    title: '서비스를 사용할 수 없습니다',
    description: '서버가 일시적으로 사용 불가 상태입니다.',
    action: '다시 시도',
  },

  // 비즈니스 로직 에러 - 콘텐츠
  [ERROR_CODES.POST_NOT_FOUND]: {
    title: '게시글을 찾을 수 없습니다',
    description: '요청하신 게시글이 존재하지 않거나 삭제되었습니다.',
    action: '블로그 목록으로',
  },
  [ERROR_CODES.PROJECT_NOT_FOUND]: {
    title: '프로젝트를 찾을 수 없습니다',
    description: '요청하신 프로젝트가 존재하지 않거나 삭제되었습니다.',
    action: '프로젝트 목록으로',
  },
  [ERROR_CODES.LIBRARY_NOT_FOUND]: {
    title: '라이브러리를 찾을 수 없습니다',
    description: '요청하신 라이브러리가 존재하지 않거나 삭제되었습니다.',
    action: '라이브러리 목록으로',
  },
  [ERROR_CODES.INVALID_CATEGORY]: {
    title: '잘못된 카테고리입니다',
    description: '유효하지 않은 카테고리입니다. 올바른 카테고리를 선택해주세요.',
    action: '목록으로 가기',
  },
  [ERROR_CODES.INVALID_SLUG]: {
    title: '잘못된 주소 형식입니다',
    description: '요청 주소가 올바른 형식이 아닙니다.',
    action: '홈으로 가기',
  },

  // 유효성 검증 에러
  [ERROR_CODES.INVALID_PAGINATION]: {
    title: '페이지 정보가 올바르지 않습니다',
    description: '유효하지 않은 페이지 번호입니다.',
    action: '첫 페이지로',
  },
  [ERROR_CODES.INVALID_SORT_OPTION]: {
    title: '정렬 옵션이 올바르지 않습니다',
    description: '지원하지 않는 정렬 방식입니다.',
    action: '기본 정렬로 보기',
  },
  [ERROR_CODES.INVALID_SEARCH_QUERY]: {
    title: '검색어가 올바르지 않습니다',
    description: '검색어 형식을 확인해주세요.',
    action: '다시 검색',
  },
  [ERROR_CODES.MISSING_REQUIRED_FIELD]: {
    title: '필수 항목이 누락되었습니다',
    description: '필수 입력 항목을 모두 입력해주세요.',
    action: '다시 시도',
  },
};

/**
 * 에러 코드로 UI 메시지 조회
 * 등록되지 않은 코드는 기본 메시지 반환
 */
export function getErrorMessage(code: ErrorCode): ErrorUIMessage {
  return (
    ERROR_UI_MESSAGES[code] || {
      title: '오류가 발생했습니다',
      description: '일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
      action: '다시 시도',
    }
  );
}
