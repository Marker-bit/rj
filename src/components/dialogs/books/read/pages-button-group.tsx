import { ArrowRightIcon } from "lucide-react";
import type { ComponentPropsWithRef } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

export const PagesButtonGroup = ({
  value,
  setValue,
  isPending,
  lastPages,
  ...props
}: {
  value: number | "";
  setValue: (value: number | "") => void;
  isPending?: boolean;
  lastPages?: number;
} & ComponentPropsWithRef<typeof Input>) => {
  return (
    <div className="flex flex-col items-center">
      <ButtonGroup>
        <Input
          type="number"
          min={1}
          autoFocus
          {...props}
          disabled={isPending}
          value={value}
          onChange={(e) => {
            props.onChange?.(e);
            const number = e.target.value;

            if (number === "" || /^[0-9\b]+$/.test(number)) {
              setValue(number === "" ? "" : Number(number));
            }
          }}
        />
        <Button
          variant="outline"
          aria-label="Отметить страницу"
          disabled={isPending}
        >
          {isPending ? <Spinner /> : <ArrowRightIcon />}
        </Button>
      </ButtonGroup>
      <p className="mt-2 text-sm text-muted-foreground">
        {value !== "" &&
          !Number.isNaN(value) &&
          lastPages &&
          `Относительно прошлого: ${value - lastPages}`}
      </p>
    </div>
  );
};
