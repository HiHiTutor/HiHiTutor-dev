import React from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  FunctionField
} from "react-admin";

const UserList = (props) => {
  // 加 rowStyle 函數：有未審批 profile 時整行變黃
  const rowStyle = (record) => {
    const latest = JSON.stringify(record.profile?.latestProfile || {});
    const approved = JSON.stringify(record.profile?.approvedProfile || {});
    const hasPending = latest !== approved;

    return hasPending ? { backgroundColor: "#fff7cc" } : {};
  };

  return (
    <List {...props}>
      <Datagrid rowClick="show" rowStyle={rowStyle}>
        <TextField source="userCode" label="用戶編號" />

        <FunctionField
          label="名稱"
          render={(record) => {
            const latest = JSON.stringify(record.profile?.latestProfile || {});
            const approved = JSON.stringify(record.profile?.approvedProfile || {});
            const hasPending = latest !== approved;
            return hasPending ? `${record.name} 🟡` : record.name;
          }}
        />

        <TextField source="phone" label="電話號碼" />
        <EmailField source="email" label="電郵" />
        <FunctionField
          label="標籤"
          render={(record) => record.tags?.join(", ")}
        />
        <DateField source="createdAt" label="創立日期" showTime />
      </Datagrid>
    </List>
  );
};

export default UserList;
