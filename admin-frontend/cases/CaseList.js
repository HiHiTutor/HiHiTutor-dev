import React from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  useRecordContext,
} from "react-admin";

const CaseList = (props) => {
  return (
    <List {...props}>
      <Datagrid rowClick="show">
        <TextField source="postTitle" label="補習標題" />
        <TextField source="category" label="補習類別" />
        <TextField source="subjects" label="補習科目" />
        <TextField source="location" label="補習地點" />
        <NumberField source="rate" label="每堂學費 (HKD)" />
        <NumberField source="duration" label="每堂時長 (分鐘)" />
        <TextField source="status" label="個案狀態" />  {/* ✅ 新增個案狀態 */}
        <TextField source="id" label="個案 ID" />
        <DateField source="createdAt" label="創立日期" showTime />
      </Datagrid>
    </List>
  );
};

export default CaseList;
