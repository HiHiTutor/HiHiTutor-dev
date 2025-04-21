import React from "react";
import { useNavigate } from "react-router-dom";
import { Show, SimpleShowLayout, TextField, NumberField, BooleanField } from "react-admin";

const CaseShow = (props) => {
  const navigate = useNavigate();

  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="postTitle" label="補習標題" />
        <TextField source="category" label="補習類別" />
        <TextField source="subjects" label="補習科目" />
        <TextField source="location" label="補習地點" />
        <NumberField source="rate" label="每堂學費 (HKD)" />
        <NumberField source="duration" label="每堂時長 (分鐘)" />
        <TextField source="status" label="個案狀態" />
        <TextField source="pairedUserId" label="配對對象 ID" />
        <BooleanField source="paymentConfirmed" label="已付款確認" />
        <BooleanField source="completed" label="已完成" />
        <TextField source="id" label="個案 ID" />

        <button onClick={() => navigate(-1)} style={{ marginTop: "10px", padding: "5px 10px" }}>
          返回
        </button>
      </SimpleShowLayout>
    </Show>
  );
};

export default CaseShow;
