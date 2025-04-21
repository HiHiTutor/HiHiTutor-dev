import React from "react";
import { Show, SimpleShowLayout, TextField, NumberField, DateField } from "react-admin";
import { useNavigate } from "react-router-dom";
import ApproveRejectButtons from "../components/ApproveRejectButtons";

const PendingCaseShow = (props) => {
  const navigate = useNavigate();

  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="postType" label="個案類型" />
        <TextField source="postTitle" label="標題" />
        <TextField source="location" label="上講地點" />
        <TextField source="category" label="補習類別" />
        <TextField source="subjects" label="補習科目" />
        <NumberField source="rate" label="時薪 (HKD)" />
        <TextField source="description" label="描述" />
        <TextField source="status" label="狀態" />
        <DateField source="createdAt" label="發布日期" />

        <ApproveRejectButtons />

        <button
          onClick={() => navigate("/pending_cases")}
          style={{
            marginTop: "20px",
            padding: "6px 12px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          返回列表
        </button>
      </SimpleShowLayout>
    </Show>
  );
};

export default PendingCaseShow;
