// ✅ 審批／拒批按鈕元件（共用）
import React from "react";
import { useNotify, useRedirect, useRecordContext } from "react-admin";

const apiUrl = "https://hihitutor-backend.onrender.com/api"; // ✅ 改為正式網址

const ApproveRejectButtons = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const record = useRecordContext();

  const handleApprove = async () => {
    try {
      const res = await fetch(`${apiUrl}/cases/${record.id}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const result = await res.json();
      if (res.ok) {
        notify("✅ 個案已成功審批");
        redirect("/pending_cases");
      } else {
        notify(`❌ 審批失敗: ${result.error || result.msg}`, { type: "error" });
      }
    } catch (err) {
      notify("❌ 發生錯誤，請稍後再試", { type: "error" });
    }
  };

  const handleReject = async () => {
    try {
      const res = await fetch(`${apiUrl}/cases/${record.id}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const result = await res.json();
      if (res.ok) {
        notify("❌ 個案已被拒絕");
        redirect("/pending_cases");
      } else {
        notify(`❌ 拒絕失敗: ${result.error || result.msg}`, { type: "error" });
      }
    } catch (err) {
      notify("❌ 發生錯誤，請稍後再試", { type: "error" });
    }
  };

  return (
    <div style={{ marginTop: 16 }}>
      <button onClick={handleApprove} style={{ marginRight: 10 }}>✅ 審批</button>
      <button onClick={handleReject}>❌ 拒批</button>
    </div>
  );
};

export default ApproveRejectButtons;
