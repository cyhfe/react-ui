import { Tabs, TabList, Tab, TabPanel } from "../lib/Tabs/index";
import React from "react";

export function TabsDemo() {
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
