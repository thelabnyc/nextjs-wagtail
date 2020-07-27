import { CMSPage, getCMSProps } from '../wagtailConf';

/* If you need to customize page:

const CustomPage = (props: WagtailProps) => {
  if (props.status >= 200) return <NextError statusCode={props.status} />

  return (
    <div>
      <h1>hi</h1>
      <CMSPage {...props} />
    </div>
  )
}
export default CustomPage

*/
export default CMSPage;

/* If you need to customize getServerSideProps

export const getServerSideProps: GetServerSideProps = async (context) => {
  const wagtailProps = await getCMSProps(context)
  return {
    ...wagtailProps,
    props: {
      ...wagtailProps.props,
      myCoolProp: 42,
    }
  }
}

*/
export const getServerSideProps = getCMSProps;
