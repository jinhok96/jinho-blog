import type { Library } from './types';

// Library 파일들을 직접 import
import ExampleLibrary, { metadata as exampleLibraryMeta } from '@/views/libraries/example-library';

const libraries: Library[] = [
  {
    slug: 'example-library',
    title: exampleLibraryMeta?.title || 'example-library',
    description: exampleLibraryMeta?.description || '',
    npm: exampleLibraryMeta?.npm || '',
    github: exampleLibraryMeta?.github || '',
    Component: ExampleLibrary,
  },
];

export async function getLibraries(): Promise<Library[]> {
  return libraries;
}

export async function getLibrary(slug: string): Promise<Library | null> {
  return libraries.find(l => l.slug === slug) || null;
}
