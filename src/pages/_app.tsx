import * as React from "react";
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "Theme";
import createEmotionCache from "Emotion";
import { ApolloProvider } from '@apollo/client';

//Socket Context Provider
import SocketProvider from "Context/socket.context";

//Graphql Client
import { useApollo } from "Apollo/client";

const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const apolloClient = useApollo(pageProps.initialApolloState);
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <ApolloProvider client={apolloClient}>
          <SocketProvider>
            <CssBaseline />
            <Component {...pageProps} />
          </SocketProvider>
        </ApolloProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}