import dynamic from 'next/dynamic'
import { GetServerSideProps } from 'next';
import { renderCMSPage, getCMSProps } from '../src/CmsPage';
import { WagtailRouterConfig, WagtailProps } from '../src/interfaces';

const cmsPageRouter: WagtailRouterConfig = [
    {
        type: "sandbox.BarPage",
        component: dynamic(() => import("../components/wagtail/sandbox.BarPage")),
    },
    {
        type: "sandbox.FooPage",
        component: dynamic(() => import("../components/wagtail/sandbox.FooPage")),
    }
];


const Page = (props: WagtailProps) => {
    return renderCMSPage(cmsPageRouter, props.wagtail.meta.type)
}

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const wagtailProps = await getCMSProps(context);
    return wagtailProps;
}