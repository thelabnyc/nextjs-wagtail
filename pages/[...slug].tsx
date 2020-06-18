import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";
import { getCMSProps, createRouter } from "../src/CmsPage";
import { WagtailRouterConfig } from "../src/interfaces";

const cmsPageRouter: WagtailRouterConfig = [
  {
    type: "sandbox.BarPage",
    component: dynamic(() => import("../components/wagtail/sandbox.BarPage")),
  },
  {
    type: "sandbox.FooPage",
    component: dynamic(() => import("../components/wagtail/sandbox.FooPage")),
  },
];

const Page = createRouter(cmsPageRouter);

export default Page;

export const getServerSideProps: GetServerSideProps = getCMSProps;
