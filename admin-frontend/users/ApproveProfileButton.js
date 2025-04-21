// 📁 src/users/ApproveProfileButton.js
import React from "react";
import { useNotify, useRefresh, useRedirect, useRecordContext } from "react-admin";

const ApproveProfileButton = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();

  const handleApprove = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/profiles/approve/${record.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "審批失敗");
      }

      notify("✅ Profile 已成功審批");
      refresh();
      redirect("/users");
    } catch (error) {
      notify(`❌ 錯誤: ${error.message}`, { type: "error" });
    }
  };

  return (
    <button onClick={handleApprove} style={{ marginTop: 20, padding: "6px 12px" }}>
      ✅ 審批 Profile
    </button>
  );
};

export default ApproveProfileButton;
