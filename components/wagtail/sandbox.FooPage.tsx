import { GetServerSideProps } from 'next';
import Link from 'next/link'

const FooPage = (props: unknown) => {
  return (
    <div>
      hi Foo
      <Link href="/[...slug]" as="/bar"><a>Go to bar</a></Link>
      <pre>
        <code>{JSON.stringify(props, null, 2)}</code>
      </pre>
      Foooooooooooooooooooooooooooooooooooooooooo
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

export default FooPage;
