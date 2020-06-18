import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";
import { createRouter } from "../src/CmsPage";

const { CMSPage, getCMSProps } = createRouter({
  siteId: 2,
  domain: "http://localhost:8000",
  routes: [
    {
      type: "sandbox.BarPage",
      component: dynamic(() => import("../components/wagtail/sandbox.BarPage")),
    },
    {
      type: "sandbox.FooPage",
      component: dynamic(() => import("../components/wagtail/sandbox.FooPage")),
    },
  ],
});

/* If you need to customize page:

const CustomPage = (props: WagtailProps) => {
  if (props.status >= 200) return <NextError statusCode={props.status} />

  return (
    <div>
      <h1>hi</h1>
      <CMSPage {...props} />
    </div>
  )
}
export default CustomPage

*/
export default CMSPage;

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
