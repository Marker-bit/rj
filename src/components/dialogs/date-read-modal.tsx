"use client";

import { ru } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { DrawerDialog } from "@/app/Drawer";
import { useRef, useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import moment from "moment";
import { Loader, Save } from "lucide-react";

export function DateReadModal({
  isOpen,
  setIsOpen,
  readDateMutation,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  readDateMutation: any;
}) {
  const tomorrow = moment().add(1, "day").toDate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [changePages, setChangePages] = useState<string>("");
  const input = useRef<HTMLInputElement>(null);

  const handleClose = (b: boolean) => {
    if (b) {
      input.current?.focus();
      setIsOpen(true);
      return;
    }
    setDate(new Date());
    setChangePages("");
    setIsOpen(false);
  };

  return (
    <DrawerDialog open={isOpen} onOpenChange={handleClose}>
      <DialogHeader className="mb-2">
        <DialogTitle>Отметить прочтение в прошлом</DialogTitle>
      </DialogHeader>
      <div className="flex gap-2 flex-col">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border w-fit max-sm:w-full"
          disabled={[{ from: tomorrow, to: new Date(3000, 1) }]}
          weekStartsOn={1}
          locale={ru}
        />
        <form
          onSubmit={(evt) => {
            evt.preventDefault();
            readDateMutation.mutate({ date, pages: parseInt(changePages) });
          }}
        >
          <div className="flex gap-2">
            <Input
              type="number"
              min={1}
              value={changePages}
              onChange={(evt) => setChangePages(evt.target.value)}
              autoFocus
              ref={input}
            />
            <Button type="submit" disabled={readDateMutation.isPending}>
              {readDateMutation.isPending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </DrawerDialog>
  );
}
