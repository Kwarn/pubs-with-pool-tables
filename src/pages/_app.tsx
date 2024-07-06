import "normalize.css";
import "@/styles/globals.css";
import { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "styled-components";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { UserStoreProvider } from "@/state/userStore";
import Head from "next/head";
import { useApollo } from "@/lib/apolloClient";
import NavBar from "@/components/NavBar";
import { defaultTheme } from "@/styles/themes";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);

  return (
    <UserProvider>
      <UserStoreProvider>
        <ApolloProvider client={apolloClient}>
          <ThemeProvider theme={defaultTheme}>
            <Head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
            </Head>
            <NavBar />
            <SpeedInsights />
            <Component {...pageProps} />
          </ThemeProvider>
        </ApolloProvider>
      </UserStoreProvider>
    </UserProvider>
  );
}
