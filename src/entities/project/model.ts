import type { Project } from './types';

// Project 파일들을 직접 import
import ExampleProject, { metadata as exampleProjectMeta } from '@/views/projects/example-project';

const projects: Project[] = [
  {
    slug: 'example-project',
    title: exampleProjectMeta?.title || 'example-project',
    description: exampleProjectMeta?.description || '',
    tech: exampleProjectMeta?.tech || [],
    Component: ExampleProject,
  },
];

export async function getProjects(): Promise<Project[]> {
  return projects;
}

export async function getProject(slug: string): Promise<Project | null> {
  return projects.find(p => p.slug === slug) || null;
}
