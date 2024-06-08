import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import faq from "@/lib/data/faq"

export default function Page() {
  return (
    <div className="m-2 flex flex-col gap-2">
      <h1 className="text-3xl font-bold">FAQ</h1>
      {/* <div key={i} className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Q: {q.question}</h2>
        <p className="text-lg">A: {q.answer}</p>
      </div> */}
      <Accordion type="multiple">
        {faq.map((q, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{q.question}</AccordionTrigger>
            <AccordionContent>{q.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
