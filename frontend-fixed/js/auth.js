
// frontend/auth.js - auth helpers with token storage
const API = window.API || "http://localhost:5001/api";

function setAuth(token) {
  localStorage.setItem("token", token);
}

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { "Authorization": "Bearer " + token } : {};
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

// UI: login/register form handling
document.addEventListener("DOMContentLoaded", ()=>{
  const form = document.getElementById("authForm");
  if (!form) return;
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const message = document.getElementById("message");

  loginBtn.addEventListener("click", async (e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    try {
      const res = await fetch(API + "/auth/login", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      setAuth(data.token);
      localStorage.setItem("user", JSON.stringify(data.user || {}));
      message.innerText = "Logged in";
      window.location.href = "index.html";
    } catch (err) {
      message.innerText = err.message;
    }
  });

  registerBtn.addEventListener("click", async (e)=>{
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    try {
      const res = await fetch(API + "/auth/register", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Register failed");
      setAuth(data.token);
      localStorage.setItem("user", JSON.stringify(data.user || {}));
      message.innerText = "Registered";
      window.location.href = "index.html";
    } catch (err) {
      message.innerText = err.message;
    }
  });
});

// Export helpers for other scripts
window.getAuthHeader = getAuthHeader;
window.logout = logout;
