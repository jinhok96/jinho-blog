'use client';

import { useState } from 'react';

import { motion, useTransform } from 'motion/react';

import { useAnimatedValue } from '@/core/hooks';
import { Button } from '@/core/ui/button';
import { cn } from '@/core/utils';

const OPTIONS = [0, 25, 50, 75, 100];

export default function UseAnimatedValueDemo() {
  const [target, setTarget] = useState(0);
  const value = useAnimatedValue(target, { duration: 0.8 });
  const rounded = useTransform(value, v => Math.round(v));

  return (
    <div className="flex-col-center gap-4 rounded-2xl bg-background p-6">
      <motion.span className="font-subtitle-32 tabular-nums">{rounded}</motion.span>

      <div className="grid grid-cols-5 gap-1">
        {OPTIONS.map(v => (
          <Button
            key={v}
            size="sm"
            color="background"
            className={cn(target === v && 'bg-foreground text-background hover:bg-foreground')}
            onClick={() => setTarget(v)}
          >
            {v}
          </Button>
        ))}
      </div>
    </div>
  );
}
