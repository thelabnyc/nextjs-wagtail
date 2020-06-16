import { GetServerSideProps } from 'next';
import { WagtailRouterConfig, WagtailPageDetail, WagtailProps } from './interfaces';

const routeToComponent = (routes: WagtailRouterConfig, pageType: string) => {
    const route = routes.find((route) => route.type === pageType);
    return route?.component
}

export const renderCMSPage = (routes: WagtailRouterConfig, pageType: string) => {
    const CMSComponent = routeToComponent(routes, pageType);

    if (CMSComponent) {
        return <CMSComponent />
    }
    return <h1>Hello not found</h1>;
}

export const getCMSProps: GetServerSideProps<WagtailProps> = async (context) => {
    const pathname = "/us/";
    const res = await fetch(
      `https://api-dev.devatech.us/api/v2/pages/find/?site=2&html_path=${pathname}`,
    );
    if (res.status === 404) {
        context.res.writeHead(301, {Location: "https://www.google.com"});
        context.res.end();
    }
    const data: WagtailPageDetail = await res.json();
    return { props: { wagtail: data } };
}
