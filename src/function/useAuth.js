import { ref, computed } from 'vue';

const defaultUri = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'akasha_token'
const USER_KEY  = 'akasha_user'

const token = ref(localStorage.getItem(TOKEN_KEY) ?? null);
const user  = ref(JSON.parse(localStorage.getItem(USER_KEY) ?? 'null'));

function useAuth() {

  const isLoggedIn = computed(() => !!token.value)

  async function login(email, password) {
    const res = await fetch(defaultUri+'/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (!res.ok) throw new Error('Identifiants invalides')

    const data = await res.json()

    token.value = data.token
    user.value  = data.user

    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
  }

  function logout() {
    token.value = null
    user.value  = null

    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  function getAuthHeader() {
    return token.value
      ? { Authorization: `Bearer ${token.value}` }
      : {}
  }

  return { token, user, isLoggedIn, login, logout, getAuthHeader }
}

export default useAuth;