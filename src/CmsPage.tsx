import { GetServerSideProps } from "next";
import NextError from "next/error";
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
  return function CMSPage(props: WagtailProps) {
    if (props.status === 200) {
      const CMSComponent = routeToComponent(routes, props.wagtail.meta.type);

      if (CMSComponent) {
        return <CMSComponent />;
      }
      return <NextError statusCode={404} />;
    } else {
      return <NextError statusCode={props.status} />;
    }
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
  // We should handle other status codes than 200 and 404!
  if (res.status === 404) {
    context.res.statusCode = 404;
    return { props: { status: 404 } };
  }
  const data: WagtailPageDetail = await res.json();
  return { props: { wagtail: data, status: 200 } };
};
