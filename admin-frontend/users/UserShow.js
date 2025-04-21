import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  EmailField,
  DateField,
  ArrayField,
  SingleFieldList,
  ImageField,
  useRecordContext,
} from "react-admin";
import ApproveProfileButton from "./ApproveProfileButton";
import ApproveOrganizationButton from "./ApproveOrganizationButton";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getFileUrl } from "../api";


const PendingStatusAlert = () => {
  const record = useRecordContext();
  const latest = JSON.stringify(record?.profile?.latestProfile || {});
  const approved = JSON.stringify(record?.profile?.approvedProfile || {});
  const hasPending = latest !== approved;

  return hasPending ? (
    <Box sx={{ backgroundColor: "#fff7cc", p: 2, mb: 2 }}>
      <Typography variant="h6" color="textSecondary">⚠️ 此用戶有待審批的導師資料</Typography>
    </Box>
  ) : null;
};

const OrgDocsSection = () => {
  const record = useRecordContext();
  const docs = record?.organizationDocs;

  if (!docs?.br && !docs?.cr && !docs?.addressProof) return null;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">📁 機構註冊文件</Typography>
      {docs.br && (
        <Box sx={{ my: 1 }}>
          <Typography variant="subtitle1">BR（商業登記）</Typography>
          <a href={getFileUrl(docs.br)} target="_blank" rel="noopener noreferrer">
            檢視 BR 文件
          </a>
        </Box>
      )}
      {docs.cr && (
        <Box sx={{ my: 1 }}>
          <Typography variant="subtitle1">CR（公司註冊證）</Typography>
          <a href={getFileUrl(docs.cr)} target="_blank" rel="noopener noreferrer">
            檢視 CR 文件
          </a>
        </Box>
      )}
      {docs.addressProof && (
        <Box sx={{ my: 1 }}>
          <Typography variant="subtitle1">地址證明</Typography>
          <a href={getFileUrl(docs.addressProof)} target="_blank" rel="noopener noreferrer">
            檢視地址證明
          </a>
        </Box>
      )}
    </Box>
  );
};


const ProfileSection = ({ title, prefix }) => (
  <Box sx={{ mt: 4 }}>
    <Typography variant="h6">{title}</Typography>
    <TextField source={`${prefix}.salutation`} label="稱呼" />
    <TextField source={`${prefix}.gender`} label="性別" />

    <Typography variant="subtitle1" sx={{ mt: 2 }}>HKID 證明</Typography>
    <ArrayField source={`${prefix}.hkidImages`}>
      <SingleFieldList>
        <ImageField source="" />
      </SingleFieldList>
    </ArrayField>

    <TextField source="phone" label="聯絡電話（不可更改）" />
    <TextField source="age" label="年齡（不可更改）" />
    <TextField source={`${prefix}.experience`} label="授課年資" />
    <TextField source={`${prefix}.subjects`} label="教授科目" />

    <Typography variant="subtitle1" sx={{ mt: 2 }}>學歷證明</Typography>
    <ArrayField source={`${prefix}.educationCertificates`}>
      <SingleFieldList>
        <ImageField source="" />
      </SingleFieldList>
    </ArrayField>

    <Typography variant="subtitle1" sx={{ mt: 2 }}>公開試成績證書</Typography>
    <ArrayField source={`${prefix}.examCertificates`}>
      <SingleFieldList>
        <ImageField source="" />
      </SingleFieldList>
    </ArrayField>

    <TextField source={`${prefix}.locations`} label="上堂地區" />
    <TextField source={`${prefix}.timeslots`} label="上堂時間" />
    <TextField source={`${prefix}.teachingMode`} label="上堂形式" />
    <TextField source={`${prefix}.hourlyRate`} label="要求堂費" />
    <TextField source={`${prefix}.introduction`} label="個人簡介（包括課程特點）" />

    <Typography variant="subtitle1" sx={{ mt: 2 }}>頭像</Typography>
    <ImageField source={`${prefix}.avatar`} label="頭像" />

    <Typography variant="subtitle1" sx={{ mt: 2 }}>其他證書圖片</Typography>
    <ArrayField source={`${prefix}.certificates`}>
      <SingleFieldList>
        <ImageField source="" />
      </SingleFieldList>
    </ArrayField>
  </Box>
);

const UserShow = (props) => {
  const navigate = useNavigate(); // ✅ 正確位置

  return (
    <Show {...props} title="用戶資料">
      <SimpleShowLayout>
        <PendingStatusAlert />

        <TextField source="userCode" label="用戶編號" />
        <TextField source="name" label="名稱" />
        <EmailField source="email" label="電郵" />
        <DateField source="birthdate" label="出生日期" />
        <TextField source="age" label="年齡" />
        <TextField source="phone" label="電話" />
        <TextField source="userType" label="用戶類型" />
        <OrgDocsSection />
        <TextField source="profileStatus" label="個人檔案狀態" />
        <DateField source="createdAt" label="註冊日期" showTime />

        <ProfileSection title="📋 最新導師申請資料（latestProfile）" prefix="profile.latestProfile" />
        <ProfileSection title="🟢 已審批導師資料（approvedProfile）" prefix="profile.approvedProfile" />

        <ApproveProfileButton />
        <ApproveOrganizationButton />

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/users")}
          sx={{ mt: 3 }}
        >
          返回用戶列表
        </Button>
      </SimpleShowLayout>
    </Show>
  );
};

export default UserShow;
