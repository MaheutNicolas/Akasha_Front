import { ref } from "vue";
import useAuth from './useAuth';

const defaultUri = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'akasha_token';
const { logout } = useAuth();

async function request(method = "GET", url = "/api", body = null) {
  const token = localStorage.getItem(TOKEN_KEY);

  const res = await fetch(defaultUri + url, {
    method,
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: method === 'GET' ? null : JSON.stringify(body)
  });

  const data = await res.json();

  if (res.status >= 400 && res.status < 500) {
    console.dir(data);
    logout();
  }

  return data;
}

export default request;