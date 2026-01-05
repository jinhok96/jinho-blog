'use client';

import {
  Children,
  cloneElement,
  type ComponentProps,
  type HTMLAttributes,
  isValidElement,
  type PropsWithChildren,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { motion, type Transition } from 'motion/react';

import { useIsMounted } from '@/core/hooks';
import { Button, Show } from '@/core/ui';
import { cn, createSharedState } from '@/core/utils';

const DEFAULT_INDICATOR_CLASSNAME = 'bg-blue-1 pointer-events-none inset-0 absolute h-full';
const SPRING: Transition = { type: 'spring', damping: 30, stiffness: 300 };

type SharedState = {
  selectedTabIndex: number;
  indicatorClassName?: string;
  tabRefs: (HTMLDivElement | null)[];
};

type SharedActions = {
  setSelectedTabIndex: (index: number) => void;
  registerRef: (index: number, ref: HTMLDivElement | null) => void;
};

const { Provider, useSharedState, useSharedActions } = createSharedState<SharedState, SharedActions>(
  { selectedTabIndex: 0, indicatorClassName: undefined, tabRefs: [] },
  set => ({
    setSelectedTabIndex: (index: number) => set({ selectedTabIndex: index }),
    registerRef: (index: number, ref: HTMLDivElement | null) =>
      set(state => {
        const newTabRefs = [...state.tabRefs];
        newTabRefs[index] = ref;
        return { tabRefs: newTabRefs };
      }),
  }),
);

type Props = PropsWithChildren<{
  selectedIndex?: number;
  defaultSelectedIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
  itemContainerClassName?: string;
  indicatorClassName?: string;
}>;

function SlideTabContent({
  children,
  selectedIndex: controlledIndex,
  defaultSelectedIndex = 0,
  onTabChange,
  className,
  itemContainerClassName,
  indicatorClassName: indicatorClassNameProp,
}: Props) {
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0, height: 0, top: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  const { selectedTabIndex, tabRefs } = useSharedState();
  const { setSelectedTabIndex } = useSharedActions();

  const isControlled = controlledIndex !== undefined;

  // defaultSelectedIndex 설정 (uncontrolled 모드)
  useLayoutEffect(() => {
    if (!isControlled) {
      setSelectedTabIndex(defaultSelectedIndex);
    }
  }, [isControlled, defaultSelectedIndex, setSelectedTabIndex]);

  // 외부 selectedIndex 변경 시 내부 상태 동기화 (controlled 모드)
  useLayoutEffect(() => {
    if (controlledIndex === undefined) return;
    setSelectedTabIndex(controlledIndex);
  }, [controlledIndex, setSelectedTabIndex]);

  // 공유 상태 변경 시 외부에 알림
  useLayoutEffect(() => {
    onTabChange?.(selectedTabIndex);
  }, [selectedTabIndex, onTabChange]);

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

  // 자식 요소에 index 전달
  const childrenWithIndex = useMemo(
    () =>
      Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;
        return cloneElement(child, { index } as HTMLAttributes<HTMLElement>);
      }),
    [children],
  );

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
  }, [selectedTabIndex]);

  return (
    <div
      className={cn('relative scrollbar-minimal flex-row-center overflow-x-auto scroll-smooth', className)}
      ref={scrollRef}
    >
      <div className={cn('flex-row-center shrink-0', itemContainerClassName)}>
        {/* 슬라이드 인디케이터 */}
        <Show when={indicatorStyle.width > 0}>
          <motion.div
            className={cn(DEFAULT_INDICATOR_CLASSNAME, indicatorClassNameProp)}
            initial={indicatorStyle}
            animate={indicatorStyle}
            transition={SPRING}
          />
        </Show>

        {childrenWithIndex}
      </div>
    </div>
  );
}

type ItemProps = ComponentProps<typeof Button> & {
  index?: number;
  containerClassName?: string;
};

function Item({ children, index = 0, containerClassName, className, ...props }: ItemProps) {
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
    <Provider>
      <SlideTabContent {...props} />
    </Provider>
  );
}

SlideTab.Item = Item;

export { SlideTab };
