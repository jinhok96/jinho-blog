import { BLOG_CATEGORIES, PROJECT_CATEGORIES, TECH_STACKS } from '@jinho-blog/shared';

import type { ContentSection } from '../src/types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

function validateRequiredString(data: Record<string, unknown>, field: string): ValidationError | null {
  const value = data[field];

  if (value === undefined || value === null) {
    return { field, message: '필수 필드입니다.' };
  }
  if (typeof value !== 'string') {
    return { field, message: `문자열이어야 합니다. (받은 타입: ${typeof value})` };
  }
  if (value.trim() === '') {
    return { field, message: '빈 문자열은 허용되지 않습니다.' };
  }
  return null;
}

function validateEnum<T extends string>(
  data: Record<string, unknown>,
  field: string,
  validValues: readonly T[],
): ValidationError | null {
  const stringError = validateRequiredString(data, field);
  if (stringError) return stringError;

  if (!(validValues as readonly string[]).includes(data[field] as string)) {
    return { field, message: `유효하지 않은 값입니다. (허용값: ${validValues.join(', ')})` };
  }
  return null;
}

function validateTechArray(data: Record<string, unknown>, field: string): ValidationError[] {
  const value = data[field];

  if (value === undefined || value === null) {
    return [{ field, message: '필수 필드입니다.' }];
  }
  if (!Array.isArray(value)) {
    return [{ field, message: '배열이어야 합니다.' }];
  }
  if (value.length === 0) {
    return [{ field, message: '빈 배열은 허용되지 않습니다.' }];
  }

  const invalidValues = value.filter(v => !(TECH_STACKS as readonly string[]).includes(v));
  if (invalidValues.length > 0) {
    return [{ field, message: `유효하지 않은 기술 스택: ${invalidValues.join(', ')}` }];
  }

  return [];
}

function validateBlogFrontmatter(data: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  const titleError = validateRequiredString(data, 'title');
  if (titleError) errors.push(titleError);

  const descriptionError = validateRequiredString(data, 'description');
  if (descriptionError) errors.push(descriptionError);

  const categoryError = validateEnum(data, 'category', BLOG_CATEGORIES);
  if (categoryError) errors.push(categoryError);

  return errors;
}

function validateProjectFrontmatter(data: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  const titleError = validateRequiredString(data, 'title');
  if (titleError) errors.push(titleError);

  const descriptionError = validateRequiredString(data, 'description');
  if (descriptionError) errors.push(descriptionError);

  const categoryError = validateEnum(data, 'category', PROJECT_CATEGORIES);
  if (categoryError) errors.push(categoryError);

  errors.push(...validateTechArray(data, 'tech'));

  const periodError = validateRequiredString(data, 'period');
  if (periodError) errors.push(periodError);

  const membersError = validateRequiredString(data, 'members');
  if (membersError) errors.push(membersError);

  return errors;
}

function validateLibraryFrontmatter(data: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = [];

  const titleError = validateRequiredString(data, 'title');
  if (titleError) errors.push(titleError);

  const descriptionError = validateRequiredString(data, 'description');
  if (descriptionError) errors.push(descriptionError);

  const categoryError = validateEnum(data, 'category', TECH_STACKS);
  if (categoryError) errors.push(categoryError);

  errors.push(...validateTechArray(data, 'tech'));

  return errors;
}

export function validateFrontmatter(data: Record<string, unknown>, section: ContentSection): ValidationResult {
  let errors: ValidationError[];

  switch (section) {
    case 'blog':
      errors = validateBlogFrontmatter(data);
      break;
    case 'projects':
      errors = validateProjectFrontmatter(data);
      break;
    case 'libraries':
      errors = validateLibraryFrontmatter(data);
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
