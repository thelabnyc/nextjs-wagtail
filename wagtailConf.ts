import dynamic from "next/dynamic";

import { createRouter } from "./src/index";

export const { CMSPage, getCMSProps, getPreviewProps } = createRouter({
    siteId: 2,
    domain: "http://localhost:8000",
    routes: [
        {
            type: "sandbox.BarPage",
            component: dynamic(
                () => import("./components/wagtail/sandbox.BarPage"),
            ),
        },
        {
            type: "sandbox.FooPage",
            component: dynamic(
                () => import("./components/wagtail/sandbox.FooPage"),
            ),
            fetchData: () =>
                import("./components/wagtail/sandbox.FooPage").then((x) =>
                    x.getServerSideProps(),
                ),
        },
    ],
});
