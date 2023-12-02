import React, { useId } from "react";
import { createContext } from "../lib";

function FormDemo() {
  return (
    <div>
      <FormRoot>
        <FormField name="username">
          <FormLabel>username</FormLabel>
          <FormControl />
        </FormField>
      </FormRoot>
    </div>
  );
}

interface FormRootProps extends React.ComponentPropsWithoutRef<"form"> {}
const FormRoot = React.forwardRef<HTMLFormElement, FormRootProps>(
  function FormRoot(props: FormRootProps, forwardRef) {
    const { children, ...rest } = props;
    return (
      <form ref={forwardRef} {...rest}>
        {children}
      </form>
    );
  }
);

interface FormFieldContextValue {
  name: string;
  id: string;
}

const [FormFieldProvider, useFormField] =
  createContext<FormFieldContextValue>("FormField");

interface FormFieldProps extends React.ComponentPropsWithoutRef<"div"> {
  name: string;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  function FormField(props: FormFieldProps, forwardRef) {
    const id = useId();
    const { children, name, ...rest } = props;
    return (
      <FormFieldProvider name={name} id={id}>
        <div ref={forwardRef} {...rest}>
          {children}
        </div>
      </FormFieldProvider>
    );
  }
);

interface FormLabelProps extends React.ComponentPropsWithoutRef<"label"> {}
const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  function FormLabel(props: FormLabelProps, forwardRef) {
    const { children, htmlFor: htmlForProp, ...rest } = props;
    const { id } = useFormField("FormLabel");
    const htmlFor = htmlForProp ?? id;
    return (
      <label ref={forwardRef} htmlFor={htmlFor} {...rest}>
        {children}
      </label>
    );
  }
);

interface FormControlProps extends React.ComponentPropsWithoutRef<"input"> {}
const FormControl = React.forwardRef<HTMLInputElement, FormControlProps>(
  function FormControl(props: FormControlProps, forwardRef) {
    const { id: idProp, ...rest } = props;
    const { id: fieldId } = useFormField("FormControl");
    const id = idProp ?? fieldId;
    return <input ref={forwardRef} id={id} {...rest} />;
  }
);

export { FormDemo };
