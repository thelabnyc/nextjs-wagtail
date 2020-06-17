// import fetch from 'node-fetch';
import { GetServerSideProps } from 'next';

const FooPage = (props: unknown) => {
  return (
    <div>
      hi Foo
      <pre>
        <code>{JSON.stringify(props, null, 2)}</code>
      </pre>
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
