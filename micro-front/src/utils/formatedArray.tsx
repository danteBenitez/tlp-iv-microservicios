import React from 'react';

export const formatArray = (
  array: any[],
  formatFn: (item: any, index: number) => React.ReactNode
): React.ReactNode[] => {
  return array.map(formatFn).reduce<React.ReactNode[]>((prev, curr, index, array) => {
    if (index === 0) {
      return [curr];
    } else if (index === array.length - 1) {
      return [...prev, ' y ', curr];
    } else {
      return [...prev, ', ', curr];
    }
  }, []);
};