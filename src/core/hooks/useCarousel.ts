import { useEffect, useState } from 'react';

function getPoppedList<T>(list: T[]): T[] {
  const newList = [...list];
  newList.pop();
  return newList;
}

function getShiftedList<T>(list: T[]): T[] {
  const newList = [...list];
  newList.shift();
  return newList;
}

function getPreviousIndex(index: number, length: number): number {
  return (index - 1 + length) % length;
}

function getNextIndex(index: number, length: number): number {
  return (index + 1) % length;
}

type UseCarousel<T> = {
  carouselIndex: {
    left: number;
    center: number;
    right: number;
  };
  carouselList: T[];
  setCarouselList: (list: T[]) => void;
  previous: () => T[];
  next: () => T[];
};

export function useCarousel<T>(list: T[], count: number): UseCarousel<T> {
  const getIndex = (count: number) => {
    return {
      left: list.length - Math.floor(count / 2),
      center: 0,
      right: Math.floor(count / 2),
    };
  };

  const getCarouselList = (thisList: T[], { left, center, right }: { left: number; center: number; right: number }) => {
    return [...thisList.slice(left, thisList.length), ...thisList.slice(center, right + 1)];
  };

  const [carouselIndex, setCarouselIndex] = useState(getIndex(count));
  const [carouselList, setCarouselList] = useState(getCarouselList(list, carouselIndex));

  const previous = () => {
    const newList = getPoppedList(carouselList);

    const newIndex = {
      left: getPreviousIndex(carouselIndex.left, list.length),
      center: getPreviousIndex(carouselIndex.center, list.length),
      right: getPreviousIndex(carouselIndex.right, list.length),
    };

    setCarouselIndex(newIndex);

    newList.unshift(list[newIndex.left]);
    setCarouselList(newList);

    return newList;
  };

  const next = () => {
    const newList = getShiftedList(carouselList);

    const newIndex = {
      left: getNextIndex(carouselIndex.left, list.length),
      center: getNextIndex(carouselIndex.center, list.length),
      right: getNextIndex(carouselIndex.right, list.length),
    };

    setCarouselIndex(newIndex);

    newList.push(list[newIndex.right]);
    setCarouselList(newList);

    return newList;
  };

  useEffect(() => {
    const newIndex = getIndex(count);
    setCarouselIndex(newIndex);

    const newList = getCarouselList(list, newIndex);
    setCarouselList(newList);
  }, [list, count]);

  return { carouselIndex, carouselList, setCarouselList, previous, next };
}
