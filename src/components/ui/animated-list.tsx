'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  className?: string;
  itemClassName?: string;
  maxVisible?: number;
  animationDelay?: number;
}

export function AnimatedList<T>({
  items,
  renderItem,
  keyExtractor,
  className,
  itemClassName,
  maxVisible = 10,
  animationDelay = 200,
}: AnimatedListProps<T>) {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const prevItemsRef = useRef<T[]>([]);

  useEffect(() => {
    // Detect new items
    const prevKeys = new Set(prevItemsRef.current.map((item, i) => keyExtractor(item, i)));

    // Add new items with animation
    items.slice(0, maxVisible).forEach((item, i) => {
      const key = keyExtractor(item, i);
      if (!prevKeys.has(key)) {
        setTimeout(() => {
          setVisibleItems(prev => [item, ...prev].slice(0, maxVisible));
        }, animationDelay * i);
      }
    });

    setVisibleItems(items.slice(0, maxVisible));
    prevItemsRef.current = items;
  }, [items, maxVisible, animationDelay, keyExtractor]);

  return (
    <div className={cn('space-y-2', className)}>
      {visibleItems.map((item, index) => (
        <div
          key={keyExtractor(item, index)}
          className={cn(
            'animate-in slide-in-from-top-2 duration-300',
            itemClassName
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
