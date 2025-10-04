import type React from "react"
interface ContactInfoProps {
  icon: React.ReactNode
  title: string
  content: string
  href?: string
}

export function ContactInfo({ icon, title, content, href }: ContactInfoProps) {
  const ContentWrapper = href ? "a" : "div"
  const wrapperProps = href
    ? {
        href,
        className:
          "flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/5",
      }
    : {
        className: "flex items-start gap-4 rounded-lg border border-border bg-card p-4",
      }

  return (
    <ContentWrapper {...wrapperProps}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="mb-1 font-semibold text-card-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground break-words">{content}</p>
      </div>
    </ContentWrapper>
  )
}
