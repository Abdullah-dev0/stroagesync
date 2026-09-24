import type { ReactNode } from "react"

export function PageShell({ children }: { children: ReactNode }) {
  return <div className="w-full p-4 sm:p-7">{children}</div>
}

type PageHeaderProps = {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  )
}
