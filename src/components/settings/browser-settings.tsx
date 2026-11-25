"use client";

import { useTheme } from "next-themes";
import { useId, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  homeWidgetLabels,
  useHomeWidget,
  useWarnAboutDuplicates,
  useFirstStepsDismissed,
  usePrefillReadingPage,
} from "@/hooks/use-journal-preferences";

import {
  parseStartPage,
  readBrowserStartPage,
  START_PAGE_COOKIE,
  startPageLabels,
} from "@/lib/start-page";

const browserDescription = "Изменения сразу применяются в этом браузере.";

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <BrowserDescription />
      <PreferenceSelect
        label="Тема оформления"
        value={theme ?? "system"}
        onChange={setTheme}
        options={{ system: "Как в системе", light: "Светлая", dark: "Тёмная" }}
      />
    </>
  );
}

export function HomeSettings() {
  const [startPage, setStartPage] = useState(readBrowserStartPage);
  const [dismissed, setDismissed] = useFirstStepsDismissed();
  const [disableRecs, setDisableRecs] = useLocalStorage("disableRecs", false, {
    initializeWithValue: false,
    deserializer: (stored) => stored === "true",
  });

  return (
    <>
      <BrowserDescription />
      <PreferenceSelect
        label="Стартовая страница"
        description="Открывается после входа, когда вы не переходили по ссылке на другую страницу."
        value={startPage}
        options={startPageLabels}
        onChange={(value) => {
          const next = parseStartPage(value);
          document.cookie = `${START_PAGE_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
          setStartPage(next);
        }}
      />
      <section className="space-y-2" aria-label="Виджеты главной">
        <h3 className="font-medium">Виджеты главной</h3>
        <HomeWidgetSwitch widget="streak" />
        <HomeWidgetSwitch widget="lastRead" />
        <HomeWidgetSwitch widget="recentBooks" />
        <HomeWidgetSwitch widget="stats" />
      </section>
      <PreferenceSwitch
        label="Показывать первые шаги"
        description="Показывать карточку на главной, пока есть незавершённые шаги."
        checked={!dismissed}
        onChange={(checked) => setDismissed(!checked)}
      />
      <PreferenceSwitch
        label="Показывать рекомендации книг"
        description="Показывать еженедельные рекомендации над страницами дневника."
        checked={!disableRecs}
        onChange={(checked) => setDisableRecs(!checked)}
      />
    </>
  );
}

function HomeWidgetSwitch({
  widget,
}: {
  widget: keyof typeof homeWidgetLabels;
}) {
  const [checked, setChecked] = useHomeWidget(widget);
  return (
    <PreferenceSwitch
      label={homeWidgetLabels[widget]}
      checked={checked}
      onChange={setChecked}
    />
  );
}

export function LibrarySettings() {
  const [checked, setChecked] = useWarnAboutDuplicates();
  return (
    <PreferenceSwitch
      label="Предупреждать о дублях"
      description="Проверять название и автора при добавлении книги вручную."
      checked={checked}
      onChange={setChecked}
    />
  );
}

export function ReadingSettings() {
  const [prefill, setPrefill] = usePrefillReadingPage();
  return (
    <>
      <BrowserDescription />
      <PreferenceSwitch
        label="Подставлять последнюю страницу"
        description="При открытии окна «Отметить прочтение» подставлять последнюю отмеченную страницу."
        checked={prefill}
        onChange={setPrefill}
      />
    </>
  );
}

function BrowserDescription() {
  return <p className="text-sm text-muted-foreground">{browserDescription}</p>;
}

function PreferenceSelect({
  label,
  description,
  value,
  onChange,
  options,
}: {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  options: Record<string, string>;
}) {
  const id = useId();
  return (
    <div className="space-y-2 rounded-lg border p-4">
      <Label htmlFor={id}>{label}</Label>
      {description && (
        <p id={id + "-description"} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          aria-describedby={description ? id + "-description" : undefined}
          className="w-full"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper">
          {Object.entries(options).map(([optionValue, optionLabel]) => (
            <SelectItem key={optionValue} value={optionValue}>
              {optionLabel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function PreferenceSwitch({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-4">
      <div className="space-y-1">
        <Label htmlFor={id}>{label}</Label>
        {description && (
          <p id={id + "-description"} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <Switch
        id={id}
        aria-describedby={description ? id + "-description" : undefined}
        className="shrink-0"
        checked={checked}
        onCheckedChange={onChange}
      />
    </div>
  );
}
