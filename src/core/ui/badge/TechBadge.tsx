import type { TechBadgeProps } from '@/core/ui/badge/types';

import { Badge } from '@/core/ui/badge/Badge';
import { TECH_CLASSNAME_MAP, TECH_NAME_MAP } from '@/core/ui/badge/TechBadge.const';
import { cn } from '@/core/utils';

export function TechBadge({ className, tech, ...props }: TechBadgeProps) {
  return (
    <Badge
      className={cn(TECH_CLASSNAME_MAP[tech], className)}
      {...props}
    >
      {TECH_NAME_MAP[tech]}
    </Badge>
  );
}
