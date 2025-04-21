import React from "react";
import { Admin, Resource } from "react-admin";
import dataProvider from "./dataProvider";
import authProvider from "./authProvider"; // ✅ 加呢行！

import CaseList from "./cases/CaseList";
import CaseEdit from "./cases/CaseEdit";
import CaseShow from "./cases/CaseShow";
import CaseCreate from "./cases/CaseCreate"; // ✅ ✅ ✅ 加呢行！

import UserList from "./users/UserList";
import UserEdit from "./users/UserEdit";
import UserShow from "./users/UserShow";

import PendingCaseShow from "./cases/PendingCaseShow";
import PendingCaseEdit from "./cases/PendingCaseEdit";

const App = () => (
  <Admin dataProvider={dataProvider} authProvider={authProvider}> {/* ✅ 加 authProvider */}
    <Resource
      name="pending_cases"
      list={CaseList}
      edit={PendingCaseEdit}
      show={PendingCaseShow}
      options={{ label: "待審批個案" }}
    />
    <Resource
      name="student_cases"
      list={CaseList}
      edit={CaseEdit}
      show={CaseShow}
      create={CaseCreate} // ✅ ✅ ✅ 加呢行！
      options={{ label: "學生尋老師" }}
    />
    <Resource
      name="tutor_cases"
      list={CaseList}
      edit={CaseEdit}
      show={CaseShow}
      create={CaseCreate} // ✅ ✅ ✅ 加呢行！
      options={{ label: "老師招學生" }}
    />
    <Resource
      name="users"
      list={UserList}
      edit={UserEdit}
      show={UserShow}
      options={{ label: "用戶管理" }}
    />
  </Admin>
);

export default App;
