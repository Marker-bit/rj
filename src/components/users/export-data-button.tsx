"use client";

import { BarChartBig, Book, Download, Users } from "lucide-react";
import { ComponentProps, useId, useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { DialogHeader, DialogTitle } from "../ui/dialog";
import { DrawerDialog } from "../ui/drawer-dialog";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { exportDefaultItems } from "@/lib/export";
import { exportData } from "@/lib/actions/export";
import { toast } from "sonner";

export default function ExportDataButton({
  ...props
}: ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const id = useId();

  const [items, setItems] = useState(
    exportDefaultItems.map((a) => ({ ...a, checked: a.defaultChecked }))
  );
  const [format, setFormat] = useState<"json" | "yaml">("json");

  const formWrong = !items.some((item) => item.checked);

  const runAction = async () => {
    setLoading(true);
    const res = await exportData({
      data: items.filter((item) => item.checked).map((item) => item.value),
      format,
    });
    if (res.error || !res.data) {
      setLoading(false);
      toast.error(`Ошибка при экспорте данных`, {
        description: res.error || "Неизвестная ошибка",
      });
      return;
    }
    const d = Buffer.from(res.data, "base64").toString("utf-8");
    const blob = new Blob([d], { type: format === "json" ? "application/json" : "application/x-yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export-${new Date().toISOString()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setLoading(false);
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)} {...props}>
        <Download />
        Экспорт
      </Button>
      <DrawerDialog open={open} onOpenChange={setOpen} className="w-[50vw]">
        <DialogHeader className="mb-2">
          <DialogTitle className="flex items-center gap-2">
            Экспортировать данные
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-3">
            {items.map((item) => (
              <div
                key={`${id}-${item.value}`}
                className="border-input has-data-[state=checked]:border-primary/50 relative flex cursor-pointer flex-col gap-4 rounded-md border p-4 shadow-xs outline-none"
              >
                <div className="flex justify-between gap-2">
                  <Checkbox
                    id={`${id}-${item.value}`}
                    value={item.value}
                    className="order-1 after:absolute after:inset-0"
                    checked={item.checked}
                    onCheckedChange={(checked) => {
                      if (checked === "indeterminate") checked = false;
                      setItems((items) =>
                        items.map((a) =>
                          a.value === item.value ? { ...a, checked } : a
                        )
                      );
                    }}
                  />
                  <item.Icon
                    className="opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                </div>
                <Label htmlFor={`${id}-${item.value}`}>{item.label}</Label>
              </div>
            ))}
          </div>
          <div className="*:not-first:mt-2">
            <Label htmlFor={id}>Формат данных</Label>
            <Select
              value={format}
              onValueChange={(format) => setFormat(format as "json" | "yaml")}
            >
              <SelectTrigger id={id}>
                <SelectValue placeholder="Выберите формат" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="yaml">YAML</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button disabled={formWrong || loading} onClick={runAction}>
            Экспорт
          </Button>
          <p className="text-muted-foreground text-center text-xs">
            После этого, вы не сможете запросить экспорт ещё 48 часов
          </p>
        </div>
      </DrawerDialog>
    </>
  );
}
