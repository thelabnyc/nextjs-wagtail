import { GetServerSideProps } from "next";
import NextError from "next/error";
import { WagtailRoutes, WagtailPageDetail, WagtailProps } from "./interfaces";

const routeToComponent = (routes: WagtailRoutes, pageType: string) => {
  const route = routes.find((route) => route.type === pageType);
  return route?.component;
};

const routeToDataFunction = (routes: WagtailRoutes, pageType: string) => {
  const route = routes.find((route) => route.type === pageType);
  return route?.fetchData;
};

export interface WagtailRouterConfig {
  routes: WagtailRoutes;
  siteId: number;
  domain: string;
  apiPath?: string;
}

export function createRouter({
  routes = [],
  siteId,
  domain,
  apiPath = "/api/v2/pages/detail_by_path/",
}: WagtailRouterConfig) {
  function CMSPage(props: WagtailProps) {
    if (props.status === 200) {
      const CMSComponent: any = routeToComponent(
        routes,
        props.wagtail.meta.type
      );

      if (CMSComponent) {
        return <CMSComponent {...props} />;
      }
      return <NextError statusCode={404} />;
    } else {
      return <NextError statusCode={props.status} />;
    }
  }

  const getCMSProps: GetServerSideProps<WagtailProps> = async (context) => {
    const slug = context.query?.slug;
    let path: string = "/";
    if (slug) {
      if (Array.isArray(slug)) {
        path += slug.join("/");
      } else {
        path += slug;
      }
    }
    const params = {
      html_path: path,
      site: siteId.toString(),
    };
    let url = new URL(domain + apiPath);
    url.search = new URLSearchParams(params).toString();
    const res = await fetch(url.toString());
    // We should handle other status codes than 200 and 404!
    if (res.status === 404) {
      context.res.statusCode = 404;
      return { props: { status: 404 } };
    }
    const data: WagtailPageDetail = await res.json();

    const fetchAdditionalData = routeToDataFunction(routes, data.meta.type);
    let extraProps: any;
    if (fetchAdditionalData) {
      extraProps = await fetchAdditionalData();
    }

    return { props: { ...extraProps, wagtail: data, status: 200 } };
  };

  return { CMSPage, getCMSProps };
}
