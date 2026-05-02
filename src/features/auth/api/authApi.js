// src/features/auth/api/authApi.js

export const registerUser = async (data) => {
  const response = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // credentials: "include", // 🔥 required for cookies
    body: JSON.stringify({
      username: data.username,
      email: data.email.toLowerCase(), // normalize
      password: data.password,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
};
