import { getCMSProps } from '../src/CmsPage';
import { GetServerSideProps } from "next";
import { default as Page }  from "./[...slug]";

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const wagtailProps = await getCMSProps(context);
    return wagtailProps;
}