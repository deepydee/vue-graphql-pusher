import './assets/main.css'

import { createApp, provide, h } from 'vue'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { createPinia } from 'pinia'
import { ApolloLink } from 'apollo-link'
import { LOCALSTORAGE_TOKEN_KEY } from '@/constants'

// pusher.js
import Pusher from 'pusher-js'
import PusherLink from './PusherLink.js'

import App from './App.vue'
import router from './router'

const pusherLink = new PusherLink({
  pusher: new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, {
    wsHost: import.meta.env.VITE_PUSHER_HOST,
    wsPort: import.meta.env.VITE_PUSHER_PORT,
    wssPort: import.meta.env.VITE_PUSHER_PORT,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: false,
    authEndpoint: `${import.meta.env.VITE_API_LOCATION}/graphql/subscriptions/auth`,
    auth: {
      headers: {
        authorization: `${localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)}`
      }
    }
  })
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY)

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL
})

const cache = new InMemoryCache()
const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, pusherLink, httpLink]),
  cache
})

createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
  },

  render: () => h(App)
})
  .use(createPinia())
  .use(router)
  .mount('#app')
