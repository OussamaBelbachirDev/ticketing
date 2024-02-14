import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  console.log('*********** ', currentUser);
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

// Executed On The Server
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
    console.log('pageProps     ', pageProps);
  }
  return { ...data, pageProps };
};
export default AppComponent;

// const response = await axios.get(
//   'http://auth-srv:3000/api/users/currentuser'
// );
//  works just fine !!!!

// http://ingress-nginx-controller.ingress-nginx.svc.cluster.local
