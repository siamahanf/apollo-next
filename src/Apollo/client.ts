import { useMemo } from 'react'
import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject } from '@apollo/client'
import merge from "ts-deepmerge";
import { getCookie } from "cookies-next";

//Initialize apolloClient
let apolloClient: ApolloClient<NormalizedCacheObject>;

//Creating link
function createIsomorphLink() {
    return new HttpLink({
        uri: "http://localhost:5000/piechat",
        credentials: 'same-origin'
    })
}

//Create apollo client
function createApolloClient() {
    return new ApolloClient({
        ssrMode: typeof window === 'undefined',
        link: createIsomorphLink(),
        cache: new InMemoryCache(),
        defaultOptions: {
            query: {
                errorPolicy: "all",
                context: {
                    headers: {
                        authorization: `Bearer ${getCookie("session")}`
                    }
                }
            },
            mutate: {
                errorPolicy: "all",
                context: {
                    headers: {
                        authorization: `Bearer ${getCookie("session")}`
                    }
                }
            }
        }
    })
}

//Initialize Apollo
export function initializeApollo(initialState = null) {
    const _apolloClient = apolloClient ?? createApolloClient()
    if (initialState) {
        const existingCache = _apolloClient.extract()
        const data = merge(initialState, existingCache)
        _apolloClient.cache.restore(data)
    }
    if (typeof window === 'undefined') return _apolloClient
    if (!apolloClient) apolloClient = _apolloClient
    return _apolloClient
}

//Use Apollo
export function useApollo(initialState: any) {
    const store = useMemo(() => initializeApollo(initialState), [initialState])
    return store;
}