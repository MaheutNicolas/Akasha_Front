const defaultUri = import.meta.env.VITE_API_URL;

async function request( method = "GET", url = "/api") {
    await fetch(defaultUri + url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
}