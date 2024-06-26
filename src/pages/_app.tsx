import NavBar from "@/components/NavBar";
import "@/styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import client from "@/lib/apolloClient";
import React from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { UserStoreProvider } from "@/state/userStore";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <UserStoreProvider>
        <ApolloProvider client={client}>
          <NavBar />
          <Component {...pageProps} />
        </ApolloProvider>
      </UserStoreProvider>
    </UserProvider>
  );
}
