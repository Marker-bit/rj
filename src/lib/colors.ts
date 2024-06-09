import { BackgroundColor } from "@prisma/client"

export const backgroundColors = [
  {
    type: BackgroundColor.BLUE,
    color: "bg-blue-200 dark:bg-blue-800",
    outline: "outline-blue-200 dark:outline-blue-800",
  },
  {
    type: BackgroundColor.GREEN,
    color: "bg-green-200 dark:bg-green-800",
    outline: "outline-green-200 dark:outline-green-800",
  },
  {
    type: BackgroundColor.RED,
    color: "bg-red-200 dark:bg-red-800",
    outline: "outline-red-200 dark:outline-red-800",
  },
  {
    type: BackgroundColor.YELLOW,
    color: "bg-yellow-200 dark:bg-yellow-800",
    outline: "outline-yellow-200 dark:outline-yellow-800",
  },
]
