import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from "../";
export default { title: "Components/Accordion" };

export function Single() {
  return (
    <AccordionRoot type="single">
      <AccordionItem value="one">
        <AccordionTrigger>One</AccordionTrigger>
        <AccordionContent>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit
          vulputate viverra integer ullamcorper congue curabitur sociis, nisi
          malesuada scelerisque quam suscipit habitant sed
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger>Two</AccordionTrigger>
        <AccordionContent>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit
          vulputate viverra integer ullamcorper congue curabitur sociis, nisi
          malesuada scelerisque quam suscipit habitant sed
        </AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  );
}

export function Multiple() {
  return (
    <AccordionRoot type="multiple">
      <AccordionItem value="one">
        <AccordionTrigger>One</AccordionTrigger>
        <AccordionContent>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit
          vulputate viverra integer ullamcorper congue curabitur sociis, nisi
          malesuada scelerisque quam suscipit habitant sed
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger>Two</AccordionTrigger>
        <AccordionContent>
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit
          vulputate viverra integer ullamcorper congue curabitur sociis, nisi
          malesuada scelerisque quam suscipit habitant sed
        </AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  );
}
