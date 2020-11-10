import * as React from 'react';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';

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
  redirectPath?: string;
  NotFoundPage?: React.ComponentType<any>;
}

export interface GetCMSPropsOptions {
  overridePath?: string;
}

function DefaultNotFoundPage() {
  return (
    <div>
      You've rendered a page without handling that page type! Pass your{' '}
      <code>pages/_404.js</code> page into nextjs-wagtail to use your 404 page
      here
    </div>
  );
}

export function createRouter({
  routes = [],
  siteId,
  domain,
  apiPath = '/api/v2/pages/detail_by_path/',
  previewPath = '/api/v2/page_preview/1/',
  redirectPath = '/api/redirects',
  NotFoundPage = DefaultNotFoundPage,
}: WagtailRouterConfig) {
  // async function findRedirectAt(
  //   path: string
  // ): Promise<
  //   | {
  //       old_path: string;
  //       is_permanent: boolean;
  //       site: number;
  //       link: string;
  //     }
  //   | undefined
  // > {
  //   const url = new URL(domain + redirectPath);
  //   url.search = new URLSearchParams({
  //     old_path: path,
  //     site_id: `${siteId}`,
  //   }).toString();
  //   const response = await fetch(url.toString());
  //   const data = await response.json();

  //   return data[0];
  // }

  function CMSPage(props: WagtailPageProps) {
    const CMSComponent = routeToComponent(routes, props.wagtail.meta.type);
    if (CMSComponent) {
      return <CMSComponent {...props} />;
    }
    return <NotFoundPage {...props} />;
  }

  const getCMSProps = async (
    context: GetServerSidePropsContext,
    { overridePath }: GetCMSPropsOptions = {}
  ): Promise<GetServerSidePropsResult<WagtailPageProps>> => {
    let path =
      overridePath ??
      (context.req.url && context.req.url.split(/[#?]/)[0]) ??
      '';

    // If you find a redirect with that path, return the redirect
    // Disabled for now because it would mean api calls per request
    // const redirect = await findRedirectAt(path);
    // if (redirect) {
    //   return {
    //     redirect: {
    //       destination: redirect.link,
    //       permanent: redirect.is_permanent,
    //     },
    //   };
    // }

    const params = {
      html_path: path,
      site: siteId.toString(),
    };
    let url = new URL(domain + apiPath);
    url.search = new URLSearchParams(params).toString();
    const res = await fetch(url.toString());
    // If the cms can't find the page just 404
    if (res.status >= 400) {
      return { notFound: true };
    }
    const data: WagtailPageDetail = await res.json();

    const fetchAdditionalData = routeToDataFunction(routes, data.meta.type);
    let extraProps: any;
    if (fetchAdditionalData) {
      extraProps = await fetchAdditionalData(context);
    }

    return { props: { ...extraProps, wagtail: data } };
  };

  const getPreviewProps: GetServerSideProps<WagtailPageProps> = async (
    context
  ) => {
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
        extraProps = await fetchAdditionalData(context);
      }

      return {
        props: { ...extraProps, wagtail: previewData },
      };
    } catch (e) {
      return { notFound: true };
    }
  };

  return { CMSPage, getCMSProps, getPreviewProps };
}

export interface WagtailRoute {
  type: string;
  component: React.ComponentType<any>;
  fetchData?: (context: GetServerSidePropsContext) => Promise<any>;
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

export interface WagtailPageProps<T = {}> {
  wagtail: WagtailPageDetail<T>;
}
