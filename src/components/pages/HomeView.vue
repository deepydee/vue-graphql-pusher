<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '@/providers/AuthProvider/useAuth'
import { watchEffect } from 'vue'

const router = useRouter()
const { isLoggedIn } = useAuth()

watchEffect(() => {
  if (isLoggedIn.value) {
    router.push('/report')
  }
})
</script>

<template>
  <div class="container mx-auto">
    <h1>Home</h1>
  </div>
</template>
