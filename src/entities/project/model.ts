import type { Project } from './types';
import type { ProjectCategory } from '@/core/types/metadata';

import { getProjectListByCategory, projectsRegistry } from './registry.generated';

export async function getProjects(): Promise<Project[]> {
  return projectsRegistry;
}

export async function getProject(slug: string): Promise<Project | null> {
  return projectsRegistry.find(p => p.slug === slug) || null;
}

export async function getProjectsByCategory(category: ProjectCategory): Promise<Project[]> {
  return getProjectListByCategory(category);
}
