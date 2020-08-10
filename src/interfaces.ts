import { ComponentType } from 'react';

export interface WagtailRoute {
  type: string;
  component: ComponentType<unknown>;
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
