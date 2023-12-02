import { FormControl, FormField, FormLabel, FormMessage, FormRoot } from ".";

export default {
  title: "Components/Form",
};
export function Validation() {
  return (
    <div>
      <FormRoot
        onSubmit={(e) => {
          e.preventDefault();
          console.log("submit");
        }}
        className="flex flex-col gap-2"
      >
        <FormField name="username" className="flex items-center gap-1 ">
          <FormLabel className="w-[80px]">username</FormLabel>
          <FormControl
            required
            minLength={3}
            className="p-1 border border-slate-400 rounded"
          />
          <FormMessage match="tooShort">至少3个字符</FormMessage>
          <FormMessage match="valueMissing">必填</FormMessage>
          <FormMessage match={(value) => value !== "aaa"}>
            value必须是aaa
          </FormMessage>
        </FormField>
        <FormField name="email" className="flex items-center gap-1 ">
          <FormLabel className="w-[80px]">email</FormLabel>
          <FormControl
            type="email"
            required
            className="p-1 border border-slate-400 rounded"
          />
          <FormMessage match="typeMismatch">typeMismatch</FormMessage>
          <FormMessage match="valueMissing">必填</FormMessage>
        </FormField>
        <div className="flex gap-x-2">
          <button type="submit" className="py-1 px-2 border rounded ">
            submit
          </button>
          <button type="reset" className="py-1 px-2 border rounded ">
            reset
          </button>
        </div>
      </FormRoot>
    </div>
  );
}
