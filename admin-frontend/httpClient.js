import { fetchUtils } from "react-admin";

const API_URL = "http://localhost:5000/api"; // ✅ 請確保這是你的後端 API 地址

const httpClient = async (url, options = {}) => {
  options.headers = new Headers(options.headers || {});

  // ✅ 確保 LocalStorage 內的 Token 正確
  let authToken = localStorage.getItem("authToken");
  let refreshToken = localStorage.getItem("refreshToken");

  if (!authToken || authToken === "undefined" || authToken === "null") {
    console.warn("⚠️ Token 無效，請重新登入");
    return Promise.reject(new Error("未授權，請重新登入"));
  }

  authToken = authToken.replace(/['"]+/g, ""); // ✅ 移除多餘的引號
  options.headers.set("Authorization", `Bearer ${authToken}`);
  options.headers.set("Content-Type", "application/json");

  try {
    // 🚀 嘗試發送 API 請求
    const response = await fetchUtils.fetchJson(`${API_URL}${url}`, options);
    return response;
  } catch (error) {
    if (error.status === 401 && refreshToken) {
      console.warn("🔄 401 Unauthorized - 嘗試刷新 Token");

      try {
        // 🚀 發送 Refresh Token API 請求
        const refreshResponse = await fetch(`${API_URL}/users/refresh-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!refreshResponse.ok) {
          console.error("❌ Refresh Token 失敗");
          throw new Error("未授權，請重新登入");
        }

        const { token: newToken } = await refreshResponse.json();
        console.log("✅ Token 刷新成功:", newToken);

        // ✅ 更新 LocalStorage
        localStorage.setItem("authToken", newToken);

        // ✅ 重新發送原來的 API 請求
        options.headers.set("Authorization", `Bearer ${newToken}`);
        return await fetchUtils.fetchJson(`${API_URL}${url}`, options);
      } catch (refreshError) {
        console.error("❌ 無法刷新 Token，請重新登入");
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        return Promise.reject(new Error("未授權，請重新登入"));
      }
    }

    throw error;
  }
};

export default httpClient;
