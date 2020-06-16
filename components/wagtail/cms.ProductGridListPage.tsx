// import fetch from 'node-fetch';
import { GetServerSideProps } from 'next';

const HomePage = (props: unknown) => {
  return (
    <div>
      product grid hi
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

export default HomePage;
