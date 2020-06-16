import dynamic from 'next/dynamic'
import { GetServerSideProps } from 'next';
import { renderCMSPage, getCMSProps } from '../src/CmsPage';
import { WagtailRouterConfig, WagtailProps } from '../src/interfaces';

const cmsPageRouter: WagtailRouterConfig = [
    {
        type: "cms.HomePage",
        component: dynamic(() => import("../components/wagtail/cms.HomePage")),
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