'use client';

import { useLayoutEffect, useRef, useState } from 'react';

import { SlideTab } from '@/core/ui';
import { cn } from '@/core/utils';

import { HOME_SECTION_TAB_LIST } from '@/views/home/model';

const tabs = HOME_SECTION_TAB_LIST;

export function HomeSlideTab() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const visibleSectionsRef = useRef<Set<string>>(new Set());
  const isScrollingByClick = useRef(false);

  const handleTabChange = (index: number) => {
    setSelectedIndex(index);
  };

  const handleTabClick = (index: number) => {
    isScrollingByClick.current = true;
    handleTabChange(index);

    const target = document.getElementById(tabs[index].id);
    if (!target) {
      isScrollingByClick.current = false;
      return;
    }

    const handleScrollEnd = () => {
      isScrollingByClick.current = false;
      window.removeEventListener('scrollend', handleScrollEnd);
    };

    window.addEventListener('scrollend', handleScrollEnd, { once: true });
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useLayoutEffect(() => {
    if (!tabs.length) return;

    const sections = tabs.map(item => document.getElementById(item.id)).filter(Boolean);

    const observer = new IntersectionObserver(
      entries => {
        if (isScrollingByClick.current) return;

        entries.forEach(entry => {
          if (entry.isIntersecting) {
            visibleSectionsRef.current.add(entry.target.id);
          } else {
            visibleSectionsRef.current.delete(entry.target.id);
          }
        });

        const firstVisibleIndex = tabs.findLastIndex(tab => visibleSectionsRef.current.has(tab.id));
        if (firstVisibleIndex !== -1) {
          handleTabChange(firstVisibleIndex);
        }
      },
      {
        rootMargin: '0px',
        threshold: 0.2,
      },
    );

    sections.forEach(section => !!section && observer.observe(section));

    return () => observer.disconnect();
  }, [tabs]);

  return (
    <div className="pointer-events-none sticky top-(--height-header) right-0 left-0 z-10 w-full px-layout">
      <SlideTab
        selectedIndex={selectedIndex}
        onTabChange={handleTabChange}
        className={`
          pointer-events-auto mx-auto scrollbar-hidden w-fit max-w-full rounded-full bg-foreground-2 p-2
          backdrop-blur-md
        `}
        indicatorClassName="rounded-full bg-white"
      >
        {tabs.map(({ id, label }, index) => (
          <SlideTab.Item
            key={id}
            color="background"
            size="sm"
            className={cn(
              'text-foreground-7',
              selectedIndex === index && 'text-foreground dark:text-background',
              selectedIndex !== index && 'hover:text-foreground',
            )}
            rounded
            disableHover
            onClick={() => handleTabClick(index)}
          >
            {label}
          </SlideTab.Item>
        ))}
      </SlideTab>
    </div>
  );
}
