// import fetch from 'node-fetch';
import { GetServerSideProps } from 'next';

const BarPage = (props: unknown) => {
  return (
    <div>
      hi bar
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

export default BarPage;
