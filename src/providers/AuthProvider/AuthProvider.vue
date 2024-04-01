<script setup>
import { computed, provide } from 'vue'
import { useMutation, useQuery, useApolloClient } from '@vue/apollo-composable'
import CurrentUser from './apollo/CurrentUser.gql'
import SignUp from './apollo/SignUp.gql'
import Login from './apollo/Login.gql'
import { AUTH_PROVIDER_KEY, LOCALSTORAGE_TOKEN_KEY } from '@/constants'

const { resolveClient } = useApolloClient()

const { result, loading } = useQuery(CurrentUser)

const { mutate: signUp } = useMutation(SignUp, {
  update(cache, { data }) {
    if (data?.signUp?.token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, data.signUp.token)
    }
  },
  refetchQueries: ['CurrentUser']
})

const { mutate: login } = useMutation(Login, {
  update(cache, { data }) {
    if (data?.login?.token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, data.login.token)
    }
  },
  refetchQueries: ['CurrentUser']
})

async function logOut() {
  localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY)
  const apolloClient = resolveClient()
  await apolloClient.clearStore()
  await apolloClient.resetStore()
}

provide(AUTH_PROVIDER_KEY, {
  user: computed(() => result.value?.me),
  isLoggedIn: computed(() => !!result.value?.me.id),
  loading,
  signUp,
  login,
  logOut
})
</script>

<template>
  <slot />
</template>
