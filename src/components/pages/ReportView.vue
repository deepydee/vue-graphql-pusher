<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '@/providers/AuthProvider/useAuth'
import { watchEffect, watch, ref } from 'vue'
import { useMutation, useSubscription } from '@vue/apollo-composable'
import BaseButton from '@/components/BaseButton/BaseButton.vue'
import GenerateReport from './apollo/GenerateReport.gql'
import ReportExportStatusUpdated from './apollo/ReportExportStatusUpdated.gql'

const router = useRouter()
const { isLoggedIn, user, logOut } = useAuth()

const { mutate: generateReport, onDone } = useMutation(GenerateReport)
const { result: subscribeReportStausUpdate } = useSubscription(ReportExportStatusUpdated)

const message = ref('')
const downloadLink = ref('')

watch(
  subscribeReportStausUpdate,
  (data) => {
    message.value = data.reportExportStatusUpdated.message
    downloadLink.value = data.reportExportStatusUpdated.link
    console.log('New message received:', data.reportExportStatusUpdated.message)
  },
  {
    lazy: true // Don't immediately execute handler
  }
)

onDone((result) => {
  console.log(result.data)
})

watchEffect(() => {
  if (!isLoggedIn.value) {
    router.push('/login')
    router.push('/registration')
  }
})
</script>

<template>
  <h1 class="mb-2 text-2xl">Report Generation</h1>
  <p v-if="user.name" class="mb-2">Hello, {{ user.name }}</p>
  <BaseButton type="submit" @click="logOut">Log out</BaseButton>
  <BaseButton type="button" @click="generateReport">Generate Report</BaseButton>
  <p v-if="message">{{ message }}</p>
  <a v-if="downloadLink" :href="downloadLink" target="_blank">Download</a>
</template>
