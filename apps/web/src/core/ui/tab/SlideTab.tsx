'use client';

import { type ComponentProps, type PropsWithChildren, useLayoutEffect, useRef, useState } from 'react';

import { motion, type Transition } from 'motion/react';

import { useIsMounted } from '@/core/hooks';
import { Button, Show } from '@/core/ui';
import { cn, createSharedState } from '@/core/utils';

const DEFAULT_INDICATOR_CLASSNAME = 'pointer-events-none inset-0 absolute h-full -z-10';
const SPRING: Transition = { type: 'spring', damping: 30, stiffness: 300 };

type SharedState = {
  selectedTabIndex: number;
  indicatorClassName?: string;
  tabRefs: (HTMLDivElement | null)[];
};

type SharedActions = {
  setSelectedTabIndex: (selectedTabIndex: number) => void;
  setIndicatorClassName: (indicatorClassName?: string) => void;
  registerRef: (index: number, ref: HTMLDivElement | null) => void;
};

const { Provider, useSharedState, useSharedActions } = createSharedState<SharedState, SharedActions>(
  { selectedTabIndex: 0, indicatorClassName: undefined, tabRefs: [] },
  set => ({
    setSelectedTabIndex: selectedTabIndex => set({ selectedTabIndex }),
    setIndicatorClassName: indicatorClassName => set({ indicatorClassName }),
    registerRef: (index, ref) =>
      set(state => {
        const newTabRefs = [...state.tabRefs];
        newTabRefs[index] = ref;
        return { tabRefs: newTabRefs };
      }),
  }),
);

type Props = PropsWithChildren<{
  selectedIndex: number;
  onTabChange?: (index: number) => void;
  className?: string;
  itemContainerClassName?: string;
  indicatorClassName?: string;
}>;

function SlideTabContent({
  children,
  selectedIndex,
  onTabChange,
  className,
  itemContainerClassName,
  indicatorClassName,
}: Props) {
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0, height: 0, top: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  const { selectedTabIndex, tabRefs } = useSharedState();
  const { setSelectedTabIndex, setIndicatorClassName } = useSharedActions();

  const getScrollOffsetLeft = (index: number, offsetLeft: number, offsetWidth: number) => {
    if (index === 0) return 0;
    return offsetLeft - offsetWidth / 4;
  };

  const updateIndicatorPosition = () => {
    const selectedTab = tabRefs[selectedTabIndex];
    if (!selectedTab) return;

    const container = scrollRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const tabRect = selectedTab.getBoundingClientRect();

    const width = tabRect.width;
    const left = tabRect.left - containerRect.left + container.scrollLeft;
    const height = tabRect.height;
    const top = tabRect.top - containerRect.top + container.scrollTop;

    setIndicatorStyle({ width, left, height, top });
  };

  // 인디케이터 스타일 업데이트
  useLayoutEffect(() => {
    setIndicatorClassName(indicatorClassName);
  }, [indicatorClassName]);

  // 탭 상태 업데이트
  useLayoutEffect(() => {
    if (selectedIndex === undefined) return;
    setSelectedTabIndex(selectedIndex);
  }, [selectedIndex]);

  // 공유 상태 변경 시 외부에 알림
  useLayoutEffect(() => {
    onTabChange?.(selectedTabIndex);
  }, [selectedTabIndex]);

  // 탭 인디케이터 업데이트
  useLayoutEffect(() => {
    const selectedTab = tabRefs[selectedTabIndex];

    // 선택한 탭으로 스크롤
    if (selectedTab && scrollRef.current) {
      const scrollOffsetLeft = getScrollOffsetLeft(selectedTabIndex, selectedTab.offsetLeft, selectedTab.offsetWidth);
      scrollRef.current.scroll(scrollOffsetLeft, 0);
    }

    // 인디케이터 위치 업데이트
    updateIndicatorPosition();

    // 초기화 완료
    if (!hasInitialized.current) hasInitialized.current = true;

    // 뷰포트 바뀔 때 업데이트
    window.addEventListener('resize', updateIndicatorPosition);

    const resizeObserver = new ResizeObserver(updateIndicatorPosition);
    if (scrollRef.current) resizeObserver.observe(scrollRef.current);

    return () => {
      window.removeEventListener('resize', updateIndicatorPosition);
      resizeObserver.disconnect();
    };
  }, [selectedTabIndex, tabRefs]);

  return (
    <div
      className={cn('relative scrollbar-minimal flex-row-center overflow-x-auto scroll-smooth', className)}
      ref={scrollRef}
    >
      <div className={cn('flex-row-center shrink-0', itemContainerClassName)}>
        {/* 슬라이드 인디케이터 */}
        <Show when={indicatorStyle.width > 0}>
          <motion.div
            className={cn(DEFAULT_INDICATOR_CLASSNAME, indicatorClassName)}
            initial={indicatorStyle}
            animate={indicatorStyle}
            transition={SPRING}
          />
        </Show>

        {children}
      </div>
    </div>
  );
}

type ItemProps = ComponentProps<typeof Button> & {
  index: number;
  containerClassName?: string;
};

function Item({ children, index, containerClassName, className, ...props }: ItemProps) {
  const isMounted = useIsMounted();

  const ref = useRef<HTMLDivElement>(null);
  const { selectedTabIndex, indicatorClassName } = useSharedState();
  const { setSelectedTabIndex, registerRef } = useSharedActions();

  const isSelected = selectedTabIndex === index;

  useLayoutEffect(() => {
    registerRef(index, ref.current);
  }, [index, ref, registerRef]);

  return (
    <div
      className={cn('relative shrink-0', containerClassName)}
      ref={ref}
    >
      {/* 마운트 전 표시하는 정적 인디케이터 */}
      <Show when={!isMounted && isSelected}>
        <div className={cn(DEFAULT_INDICATOR_CLASSNAME, indicatorClassName)} />
      </Show>

      {/* 탭 버튼 */}
      <Button
        className={cn('flex-row-center justify-center', className)}
        onClick={() => setSelectedTabIndex(index)}
        {...props}
      >
        {children}
      </Button>
    </div>
  );
}

function SlideTab(props: Props) {
  return (
    <Provider initState={{ indicatorClassName: props.indicatorClassName, selectedTabIndex: props.selectedIndex }}>
      <SlideTabContent {...props} />
    </Provider>
  );
}

SlideTab.Item = Item;

export { SlideTab };
