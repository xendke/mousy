import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardFooter } from '~/components/ui/card'

interface ActionProps {
  link: string
  label: string
}

export const Action: React.FC<ActionProps> = ({ link, label }) => (
  <Link href={link} className="flex-1 py-3 text-center text-sm font-medium text-brand hover:bg-pastel-lavender transition-colors">
    {label}
  </Link>
)

interface EmptyProps {
  message: string
  actions?: React.ReactNode
}

const Empty: React.FC<EmptyProps> = ({ message, actions = null }) => (
  <Card>
    <CardContent>
      <p className="text-gray-500">{message}</p>
    </CardContent>
    {actions && (
      <CardFooter className="divide-x divide-gray-100 p-0">
        {actions}
      </CardFooter>
    )}
  </Card>
)

export default Empty
