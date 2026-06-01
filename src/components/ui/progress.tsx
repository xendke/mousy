import * as React from 'react'
import { cn } from '~/lib/utils'

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative h-2 w-full overflow-hidden rounded-full bg-gray-100',
      className
    )}
    {...props}
  >
    <div className="h-full w-1/2 animate-pulse rounded-full bg-brand" />
  </div>
))
Progress.displayName = 'Progress'

export { Progress }
export default Progress
