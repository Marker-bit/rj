import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { toolSetForUser } from "@/lib/ai/tools/toolset";
import { ChatAddToolApproveResponseFunction, UIToolInvocation } from "ai";
import { CheckIcon, XIcon } from "lucide-react";

export function ToolConfirmation({
  invocation,
  addToolApprovalResponse,
  ...props
}: {
  invocation: UIToolInvocation<any>;
  addToolApprovalResponse: ChatAddToolApproveResponseFunction;
} & React.ComponentPropsWithRef<typeof ButtonGroup>) {
  return (
    <ButtonGroup {...props}>
      <Button
        variant="outline"
        onClick={(evt) => {
          evt.stopPropagation();
          if (invocation.approval) {
            addToolApprovalResponse({
              id: invocation.approval.id,
              approved: true,
            });
          }
        }}
        size="sm"
      >
        <CheckIcon />
        Принять
      </Button>
      <Button
        variant="outline"
        onClick={(evt) => {
          evt.stopPropagation();
          if (invocation.approval) {
            addToolApprovalResponse({
              id: invocation.approval.id,
              approved: false,
            });
          }
        }}
        size="sm"
      >
        <XIcon />
        Отклонить
      </Button>
    </ButtonGroup>
  );
}
