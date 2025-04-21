const authProvider = {
  // 登入：將 token 存入 localStorage
  login: async ({ username, password }) => {
    const loginUrl = "https://hihitutor-backend.onrender.com/api/users/login";

    const res = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: username, password }), // ✅ 改呢行
    });

    if (!res.ok) {
      throw new Error("登入失敗");
    }

const data = await res.json();

// 🔐 解碼 JWT token（拿到角色）
const token = data.token;
const payload = JSON.parse(atob(token.split(".")[1]));
const role = payload.user.role;

// ✅ 檢查是否 admin，否則不給登入
if (role !== "admin") {
  throw new Error("你沒有權限登入後台");
}

// ✅ 儲存 token（照用原本 key）
localStorage.setItem("authToken", token);
  },

  logout: () => {
    localStorage.removeItem("authToken"); // ✅ 同樣改 key
    return Promise.resolve();
  },

  checkAuth: () => {
    return localStorage.getItem("authToken") ? Promise.resolve() : Promise.reject();
  },

  checkError: (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("authToken"); // ✅ 同樣改 key
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getPermissions: () => Promise.resolve(),

  // ✅ 提供 token 給 httpClient 使用
  getToken: () => localStorage.getItem("authToken"),
};

export default authProvider;
