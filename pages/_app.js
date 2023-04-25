import '@/styles/globals.css'
import Head from 'next/head'
import { useRouter } from 'next/router';
import { StoreProvider } from '@/utils/Store';
import { SessionProvider, useSession } from 'next-auth/react';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossOrigin="anonymous"></script>
      </Head>
      <div className='container'>
        <StoreProvider>
          {Component.auth ? (
            <Auth adminOnly={Component.auth.adminOnly}>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </StoreProvider>
      </div>
    </SessionProvider>
  );


  function Auth({ children, adminOnly }) {
    const router = useRouter();
    const { status, data: session } = useSession({
      required: true,
      onUnauthenticated() {
        router.push('/unauthorized?message=login required');
      },
    });
    if (status === 'loading') {
      return <div>Loading...</div>;
    }
    if (adminOnly && !session.user.isAdmin) {
      router.push('/unauthorized?message=admin login required');
    }

    return children;
  }


}
