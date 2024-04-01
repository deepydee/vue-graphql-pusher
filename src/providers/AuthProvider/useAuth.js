import { inject } from 'vue'
import { AUTH_PROVIDER_KEY } from '@/constants'

export function useAuth() {
  const store = inject(AUTH_PROVIDER_KEY)

  if (!store) {
    throw new Error('Auth store has not been instantiated')
  }

  return store
}
