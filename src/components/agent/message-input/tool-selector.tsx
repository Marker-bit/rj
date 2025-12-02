import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toolViews } from "@/lib/ai/tools/toolset";
import { CheckIcon, WrenchIcon } from "lucide-react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
  const { allowedTools, setAllowedTools } = useToolSelection();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon-sm" variant="ghost" type="button">
          <WrenchIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Разрешенные инструменты</DropdownMenuLabel>
          {Object.entries(toolViews).map(([key, value]) => (
            <DropdownMenuItem
              className="grid grid-cols-[1fr_1rem] items-center gap-4"
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
              <span className="flex items-center gap-2">
                <value.icon className="size-4 opacity-72" />
                <span className="truncate">{value.title}</span>
              </span>
              {allowedTools.includes(key as AllowedTool) && (
                <CheckIcon className="size-4" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
