import { ComponentType } from "react";

export interface WagtailRoute {
  type: string;
  component: ComponentType<unknown>;
}

export type WagtailRoutes = WagtailRoute[];

interface WagtailMeta {
  type: string;
  detail_url: string;
  html_url: string;
  slug: string;
  first_published_at?: string;
}

export interface WagtailMetaDetail extends WagtailMeta {
  show_in_menus: boolean;
  seo_title: string;
  search_description: string;
  parent: WagtailPage | null;
}

interface WagtailPageBase {
  id: number;
  title: string;
}

export interface WagtailPage extends WagtailPageBase {
  meta: WagtailMeta;
}

export interface WagtailPageDetail extends WagtailPageBase {
  meta: WagtailMetaDetail;
}

export type WagtailProps = FoundWagtailProps | NotFoundWagtailProps;

interface FoundWagtailProps {
  wagtail: WagtailPageDetail;
  status: 200;
}

interface NotFoundWagtailProps {
  status: 404 | 500;
}
