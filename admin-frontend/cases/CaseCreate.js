import React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  ArrayInput,
  SimpleFormIterator
} from "react-admin";

const CaseCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <SelectInput
        source="postType"
        label="個案類型"
        choices={[
          { id: "student-seeking-tutor", name: "學生尋老師" },
          { id: "tutor-seeking-student", name: "老師招學生" },
        ]}
        validate={[required()]}
      />
      <TextInput source="postTitle" label="標題" validate={[required()]} />
      <TextInput source="location" label="上堂地點" validate={[required()]} />
      <TextInput source="category" label="補習類別" validate={[required()]} />

      <ArrayInput source="subjects" label="補習科目" validate={[required()]}>
        <SimpleFormIterator>
          <TextInput label="科目" />
        </SimpleFormIterator>
      </ArrayInput>

      <NumberInput source="rate" label="時薪 (HKD)" validate={[required()]} />
      <TextInput source="description" label="描述" multiline fullWidth validate={[required()]} />
    </SimpleForm>
  </Create>
);

const required = (message = "必填") => (value) =>
  value ? undefined : message;

export default CaseCreate;
