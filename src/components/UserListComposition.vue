<script setup>
import { ref, computed } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { useMutation } from '@vue/apollo-composable'
import gql from 'graphql-tag'

const page = ref(1)
const perPage = ref(10)
const paginator = ref(null)

const USERS_QUERY = gql`
  query listTasks($perPage: Int!, $page: Int!) {
    users(first: $perPage, page: $page) {
      paginatorInfo {
        count
        currentPage
        firstItem
        hasMorePages
        lastItem
        lastPage
        perPage
        total
      }
      data {
        id
        name
      }
    }
  }
`

const GENERATE_REPORT = gql`
  mutation generateReport {
    generateReport
  }
`

const nextPage = () => {
  if (page.value === paginator.value.lastPage) {
    return
  }

  page.value++
}

const previousPage = () => {
  if (page.value === 1) {
    return
  }

  page.value--
}

const { result, loading, error, onResult } = useQuery(USERS_QUERY, () => ({
  perPage: perPage.value,
  page: page.value
}))

onResult((queryResult) => {
  paginator.value = queryResult.data?.users.paginatorInfo
})

const users = computed(() => result.value?.users.data ?? [])

const { mutate: generateReport } = useMutation(GENERATE_REPORT)
</script>

<template>
  <h1>User List</h1>
  <div v-if="error">Error: {{ error.message }}</div>
  <div v-if="loading">Loading...</div>

  <ul v-if="users">
    <li v-for="user of users" :key="user.id">{{ user.name }}</li>
  </ul>

  <div v-if="paginator">
    <div>Page: {{ paginator.currentPage }} / {{ paginator.lastPage }}</div>
    <div>Displaying {{ paginator.count }} entries out of {{ paginator.total }}</div>
    <div>
      <button @click="previousPage">&larr; Previous</button>
      <button @click="nextPage">Next &rarr;</button>
    </div>
  </div>

  <button @click="generateReport">Generate Report</button>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
