import { GetServerSideProps } from "next";
import Link from "next/link";

const BarPage = (props: unknown) => {
  return (
    <div>
      hi bar
      <Link href="/[...slug]" as="/foo">
        <a>Go to foo</a>
      </Link>
      <pre>
        <code>{JSON.stringify(props, null, 2)}</code>
      </pre>
      baaaaaaaaaaaaaaaaaaar
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      cmsData: context.query.wagtailData,
    },
  };
};

export default BarPage;
