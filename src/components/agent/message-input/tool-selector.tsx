import { CheckIcon, WrenchIcon } from "lucide-react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { InputGroupButton } from "@/components/ui/input-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toolViews } from "@/lib/ai/tools/tool-views";

type AllowedTool = keyof typeof toolViews;
type AllowedTools = AllowedTool[];

interface StoreState {
  allowedTools: AllowedTools;
  setAllowedTools: (tools: AllowedTools) => void;
}

export const useToolSelection = create<StoreState>()(
  persist(
    (set) => ({
      allowedTools: Object.keys(toolViews) as AllowedTools,
      setAllowedTools: (tools: AllowedTools) => set({ allowedTools: tools }),
    }),
    {
      name: "tool-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function ToolSelector() {
  const { allowedTools: storedTools, setAllowedTools } = useToolSelection();
  const allowedTools = storedTools ?? [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <InputGroupButton
          size="icon-sm"
          variant="ghost"
          type="button"
          aria-label="Инструменты"
        >
          <WrenchIcon />
        </InputGroupButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="z-[120] w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 text-xs">
            Разрешенные инструменты
          </DropdownMenuLabel>
          {Object.entries(toolViews).map(([key, value]) => (
            <DropdownMenuItem
              className="grid grid-cols-[1fr_0.875rem] items-center gap-2 py-1.5 text-xs"
              key={key}
              onClick={(evt) => {
                evt.preventDefault();
                if (allowedTools.includes(key as AllowedTool)) {
                  setAllowedTools(allowedTools.filter((tool) => tool !== key));
                } else {
                  setAllowedTools([...allowedTools, key as AllowedTool]);
                }
              }}
            >
              <span className="flex min-w-0 items-center gap-2">
                <value.icon className="size-3.5 shrink-0 opacity-72" />
                <span className="truncate">{value.title}</span>
              </span>
              {allowedTools.includes(key as AllowedTool) && (
                <CheckIcon className="size-3.5" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
