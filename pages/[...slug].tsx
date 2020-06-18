import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";
import { getCMSProps, createRouter } from "../src/CmsPage";

const Page = createRouter([
  {
    type: "sandbox.BarPage",
    component: dynamic(() => import("../components/wagtail/sandbox.BarPage")),
  },
  {
    type: "sandbox.FooPage",
    component: dynamic(() => import("../components/wagtail/sandbox.FooPage")),
  },
]);

/* If you need to customize page:

const CustomPage = (props: WagtailProps) => {
  return (
    <div>
      <h1>hi</h1>
      <Page {...props} />
    </div>
  )
}
export default CustomPage

*/
export default Page;

/* If you need to customize getServerSideProps

export const getServerSideProps: GetServerSideProps = async (context) => {
  const wagtailProps = await getCMSProps(context)
  return {
    ...wagtailProps,
    props: {
      ...wagtailProps.props,
      myCoolProp: 42,
    }
  }
}

*/
export const getServerSideProps: GetServerSideProps = getCMSProps;
