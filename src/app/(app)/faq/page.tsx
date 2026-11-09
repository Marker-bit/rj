import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import faq from "@/lib/data/faq";

export default function Page() {
  return (
    <div className="m-2 flex flex-col gap-2">
      <h1 className="text-3xl font-bold">Частые вопросы</h1>
      <p className="text-sm text-muted-foreground">
        Не нашли ответ?{" "}
        <Link
          href="/support"
          className="underline underline-offset-4 hover:text-primary"
        >
          Напишите в поддержку
        </Link>
        .
      </p>
      <Accordion type="multiple">
        {faq.map((q) => (
          <AccordionItem key={q.question} value={q.question}>
            <AccordionTrigger>{q.question}</AccordionTrigger>
            <AccordionContent>{q.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
