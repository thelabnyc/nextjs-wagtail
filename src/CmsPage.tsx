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
    const pathname = "/";
    const params = {
        "html_path": pathname,
        "site": "2"
    };
    let url = new URL("http://localhost:8000/api/v2/pages/detail_by_path/")
    url.search = new URLSearchParams(params).toString();
    const res = await fetch(url.toString());
    if (res.status === 404) {
        context.res.writeHead(301, {Location: "https://www.google.com"});
        context.res.end();
    }
    const data: WagtailPageDetail = await res.json();
    return { props: { wagtail: data } };
}
