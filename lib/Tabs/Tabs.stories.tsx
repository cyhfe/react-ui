import { Tabs, TabList, Tab, TabPanel } from "./index";

export default {
  title: "Components/Tabs",
};

export function Tabs1() {
  return (
    <Tabs>
      <TabList>
        <Tab>One</Tab>
        <Tab>Two</Tab>
        <Tab>Three</Tab>
      </TabList>
      <TabPanel>First page</TabPanel>
      <TabPanel>Second page</TabPanel>
      <TabPanel>Third page</TabPanel>
    </Tabs>
  );
}

export function Tabs2() {
  return <div>tabs</div>;
}
