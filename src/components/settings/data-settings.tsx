"use client";

import { Download } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { exportData } from "@/lib/actions/export";
import { exportDefaultItems } from "@/lib/export";

export function DataSettings() {
  const id = useId();
  const [items, setItems] = useState(
    exportDefaultItems.map((item) => ({
      ...item,
      checked: item.defaultChecked,
    })),
  );
  const [format, setFormat] = useState<"json" | "yaml">("json");
  const [loading, setLoading] = useState(false);

  async function downloadExport() {
    setLoading(true);
    try {
      const result = await exportData({
        data: items.filter((item) => item.checked).map((item) => item.value),
        format,
      });
      if (!result.data) throw new Error(result.error || "Неизвестная ошибка");

      const bytes = Uint8Array.from(atob(result.data), (byte) =>
        byte.charCodeAt(0),
      );
      const blob = new Blob([bytes], {
        type: format === "json" ? "application/json" : "application/x-yaml",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `export-${new Date().toISOString()}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      toast.error("Не удалось скачать данные", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      aria-labelledby={id + "-title"}
      className="space-y-4 rounded-lg border p-4"
    >
      <div className="space-y-1">
        <h3 id={id + "-title"} className="font-medium">
          Экспорт данных
        </h3>
        <p className="text-sm text-muted-foreground">
          Выберите, что включить в файл. Скачать новый экспорт можно раз в 48
          часов.
        </p>
      </div>
      <fieldset disabled={loading} className="space-y-2">
        <legend className="mb-2 text-sm font-medium">Что скачать</legend>
        {items.map(({ value, label, Icon, checked }) => (
          <Label
            key={value}
            className="flex min-h-9 cursor-pointer items-center gap-3 rounded-md border px-3 py-2"
          >
            <Checkbox
              checked={checked}
              onCheckedChange={(next) =>
                setItems((current) =>
                  current.map((item) =>
                    item.value === value
                      ? { ...item, checked: next === true }
                      : item,
                  ),
                )
              }
            />
            <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
            {label}
          </Label>
        ))}
      </fieldset>
      <div className="space-y-2">
        <Label htmlFor={id}>Формат файла</Label>
        <Select
          value={format}
          disabled={loading}
          onValueChange={(next) => {
            if (next === "json" || next === "yaml") setFormat(next);
          }}
        >
          <SelectTrigger id={id}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="json">JSON</SelectItem>
            <SelectItem value="yaml">YAML</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        type="button"
        onClick={downloadExport}
        disabled={loading || !items.some((item) => item.checked)}
      >
        {loading ? <Spinner /> : <Download />}
        Скачать данные
      </Button>
    </section>
  );
}
