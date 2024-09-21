"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDownFromLine, ArrowUpFromLine } from "lucide-react"

interface ExpandableTextProps {
  text: string
  limit?: number
}

export default function ExpandableText({
  text,
  limit = 30,
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpand = () => setIsExpanded(!isExpanded)

  const displayText = isExpanded ? text : text.slice(0, limit) + (text.length > limit ? "..." : "")

  return (
    <div>
      <span className="not-sr-only">{displayText}</span>
      <span className="sr-only">{text}</span>
      {text.length > limit && (
        <Button
          onClick={toggleExpand}
          variant="outline"
          size="sm"
          aria-expanded={isExpanded}
          aria-controls="expandable-text"
          className="flex items-center gap-2"
        >
          {isExpanded ? (
            <ArrowUpFromLine className="size-3" />
          ) : (
            <ArrowDownFromLine className="size-3" />
          )}
          {isExpanded ? "Меньше" : "Больше"}
        </Button>
      )}
    </div>
  )
}
