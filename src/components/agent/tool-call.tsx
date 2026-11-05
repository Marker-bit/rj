/* oxlint-disable eslint-plugin-jsx-a11y(prefer-tag-over-role) */
import type {
  ChatAddToolApproveResponseFunction,
  UITool,
  UIToolInvocation,
} from "ai";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircleIcon, TriangleAlertIcon, XIcon } from "lucide-react";
import { useEffect } from "react";
import { ToolConfirmation } from "@/components/agent/tool-confirmation";
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block";
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace";
import type { KnownEntities } from "@/lib/ai/message";
import type { ToolId, ToolView } from "@/lib/ai/tools/types";
import { revalidate } from "@/lib/actions/revalidate";

type BookDataMutationOutput = {
  success?: boolean;
  book?: { id?: string };
  collection?: { id?: string; books?: { id?: string }[] };
};

type BookDataMutationInput = {
  id?: string;
  bookIds?: string[];
};

const BOOK_DATA_MUTATION_TOOLS = new Set<ToolId>([
  "createBook",
  "editBook",
  "deleteBook",
  "createCollection",
  "deleteCollection",
  "addBookEvent",
  "undoBookEvent",
]);

const refreshedToolCallIds = new Set<string>();

const unique = (values: (string | undefined)[]) =>
  Array.from(
    new Set(values.filter((value): value is string => Boolean(value))),
  );

function getAffectedBookIds(
  toolName: ToolId,
  input: BookDataMutationInput,
  output: BookDataMutationOutput,
) {
  if (toolName === "createCollection" || toolName === "deleteCollection") {
    return unique([
      ...(input.bookIds ?? []),
      ...(output.collection?.books?.map((book) => book.id) ?? []),
    ]);
  }

  return unique([input.id, output.book?.id]);
}

function getAffectedCollectionIds(
  toolName: ToolId,
  input: BookDataMutationInput,
  output: BookDataMutationOutput,
) {
  if (toolName !== "createCollection" && toolName !== "deleteCollection") {
    return [];
  }

  return unique([input.id, output.collection?.id]);
}

export function ToolCall<TOOL extends UITool>({
  toolName,
  toolView,
  toolCall,
  knownEntities,
  addToolApprovalResponse,
}: {
  toolName: ToolId;
  toolView: ToolView;
  toolCall: UIToolInvocation<TOOL>;
  knownEntities?: KnownEntities;
  addToolApprovalResponse: ChatAddToolApproveResponseFunction;
}) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (toolCall.state !== "output-available") {
      return;
    }

    if (refreshedToolCallIds.has(toolCall.toolCallId)) {
      return;
    }

    if (!BOOK_DATA_MUTATION_TOOLS.has(toolName)) {
      return;
    }

    const input = toolCall.input as BookDataMutationInput;
    const output = toolCall.output as BookDataMutationOutput | undefined;
    if (output?.success === false) {
      return;
    }

    refreshedToolCallIds.add(toolCall.toolCallId);

    const affectedBookIds = getAffectedBookIds(toolName, input, output ?? {});
    const affectedCollectionIds = getAffectedCollectionIds(
      toolName,
      input,
      output ?? {},
    );

    void queryClient.invalidateQueries({ queryKey: ["books"] });
    void queryClient.invalidateQueries({ queryKey: ["events"] });
    void queryClient.invalidateQueries({ queryKey: ["collections"] });

    for (const bookId of affectedBookIds) {
      void queryClient.invalidateQueries({ queryKey: ["book", bookId] });
    }

    for (const collectionId of affectedCollectionIds) {
      void queryClient.invalidateQueries({
        queryKey: ["collection", collectionId],
      });
    }

    void revalidate("books");
  }, [
    queryClient,
    toolCall.input,
    toolCall.output,
    toolCall.state,
    toolCall.toolCallId,
    toolName,
  ]);

  if (toolCall.state === "approval-requested") {
    return (
      <ToolConfirmation
        invocation={toolCall}
        toolName={toolName}
        toolView={toolView}
        knownEntities={knownEntities}
        addToolApprovalResponse={addToolApprovalResponse}
      />
    );
  }

  const texts = toolView.texts;
  const output =
    toolCall.state === "output-available" ? toolCall.output : undefined;
  const outputFailure =
    toolCall.state === "output-available" &&
    typeof output === "object" &&
    output !== null &&
    !Array.isArray(output) &&
    (output as { success?: unknown }).success === false;
  const errorText =
    toolCall.state === "output-error"
      ? ((toolCall as { errorText?: string }).errorText ??
        "Не удалось выполнить инструмент")
      : outputFailure
        ? ((output as { error?: string }).error ??
          "Не удалось выполнить инструмент")
        : undefined;
  const isRunning =
    toolCall.state === "input-streaming" ||
    toolCall.state === "input-available" ||
    (toolCall.state === "approval-responded" && toolCall.approval.approved);
  const isError = Boolean(errorText);
  const isDenied =
    toolCall.state === "output-denied" ||
    (toolCall.state === "approval-responded" && !toolCall.approval.approved);

  const selectedText =
    errorText ??
    (isDenied
      ? (texts.deniedText ?? "Отклонено")
      : toolCall.state === "output-available"
        ? texts.successText
        : toolCall.state === "approval-responded"
          ? (texts.acceptedText ?? "Принято")
          : texts.loadingText);

  const icon = isRunning ? (
    <LoaderCircleIcon className="animate-spin" />
  ) : isError ? (
    <TriangleAlertIcon />
  ) : isDenied ? (
    <XIcon />
  ) : (
    <toolView.icon />
  );

  const line = (
    <TraceLine status={isRunning ? "running" : isError ? "error" : undefined}>
      <TraceIcon>{icon}</TraceIcon>
      <TraceTitle>{selectedText}</TraceTitle>
    </TraceLine>
  );

  if (isError) {
    return (
      <Trace>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock variant="destructive" size="sm">
              <CodeBlockContent wrap className="max-h-64">
                {errorText}
              </CodeBlockContent>
            </CodeBlock>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
    );
  }

  if (toolCall.state === "output-available") {
    return (
      <Trace>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <toolView.outputView
              input={toolCall.input as never}
              output={toolCall.output as never}
            />
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
    );
  }

  return <Trace>{line}</Trace>;
}
