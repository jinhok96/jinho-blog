import type { TechBadgeProps } from '@/core/ui/badge/types';

import { TECH_STACK_MAP } from '@/core/map';
import { Badge } from '@/core/ui/badge/Badge';
import { TECH_BADGE_CLASSNAME_MAP } from '@/core/ui/badge/TechBadge.const';
import { cn } from '@/core/utils';

export function TechBadge({ className, tech, ...props }: TechBadgeProps) {
  return (
    <Badge
      className={cn(TECH_BADGE_CLASSNAME_MAP[tech], className)}
      {...props}
    >
      {TECH_STACK_MAP[tech]}
    </Badge>
  );
}
