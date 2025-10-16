import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ArrowRightIcon } from "lucide-react";
import { ComponentPropsWithRef } from "react";

export const PagesButtonGroup = ({
  value,
  setValue,
  isPending,
  lastPages,
  ...props
}: {
  value: number;
  setValue: (value: number) => void;
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
          onChange={(e) => {
            props.onChange?.(e);
            const number = e.target.valueAsNumber;
            if (!isNaN(number)) {
              setValue(number);
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
        {!isNaN(value) &&
          lastPages &&
          `Относительно прошлого: ${value - lastPages}`}
      </p>
    </div>
  );
};
