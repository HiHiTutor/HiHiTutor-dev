import React, { useState, useEffect } from "react";
import { 
  Edit, 
  SimpleForm, 
  TextInput, 
  NumberInput, 
  BooleanInput, 
  SelectInput, 
  useDataProvider, 
  useGetOne,
  useRefresh,
  useNotify,
  useRedirect
} from "react-admin";

const CaseEdit = (props) => {
  const dataProvider = useDataProvider();
  const refresh = useRefresh();
  const notify = useNotify();
  const redirect = useRedirect();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ 強制重新加載最新數據
  const { data: caseData, isLoading: caseLoading, refetch } = useGetOne("cases", { id: props.id });

  useEffect(() => {
    // ✅ 獲取用戶列表
    dataProvider.getList("users", { pagination: { page: 1, perPage: 100 }, sort: { field: "name", order: "ASC" } })
      .then(({ data }) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("❌ 獲取用戶列表失敗:", error);
        setError(error);
        setLoading(false);
      });
  }, [dataProvider]);

  // ✅ 依據案件類型，篩選適合的配對對象
  const filterUsersByRole = (usersList) => {
    if (!caseData) return []; // 確保有案件數據
    const isStudentCase = caseData.postType === "student-seeking-tutor";
    return usersList
      .filter(user => (isStudentCase ? user.role === "tutor" : user.role === "student"))
      .map(user => ({ id: user.id, name: `${user.name} (${user.id})` }));
  };

  // ✅ 成功更新後強制重新獲取最新數據並跳轉
  const onSuccess = () => {
    console.log("✅ 更新成功，重新整理 UI");
    notify("✅ 更新成功");
    redirect("/student_cases");
    refetch();
    refresh();
  };

  return (
    <Edit mutationMode="pessimistic" mutationOptions={{ onSuccess }} {...props}> 
      <SimpleForm>
        <TextInput source="postTitle" label="補習標題" />
        <TextInput source="category" label="補習類別" />
        <TextInput source="subjects" label="補習科目" />
        <TextInput source="location" label="補習地點" />
        <NumberInput source="rate" label="每堂學費 (HKD)" />
        <NumberInput source="duration" label="每堂時長 (分鐘)" />

        {/* ✅ 個案狀態（確保可正確更新） */}
        <SelectInput
          source="status"
          label="個案狀態"
          choices={[
            { id: "開放中", name: "開放中" },
            { id: "配對中", name: "配對中" },
            { id: "待上課", name: "待上課" },
            { id: "已完成", name: "已完成" },
          ]}
        />

        {/* ✅ 配對對象（確保只有合適對象可選） */}
        <SelectInput
          source="pairedUserId"
          label="配對對象"
          choices={loading || caseLoading ? [] : filterUsersByRole(users)}
          emptyText={loading ? "加載中..." : "請選擇配對對象"}
        />

        <BooleanInput source="paymentConfirmed" label="已付款確認" />
        <BooleanInput source="completed" label="已完成" />

        {/* ✅ 錯誤提示（防止載入錯誤時 React 崩潰） */}
        {error && <p style={{ color: "red" }}>❌ 載入用戶時發生錯誤，請稍後再試。</p>}
      </SimpleForm>
    </Edit>
  );
};

export default CaseEdit;
