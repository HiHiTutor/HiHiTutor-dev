import React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  ArrayInput,
  SimpleFormIterator,
  SelectInput,
  ImageField,
  ImageInput
} from "react-admin";

const UserEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      {/* ✅ 你原有的基本欄位 */}
      <TextInput source="name" label="名稱" />
      <TextInput source="email" label="電郵" />
      <TextInput source="phone" label="電話" />
      <DateInput source="birthdate" label="出生日期" />
      <SelectInput
        source="userType"
        label="用戶類型"
        choices={[
          { id: "individual", name: "個人用戶" },
          { id: "organization", name: "機構用戶" }
        ]}
      />
      <ArrayInput source="tags" label="標籤">
        <SimpleFormIterator>
          <TextInput />
        </SimpleFormIterator>
      </ArrayInput>

      {/* ✅ 新增：latestProfile 相關欄位 */}
      <TextInput source="profile.latestProfile.education" label="學歷背景" fullWidth />
      <TextInput source="profile.latestProfile.experience" label="教學經驗" fullWidth />
      <TextInput source="profile.latestProfile.introduction" label="自我介紹" multiline fullWidth />

      {/* ✅ 新增：上傳個人頭像 */}
      <ImageInput
        source="profile.latestProfile.avatar"
        label="個人頭像（清晰五官）"
        accept="image/*"
      >
        <ImageField source="src" title="title" />
      </ImageInput>

      {/* ✅ 新增：上傳證書（可多張） */}
      <ImageInput
        source="profile.latestProfile.certificates"
        label="相關證書上傳"
        accept="image/*"
        multiple
      >
        <ImageField source="src" title="title" />
      </ImageInput>
{/* ✅ 機構用戶：上傳 BR / CR / 地址證明 */}
<ImageInput
  source="organizationDocs.businessRegistration"
  label="商業登記（BR）"
  accept="image/*,application/pdf"
>
  <ImageField source="src" title="title" />
</ImageInput>

<ImageInput
  source="organizationDocs.addressProof"
  label="地址證明"
  accept="image/*,application/pdf"
>
  <ImageField source="src" title="title" />
</ImageInput>

    </SimpleForm>
  </Edit>
);

export default UserEdit;
