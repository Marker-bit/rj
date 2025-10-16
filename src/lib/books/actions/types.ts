import { Book } from "@/lib/api-types";
import { LucideIcon } from "lucide-react";
import { FC } from "react";

export type Action = {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: ActionClick;
  /** Tooltip text */
  helpText?: string;
  /** Whether the button can be in a dropdown menu */
  isOptional?: boolean;
  /** Optional loader state (for async actions) */
  loading?: boolean;
};

export type ActionDialogComponent = FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  book: Book;
}>;
export type ActionClick =
  | { type: "function"; func: () => void }
  | { type: "dialog"; dialog: ActionDialogComponent };
