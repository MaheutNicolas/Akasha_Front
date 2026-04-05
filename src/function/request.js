import { ref } from "vue";
const defaultUri = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'akasha_token';

async function request( method = "GET", url = "/api") {
  const token = ref(localStorage.getItem(TOKEN_KEY) ?? null);
  
  await fetch(defaultUri + url, {
    method: method,
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.value}`
    },
    body: JSON.stringify({ email, password })
  })
  .then(res => {
    return res.json();
  });
}

export default request;