import * as React from "react";
import { createContext, useComposeRefs } from "../lib";

// bultin
const validityMatchers = [
  "badInput",
  "patternMismatch",
  "rangeOverflow",
  "rangeUnderflow",
  "stepMismatch",
  "tooLong",
  "tooShort",
  "typeMismatch",
  "valid",
  "valueMissing",
] as const;
type ValidityMatcher = (typeof validityMatchers)[number];
const DEFAULT_INVALID_MESSAGE = "This value is not valid";
const DEFAULT_BUILT_IN_MESSAGES: Record<ValidityMatcher, string | undefined> = {
  badInput: DEFAULT_INVALID_MESSAGE,
  patternMismatch: "This value does not match the required pattern",
  rangeOverflow: "This value is too large",
  rangeUnderflow: "This value is too small",
  stepMismatch: "This value does not match the required step",
  tooLong: "This value is too long",
  tooShort: "This value is too short",
  typeMismatch: "This value does not match the required type",
  valid: undefined,
  valueMissing: "This value is missing",
};

function FormDemo() {
  return (
    <div>
      <FormRoot
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormField name="username">
          <FormLabel>username</FormLabel>
          <FormControl />
        </FormField>
        <button type="submit">submit</button>
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
    const id = React.useId();
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

    const controlRef = React.useRef<HTMLInputElement>();

    const composedRef = useComposeRefs(controlRef, forwardRef);

    const updateControlValidity = React.useCallback(
      function updateControlValidity(control: HTMLInputElement) {
        console.log(control.validity);
      },
      []
    );

    React.useEffect(() => {
      const control = controlRef.current;
      if (control) {
        const handleChange = () => {
          updateControlValidity(control);
        };
        window.addEventListener("change", handleChange);
        return () => window.removeEventListener("change", handleChange);
      }
    }, [updateControlValidity]);

    return <input ref={composedRef} id={id} {...rest} />;
  }
);

interface FormMessageProps extends React.ComponentPropsWithoutRef<"span"> {
  match?: () => boolean | string;
}

const FormMessage = React.forwardRef<HTMLDivElement, FormMessageProps>(
  function FormMessage(props: FormMessageProps, forwardRef) {
    const { children, match, ...rest } = props;

    if (match === undefined) {
      return (
        <FormMessageImp>{children ?? DEFAULT_INVALID_MESSAGE}</FormMessageImp>
      );
    } else if (typeof match === "function") {
      return (
        <FormMessageImp>{children ?? DEFAULT_INVALID_MESSAGE}</FormMessageImp>
      );
    } else {
      <FormMessageImp>{children ?? DEFAULT_INVALID_MESSAGE}</FormMessageImp>;
    }

    return (
      <span ref={forwardRef} {...rest}>
        {children}
      </span>
    );
  }
);

interface FormMessageImpProps extends React.ComponentPropsWithoutRef<"span"> {}
const FormMessageImp = React.forwardRef<HTMLSpanElement, FormMessageImpProps>(
  function FormMessageImp(props: FormMessageImpProps, forwardRef) {
    const { ...rest } = props;
    return <span ref={forwardRef} {...rest} />;
  }
);

export { FormDemo };
