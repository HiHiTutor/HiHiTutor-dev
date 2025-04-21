import React from "react";
import { Edit, SimpleForm, TextInput, NumberInput, ArrayInput, SimpleFormIterator, SelectInput, DateInput } from "react-admin";
import { useNavigate } from "react-router-dom";
import ApproveRejectButtons from "../components/ApproveRejectButtons";

const PendingCaseEdit = (props) => {
  const navigate = useNavigate();

  return (
    <Edit {...props}>
      <SimpleForm>
        <SelectInput source="postType" label="個案類型" choices={[
          { id: "student-seeking-tutor", name: "學生尋老師" },
          { id: "tutor-seeking-student", name: "老師招學生" },
        ]} />
        <TextInput source="postTitle" label="標題" />
        <TextInput source="location" label="上講地點" />
        <TextInput source="category" label="補習類別" />
        <ArrayInput source="subjects" label="補習科目">
          <SimpleFormIterator disableAdd disableRemove>
            <TextInput label="科目" />
          </SimpleFormIterator>
        </ArrayInput>
        <NumberInput source="rate" label="時薪 (HKD)" />
        <TextInput source="description" label="描述" multiline fullWidth />
        <TextInput source="status" label="狀態" />
        <DateInput source="createdAt" label="發布日期" disabled />

        <ApproveRejectButtons />

        <button
          onClick={() => navigate("/pending_cases")}
          style={{ marginTop: "20px", padding: "6px 12px", backgroundColor: "#1976d2", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          返回列表
        </button>
      </SimpleForm>
    </Edit>
  );
};

export default PendingCaseEdit;
