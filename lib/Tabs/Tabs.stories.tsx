import { useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from ".";

export default {
  title: "Components/Tabs",
};

export function Uncontrolled() {
  return (
    <Tabs defaultValue={0} className="max-w-sm ">
      <TabList className="text-sm font-medium text-center text-gray-500 rounded-lg shadow flex">
        <Tab className="data-[state=active]:text-gray-900 data-[state=active]:bg-gray-100 data-[state=active]:border-r data-[state=active]:border-gray-200 w-full py-1 px-2 bg-white border-r border-gray-200  hover:text-gray-700 hover:bg-gray-50">
          One
        </Tab>
        <Tab className="data-[state=active]:text-gray-900 data-[state=active]:bg-gray-100 data-[state=active]:border-r data-[state=active]:border-gray-200 w-full py-1 px-2 bg-white border-r border-gray-200  hover:text-gray-700 hover:bg-gray-50">
          Two
        </Tab>
        <Tab className="data-[state=active]:text-gray-900 data-[state=active]:bg-gray-100 data-[state=active]:border-r data-[state=active]:border-gray-200 w-full py-1 px-2 bg-white border-r border-gray-200  hover:text-gray-700 hover:bg-gray-50">
          Three
        </Tab>
      </TabList>
      <TabPanel>
        <div className="p-4 border text-gray-500 ">
          Aliquip adipisicing culpa consectetur amet veniam magna commodo. Magna
          dolore veniam magna et irure magna. Esse mollit sit ipsum exercitation
          amet nostrud ipsum sit qui qui est enim occaecat duis. Adipisicing
          Lorem veniam aliquip non reprehenderit adipisicing deserunt consequat
          est ut ex ut.
        </div>
      </TabPanel>
      <TabPanel>
        <div className="p-4 border text-gray-500 ">
          Anim labore culpa ut ipsum ad reprehenderit ad id est elit do non.
          Ullamco nostrud nostrud occaecat veniam sit mollit. Et incididunt
          minim nostrud est duis excepteur est laborum ut laboris laboris
          cupidatat minim excepteur. Aliquip duis adipisicing anim do. Aliquip
          aliquip commodo aliquip culpa amet laboris aute irure. Nisi ea nostrud
          duis pariatur et mollit Lorem veniam non aute adipisicing exercitation
          magna.
        </div>
      </TabPanel>
      <TabPanel>
        <div className="p-4 border text-gray-500 ">
          Amet ullamco dolor occaecat eiusmod irure est exercitation laborum
          pariatur consectetur magna sint. Qui amet laborum et cupidatat duis eu
          cillum nisi amet sit incididunt aliquip velit. Quis ut qui qui sunt
          officia sint.
        </div>
      </TabPanel>
    </Tabs>
  );
}

export function Controlled() {
  const [value, setValue] = useState(1);
  return (
    <Tabs
      defaultValue={0}
      className="max-w-sm"
      value={value}
      onValueChange={setValue}
    >
      <TabList className="text-sm font-medium text-center text-gray-500 rounded-lg shadow flex">
        <Tab className="data-[state=active]:text-gray-900 data-[state=active]:bg-gray-100 data-[state=active]:border-r data-[state=active]:border-gray-200 w-full py-1 px-2 bg-white border-r border-gray-200  hover:text-gray-700 hover:bg-gray-50">
          One
        </Tab>
        <Tab className="data-[state=active]:text-gray-900 data-[state=active]:bg-gray-100 data-[state=active]:border-r data-[state=active]:border-gray-200 w-full py-1 px-2 bg-white border-r border-gray-200  hover:text-gray-700 hover:bg-gray-50">
          Two
        </Tab>
        <Tab className="data-[state=active]:text-gray-900 data-[state=active]:bg-gray-100 data-[state=active]:border-r data-[state=active]:border-gray-200 w-full py-1 px-2 bg-white border-r border-gray-200  hover:text-gray-700 hover:bg-gray-50">
          Three
        </Tab>
      </TabList>
      <TabPanel>
        <div className="p-4 border text-gray-500 ">
          Aliquip adipisicing culpa consectetur amet veniam magna commodo. Magna
          dolore veniam magna et irure magna. Esse mollit sit ipsum exercitation
          amet nostrud ipsum sit qui qui est enim occaecat duis. Adipisicing
          Lorem veniam aliquip non reprehenderit adipisicing deserunt consequat
          est ut ex ut.
        </div>
      </TabPanel>
      <TabPanel>
        <div className="p-4 border text-gray-500 ">
          Anim labore culpa ut ipsum ad reprehenderit ad id est elit do non.
          Ullamco nostrud nostrud occaecat veniam sit mollit. Et incididunt
          minim nostrud est duis excepteur est laborum ut laboris laboris
          cupidatat minim excepteur. Aliquip duis adipisicing anim do. Aliquip
          aliquip commodo aliquip culpa amet laboris aute irure. Nisi ea nostrud
          duis pariatur et mollit Lorem veniam non aute adipisicing exercitation
          magna.
        </div>
      </TabPanel>
      <TabPanel>
        <div className="p-4 border text-gray-500 ">
          Amet ullamco dolor occaecat eiusmod irure est exercitation laborum
          pariatur consectetur magna sint. Qui amet laborum et cupidatat duis eu
          cillum nisi amet sit incididunt aliquip velit. Quis ut qui qui sunt
          officia sint.
        </div>
      </TabPanel>
    </Tabs>
  );
}
