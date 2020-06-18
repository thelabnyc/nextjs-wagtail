import { GetServerSideProps } from "next";
import {
  WagtailRouterConfig,
  WagtailPageDetail,
  WagtailProps,
} from "./interfaces";

const routeToComponent = (routes: WagtailRouterConfig, pageType: string) => {
  const route = routes.find((route) => route.type === pageType);
  return route?.component;
};

export function createRouter(routes: WagtailRouterConfig) {
  return function CMSPage({ wagtail }: WagtailProps) {
    const CMSComponent = routeToComponent(routes, wagtail.meta.type);

    if (CMSComponent) {
      return <CMSComponent />;
    }
    return <h1>Hello not found</h1>;
  };
}

export const getCMSProps: GetServerSideProps<WagtailProps> = async (
  context
) => {
  const slug = context.query?.slug;
  let path: string = "/";
  if (slug) {
    if (Array.isArray(slug)) {
      path += slug.join("/");
    } else {
      path += slug;
    }
  }
  const siteId = "2";
  const domain = "http://localhost:8000";
  const apiPath = "/api/v2/pages/detail_by_path/";
  const params = {
    html_path: path,
    site: siteId,
  };
  let url = new URL(domain + apiPath);
  url.search = new URLSearchParams(params).toString();
  const res = await fetch(url.toString());
  if (res.status === 404) {
    context.res.writeHead(404);
    return { props: {} as any };
  }
  const data: WagtailPageDetail = await res.json();
  return { props: { wagtail: data } };
};
