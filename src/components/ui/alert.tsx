import * as React from 'react'
import { cn } from '~/lib/utils'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'danger'
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-start gap-3 rounded-xl px-4 py-3 text-sm',
        variant === 'success' && 'bg-green-50 text-green-800',
        variant === 'danger' && 'bg-red-50 text-red-700',
        variant === 'default' && 'bg-gray-100 text-gray-800',
        className
      )}
      {...props}
    />
  )
)
Alert.displayName = 'Alert'

export { Alert }
