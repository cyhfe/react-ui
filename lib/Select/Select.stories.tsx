import { Select, Option } from ".";

export default {
  title: "Components/Select",
};

export function SelectDemo() {
  return (
    <Select>
      <Option value="1">one</Option>
      <Option value="2">two</Option>
      <Option value="3">three</Option>
      <Option value="4">four</Option>
      <Option value="5">five</Option>
    </Select>
  );
}
