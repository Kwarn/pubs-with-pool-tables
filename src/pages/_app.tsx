import NavBar from "@/components/NavBar";
import "@/styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import client from "@/lib/apolloClient";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ApolloProvider client={client}>
        <NavBar />
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  );
}
