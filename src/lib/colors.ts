import { BackgroundColor } from "@prisma/client"

export const backgroundColors = [
  {
    type: BackgroundColor.BLUE,
    color: "bg-blue-200 dark:bg-blue-800",
    background: "bg-blue-100/50 dark:bg-blue-900/50",
    outline: "outline-blue-200 dark:outline-blue-800",
  },
  {
    type: BackgroundColor.GREEN,
    color: "bg-green-200 dark:bg-green-800",
    background: "bg-green-100/50 dark:bg-green-900/50",
    outline: "outline-green-200 dark:outline-green-800",
  },
  {
    type: BackgroundColor.RED,
    color: "bg-red-200 dark:bg-red-800",
    background: "bg-red-100/50 dark:bg-red-900/50",
    outline: "outline-red-200 dark:outline-red-800",
  },
  {
    type: BackgroundColor.YELLOW,
    color: "bg-yellow-200 dark:bg-yellow-800",
    background: "bg-yellow-100/50 dark:bg-yellow-900/50",
    outline: "outline-yellow-200 dark:outline-yellow-800",
  },
]
