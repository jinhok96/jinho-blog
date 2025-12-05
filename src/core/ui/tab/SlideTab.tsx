'use client';

import {
  Children,
  cloneElement,
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  isValidElement,
  type PropsWithChildren,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { motion, type Transition } from 'motion/react';

import { useIsMounted } from '@/core/hooks/internal';
import { Button, Show } from '@/core/ui';
import { cn } from '@/core/utils';

const DEFAULT_INDICATOR_CLASSNAME = 'bg-blue-1 pointer-events-none inset-0 absolute h-full';
const SPRING: Transition = { type: 'spring', damping: 30, stiffness: 300 };

type SlideTabContextValue = {
  selectedTabIndex: number;
  handleTabClick: (index: number) => void;
  registerRef: (index: number, ref: HTMLDivElement | null) => void;
  indicatorClassName?: string;
};

const SlideTabContext = createContext<SlideTabContextValue | undefined>(undefined);

type Props = PropsWithChildren<{
  selectedIndex?: number;
  defaultSelectedIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
  itemContainerClassName?: string;
  indicatorClassName?: string;
}>;

function SlideTab({
  children,
  selectedIndex: controlledIndex,
  defaultSelectedIndex = 0,
  onTabChange,
  className,
  itemContainerClassName,
  indicatorClassName,
}: Props) {
  const [internalIndex, setInternalIndex] = useState(defaultSelectedIndex);
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0, height: 0, top: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasInitialized = useRef(false);

  const isControlled = controlledIndex !== undefined;
  const selectedTabIndex = isControlled ? controlledIndex : internalIndex;

  const handleTabClick = useCallback(
    (index: number) => {
      if (!isControlled) setInternalIndex(index);
      onTabChange?.(index);
    },
    [isControlled, onTabChange],
  );

  const registerRef = useCallback((index: number, ref: HTMLDivElement | null) => {
    tabRefs.current[index] = ref;
  }, []);

  const getScrollOffsetLeft = (index: number, offsetLeft: number, offsetWidth: number) => {
    if (index === 0) return 0;
    return offsetLeft - offsetWidth / 4;
  };

  const updateIndicatorPosition = () => {
    const selectedTab = tabRefs.current[selectedTabIndex];
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

  const contextValue: SlideTabContextValue = useMemo(
    () => ({
      selectedTabIndex,
      handleTabClick,
      registerRef,
      indicatorClassName,
    }),
    [selectedTabIndex, handleTabClick, registerRef, indicatorClassName],
  );

  useLayoutEffect(() => {
    const selectedTab = tabRefs.current[selectedTabIndex];

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
    <SlideTabContext.Provider value={contextValue}>
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

          {childrenWithIndex}
        </div>
      </div>
    </SlideTabContext.Provider>
  );
}

type ItemProps = ComponentProps<typeof Button> & {
  index?: number;
  containerClassName?: string;
};

function Item({ children, index = 0, containerClassName, className, ...props }: ItemProps) {
  const context = useContext(SlideTabContext);
  const isMounted = useIsMounted();

  if (!context) throw new Error('SlideTab.Item은 반드시 SlideTab 내부에서 사용되어야 합니다.');

  const { selectedTabIndex, handleTabClick, registerRef, indicatorClassName } = context;
  const isSelected = selectedTabIndex === index;

  return (
    <div
      className={cn('relative shrink-0', containerClassName)}
      ref={el => registerRef(index, el)}
    >
      {/* 마운트 전 표시하는 정적 인디케이터 */}
      <Show when={!isMounted && isSelected}>
        <div className={cn(DEFAULT_INDICATOR_CLASSNAME, indicatorClassName)} />
      </Show>

      {/* 탭 버튼 */}
      <Button
        className={cn('flex-row-center justify-center', className)}
        onClick={() => handleTabClick(index)}
        {...props}
      >
        {children}
      </Button>
    </div>
  );
}

SlideTab.Item = Item;

export { SlideTab };
