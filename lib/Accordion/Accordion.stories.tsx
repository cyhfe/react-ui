export default { title: "Components/Accordion" };

import { useState } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from "../";

export function Single() {
  return (
    <AccordionRoot type="single" className="border rounded max-w-xs">
      <AccordionItem value="one">
        <AccordionTrigger className="block w-full border-b text-left px-2 py-1 hover:bg-slate-100 ">
          one
        </AccordionTrigger>
        <AccordionContent className="p-2 shadow-inner bg-slate-50 border-b text-slate-600">
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit
          vulputate viverra integer ullamcorper congue curabitur sociis, nisi
          malesuada scelerisque quam suscipit habitant sed
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger className="block w-full border-b text-left px-2 py-1 hover:bg-slate-100 ">
          two
        </AccordionTrigger>
        <AccordionContent className="p-2 shadow-inner bg-slate-50 text-slate-600">
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit
          vulputate viverra integer ullamcorper congue curabitur sociis, nisi
          malesuada scelerisque quam suscipit habitant sed
        </AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  );
}

export function SingleControlled() {
  const [value, setValue] = useState("one");
  return (
    <AccordionRoot
      type="single"
      className="border rounded max-w-xs"
      value={value}
      onValueChange={setValue}
    >
      <AccordionItem value="one">
        <AccordionTrigger className="block w-full border-b text-left px-2 py-1 hover:bg-slate-100 ">
          one
        </AccordionTrigger>
        <AccordionContent className="p-2 shadow-inner bg-slate-50 border-b text-slate-600">
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit
          vulputate viverra integer ullamcorper congue curabitur sociis, nisi
          malesuada scelerisque quam suscipit habitant sed
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger className="block w-full border-b text-left px-2 py-1 hover:bg-slate-100 ">
          two
        </AccordionTrigger>
        <AccordionContent className="p-2 shadow-inner bg-slate-50 text-slate-600">
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit
          vulputate viverra integer ullamcorper congue curabitur sociis, nisi
          malesuada scelerisque quam suscipit habitant sed
        </AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  );
}

export function SingleCollasible() {
  return (
    <AccordionRoot
      type="single"
      className=" border rounded max-w-xs"
      collapsible
    >
      <AccordionItem value="one">
        <AccordionTrigger className="block w-full border-b text-left px-2 py-1 hover:bg-slate-100 ">
          one
        </AccordionTrigger>
        <AccordionContent className="p-2 shadow-inner bg-slate-50 border-b text-slate-600">
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit
          vulputate viverra integer ullamcorper congue curabitur sociis, nisi
          malesuada scelerisque quam suscipit habitant sed
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger className="block w-full border-b text-left px-2 py-1 hover:bg-slate-100 ">
          two
        </AccordionTrigger>
        <AccordionContent className="p-2 shadow-inner bg-slate-50 text-slate-600">
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
    <AccordionRoot type="multiple" className="border rounded max-w-xs">
      <AccordionItem value="one">
        <AccordionTrigger className="block w-full border-b text-left px-2 py-1 hover:bg-slate-100 ">
          one
        </AccordionTrigger>
        <AccordionContent className="p-2 shadow-inner bg-slate-50 border-b text-slate-600">
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit
          vulputate viverra integer ullamcorper congue curabitur sociis, nisi
          malesuada scelerisque quam suscipit habitant sed
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger className="block w-full border-b text-left px-2 py-1 hover:bg-slate-100 ">
          two
        </AccordionTrigger>
        <AccordionContent className="p-2 shadow-inner bg-slate-50 text-slate-600">
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit
          vulputate viverra integer ullamcorper congue curabitur sociis, nisi
          malesuada scelerisque quam suscipit habitant sed
        </AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  );
}

export function Animation() {
  return (
    <AccordionRoot type="multiple" className="border rounded max-w-xs">
      <AccordionItem value="one">
        <AccordionTrigger className="block w-full border-b text-left px-2 py-1 hover:bg-slate-100 ">
          one
        </AccordionTrigger>
        <AccordionContent className="p-2 shadow-inner bg-slate-50 border-b text-slate-600">
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit
          vulputate viverra integer ullamcorper congue curabitur sociis, nisi
          malesuada scelerisque quam suscipit habitant sed
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="two">
        <AccordionTrigger className="block w-full border-b text-left px-2 py-1 hover:bg-slate-100 ">
          two
        </AccordionTrigger>
        <AccordionContent className="p-2 shadow-inner bg-slate-50 text-slate-600">
          Per erat orci nostra luctus sociosqu mus risus penatibus, duis elit
          vulputate viverra integer ullamcorper congue curabitur sociis, nisi
          malesuada scelerisque quam suscipit habitant sed
        </AccordionContent>
      </AccordionItem>
    </AccordionRoot>
  );
}
