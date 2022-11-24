import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

// in component, ctx is different than page, it's nested in the object
AppComponent.getInitialProps = async ({ Component, ctx }) => {
  const client = buildClient(ctx);
  const { data } = await client.get('/api/users/current-user');

  // you will not fetch the page props unless you invoke this in the component
  const pageProps =
    (Component.getInitialProps &&
      (await Component.getInitialProps(ctx, client, data.currentUser))) ||
    {};

  // pageProps is sent to the page
  return { ...data, pageProps };
};

export default AppComponent;
