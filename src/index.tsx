import * as React from 'react';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import NextError from 'next/error';

const routeToComponent = (routes: WagtailRoutes, pageType: string) => {
  const route = routes.find((route) => route.type === pageType);
  return (route && route.component) || null;
};

const routeToDataFunction = (routes: WagtailRoutes, pageType: string) => {
  const route = routes.find((route) => route.type === pageType);
  return (route && route.fetchData) || null;
};

export interface WagtailRouterConfig {
  routes: WagtailRoutes;
  siteId: number;
  domain: string;
  apiPath?: string;
  previewPath?: string;
}

export interface GetCMSPropsOptions {
  overridePath?: string;
}

export function createRouter({
  routes = [],
  siteId,
  domain,
  apiPath = '/api/v2/pages/detail_by_path/',
  previewPath = '/api/v2/page_preview/1/',
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

  const getCMSProps = async (
    context: GetServerSidePropsContext,
    { overridePath }: GetCMSPropsOptions = {}
  ): Promise<GetServerSidePropsResult<WagtailProps>> => {
    let path =
      overridePath ??
      (context.req.url && context.req.url.split(/[#?]/)[0]) ??
      '';
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

  const getPreviewProps: GetServerSideProps<WagtailProps> = async (context) => {
    let url = new URL(domain + previewPath);
    url.search = new URLSearchParams({
      format: 'json',
      content_type: context.query.content_type as string,
      token: context.query.token as string,
    }).toString();
    const previewDataResponse = await fetch(url.toString());
    try {
      const previewData = await previewDataResponse.json();

      const fetchAdditionalData = routeToDataFunction(
        routes,
        previewData.meta.type
      );
      let extraProps: any;
      if (fetchAdditionalData) {
        extraProps = await fetchAdditionalData();
      }

      return {
        props: { ...extraProps, wagtail: previewData, status: 200 },
      };
    } catch (e) {
      return { props: { wagtail: null, status: 404 } };
    }
  };

  return { CMSPage, getCMSProps, getPreviewProps };
}

export interface WagtailRoute {
  type: string;
  component: React.ComponentType<unknown>;
  fetchData?: () => Promise<unknown>;
}

export type WagtailRoutes = WagtailRoute[];

interface WagtailMeta {
  type: string;
  detail_url: string;
  html_url: string;
  slug: string;
  first_published_at?: string;
}

export type WagtailMetaDetail = WagtailMeta & {
  show_in_menus: boolean;
  seo_title: string;
  search_description: string;
  parent: WagtailPage<
    Pick<WagtailMeta, 'type' | 'detail_url' | 'html_url'>
  > | null;
};

interface WagtailPage<Meta = WagtailMeta> {
  id: number;
  title: string;
  meta: Meta;
}

export type WagtailPageDetail<
  OtherProperties = {},
  Meta = WagtailMetaDetail
> = WagtailPage<Meta> & OtherProperties;

export type WagtailProps = WagtailPageProps | NotFoundWagtailProps;

export interface WagtailPageProps<T = {}> {
  wagtail: WagtailPageDetail<T>;
  status: 200;
}

// I want to just make this "number" but it makes WagtailProps not a discriminated union
interface NotFoundWagtailProps {
  status: 404 | 500;
}
