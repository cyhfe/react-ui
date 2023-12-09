# React-UI 

[storybook](https://655ae4314b829579b570aedd-thytecihvz.chromatic.com/)

## useage

```bash
npm i @cyhfe/react-ui
```

```tsx
import { PopupRoot, PopupTrigger, PopupContent } from "@cyhfe/react-ui";

export function Base() {
  return (
    <PopupRoot className="flex justify-center items-center">
      <PopupTrigger className="border border-black rounded px-2 py-1">
        <div>trigger</div>
      </PopupTrigger>
      <PopupContent className="p-2 shadow max-w-sm border rounded">
        Ut aliquip esse ipsum nisi.
      </PopupContent>
    </PopupRoot>
  );
}
```

## screenshot

![react-ui](https://github.com/cyhfe/react-ui/assets/78200034/063330bd-285d-46bf-8263-084c4586e60e)
