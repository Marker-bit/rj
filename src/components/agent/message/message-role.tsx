export function MessageRole({
  role,
}: {
  role: "system" | "user" | "assistant";
}) {
  return (
    <div className="font-bold text-xs mt-1">
      {role === "user" ? "Вы" : "Ассистент"}
    </div>
  );
}
