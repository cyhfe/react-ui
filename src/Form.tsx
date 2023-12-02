import * as React from "react";
import { createContext, useComposeRefs } from "../lib";

// builtin
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
          <FormControl required minLength={3} />
          <FormMessage match="tooShort">至少3个字符</FormMessage>
          <FormMessage match="valueMissing">必填</FormMessage>
          <FormMessage match={(value) => value !== "aaa"}>
            value必须是aaa
          </FormMessage>
        </FormField>
        <button type="submit">submit</button>
      </FormRoot>
    </div>
  );
}

interface FormRootContextValue {
  getValidityByFieldName: (fieldName: string) => ValidityState | undefined;
  onFieldValidityChange: (
    fieldName: string,
    validityState: ValidityState
  ) => void;
  addCustomMatcher: (fieldName: string, customMatcher: Matcher) => void;
  getCustomMatcher: (fieldName: string) => Matcher[];
  removeCustomMatcher: (fieldName: string, id: string) => void;
  updateCustomError: (fieldName: string, error: string[]) => void;
  getCustomError: (fieldName: string) => string[];
  clearError: (fieldName: string) => void;
}
const [FormRootProvider, useFormRoot] =
  createContext<FormRootContextValue>("FormRoot");

type ValidityMap = Map<string, ValidityState | undefined>;
type CustomMatcher = (value: string) => boolean;
interface Matcher {
  id: string;
  match: CustomMatcher;
}

interface CustomMatchers {
  [fileName: string]: Matcher[];
}

interface CustomErrors {
  [fileName: string]: string[];
}

interface FormRootProps extends React.ComponentPropsWithoutRef<"form"> {}
const FormRoot = React.forwardRef<HTMLFormElement, FormRootProps>(
  function FormRoot(props: FormRootProps, forwardRef) {
    const { children, ...rest } = props;
    const [validityMap, setValidityMap] = React.useState<ValidityMap>(
      () => new Map()
    );

    const getValidityByFieldName = React.useCallback(
      (fieldName: string) => {
        return validityMap.get(fieldName);
      },
      [validityMap]
    );

    const onFieldValidityChange = React.useCallback(
      (fieldName: string, validityState: ValidityState) => {
        setValidityMap((prev) => {
          const next = new Map(prev);
          next.set(fieldName, validityState);
          return next;
        });
      },
      []
    );

    const [customMatchers, setCustomMatchers] = React.useState<CustomMatchers>(
      {}
    );

    const addCustomMatcher = React.useCallback(
      (fieldName: string, customMatcher: Matcher) => {
        setCustomMatchers((prev) => {
          const fieldErrors = prev[fieldName] ?? [];
          const nextFieldErrors = [...fieldErrors, customMatcher];
          return { ...prev, [fieldName]: nextFieldErrors };
        });
      },
      []
    );

    const getCustomMatcher = React.useCallback(
      (fieldName: string) => {
        return customMatchers[fieldName];
      },
      [customMatchers]
    );

    const removeCustomMatcher = React.useCallback(
      (fieldName: string, id: string) => {
        setCustomMatchers((prev) => {
          const fieldErrors = prev[fieldName] ?? [];
          const nextFieldErrors = fieldErrors.filter((m) => m.id !== id);
          return { ...prev, [fieldName]: nextFieldErrors };
        });
      },
      []
    );

    const [customErrors, setCustomErrors] = React.useState<CustomErrors>({});
    const getCustomError = React.useCallback(
      (fieldName: string) => {
        return customErrors[fieldName];
      },
      [customErrors]
    );
    const updateCustomError = React.useCallback(
      (fieldName: string, error: string[]) => {
        setCustomErrors((prev) => ({ ...prev, [fieldName]: error }));
      },
      []
    );
    const removeCustomError = React.useCallback(() => {}, []);

    const clearError = React.useCallback((fieldName: string) => {
      setValidityMap((prev) => {
        const next = new Map(prev);
        next.set(fieldName, undefined);
        return next;
      });
      setCustomErrors((prev) => ({ ...prev, [fieldName]: [] }));
    }, []);

    React.useEffect(() => {
      console.log(validityMap, customMatchers);
    }, [validityMap, customMatchers]);

    return (
      <FormRootProvider
        getValidityByFieldName={getValidityByFieldName}
        onFieldValidityChange={onFieldValidityChange}
        addCustomMatcher={addCustomMatcher}
        getCustomMatcher={getCustomMatcher}
        removeCustomMatcher={removeCustomMatcher}
        updateCustomError={updateCustomError}
        getCustomError={getCustomError}
        clearError={clearError}
      >
        <form ref={forwardRef} {...rest}>
          {children}
        </form>
      </FormRootProvider>
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
    const {
      onFieldValidityChange,
      getCustomMatcher,
      updateCustomError,
      clearError,
    } = useFormRoot("FormControl");
    const { id: fieldId, name } = useFormField("FormControl");

    const customMatcher = getCustomMatcher(name);

    const id = idProp ?? fieldId;

    const controlRef = React.useRef<HTMLInputElement>();

    const composedRef = useComposeRefs(controlRef, forwardRef);

    const updateControlValidity = React.useCallback(
      async (control: HTMLInputElement) => {
        const validity = control.validity;

        // 内建错误
        if (hasBuiltinError(validity)) {
          onFieldValidityChange(name, validity);
          return;
        }

        // 自定错误
        const customError: string[] = [];
        for (const { id, match } of customMatcher) {
          const isMatch = match(control.value);
          if (isMatch) {
            customError.push(id);
          }
        }
        control.setCustomValidity(DEFAULT_INVALID_MESSAGE);
        updateCustomError(name, customError);
      },
      [customMatcher, name, onFieldValidityChange, updateCustomError]
    );

    React.useEffect(() => {
      const control = controlRef.current;
      if (control) {
        const handleChange = () => updateControlValidity(control);
        window.addEventListener("change", handleChange);
        return () => window.removeEventListener("change", handleChange);
      }
    }, [name, updateControlValidity]);

    return (
      <input
        ref={composedRef}
        id={id}
        onChange={() => {
          // clearError(name);
        }}
        {...rest}
      />
    );
  }
);

interface FormMessageProps extends React.ComponentPropsWithoutRef<"span"> {
  match?: ValidityMatcher | CustomMatcher;
}

const FormMessage = React.forwardRef<HTMLSpanElement, FormMessageProps>(
  function FormMessage(props: FormMessageProps, forwardRef) {
    const { children, match, ...rest } = props;

    if (match === undefined) {
      return (
        <FormMessageImp>{children ?? DEFAULT_INVALID_MESSAGE}</FormMessageImp>
      );
    } else if (typeof match === "function") {
      return (
        <FormCustomMessage match={match}>
          {children ?? DEFAULT_INVALID_MESSAGE}
        </FormCustomMessage>
      );
    } else {
      return (
        <FormBuiltInMessage match={match} {...rest}>
          {children ?? DEFAULT_INVALID_MESSAGE}
        </FormBuiltInMessage>
      );
    }
  }
);

interface FormBuiltInMessageProps
  extends React.ComponentPropsWithoutRef<"span"> {
  match: ValidityMatcher;
}
const FormBuiltInMessage = React.forwardRef<
  HTMLDivElement,
  FormBuiltInMessageProps
>(function FormBuiltInMessage(props: FormBuiltInMessageProps, forwardRef) {
  const { children, match, ...rest } = props;
  const { name } = useFormField("FormBuiltInMessage");
  const { getValidityByFieldName } = useFormRoot("FormBuiltInMessage");
  const isMatch = getValidityByFieldName(name)?.[match];
  if (isMatch)
    return (
      <FormMessageImp ref={forwardRef} {...rest}>
        {children ?? DEFAULT_BUILT_IN_MESSAGES[name]}
      </FormMessageImp>
    );
  return null;
});

interface FormCustomMessageProps
  extends React.ComponentPropsWithoutRef<"span"> {
  match: CustomMatcher;
}
const FormCustomMessage = React.forwardRef<
  HTMLDivElement,
  FormCustomMessageProps
>(function FormCustomMessage(props: FormCustomMessageProps, forwardRef) {
  const { children, match, ...rest } = props;
  const id = React.useId();
  const {
    addCustomMatcher,
    removeCustomMatcher,
    getCustomError,
    getValidityByFieldName,
  } = useFormRoot("FormCustomMessage");
  const { name } = useFormField("FormCustomMessage");
  const error = getCustomError(name);
  const validity = getValidityByFieldName(name);
  const matcher = React.useMemo(() => {
    return {
      id,
      match,
    };
  }, [id, match]);

  React.useEffect(() => {
    addCustomMatcher(name, matcher);
    return () => removeCustomMatcher(name, id);
  }, [addCustomMatcher, id, matcher, name, removeCustomMatcher]);

  const isMatch = validity && !hasBuiltinError(validity) && error.includes(id);
  if (isMatch) {
    return (
      <FormMessageImp ref={forwardRef} {...rest}>
        {children}
      </FormMessageImp>
    );
  }
  return null;
});

interface FormMessageImpProps extends React.ComponentPropsWithoutRef<"span"> {}
const FormMessageImp = React.forwardRef<HTMLSpanElement, FormMessageImpProps>(
  function FormMessageImp(props: FormMessageImpProps, forwardRef) {
    const { ...rest } = props;
    return <span ref={forwardRef} {...rest} />;
  }
);

function hasBuiltinError(validity: ValidityState) {
  let error = false;
  for (const validityKey in validity) {
    const key = validityKey;
    if (key !== "valid" && key !== "customError" && validity[key]) {
      error = true;
      break;
    }
  }
  return error;
}

export { FormDemo };
