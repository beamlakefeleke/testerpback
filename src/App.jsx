import React, { useEffect, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Layout,
  theme,
  Breadcrumb,
  Button,
  Menu,
  Tooltip,
  Dropdown,
  Badge,
  Tabs,
} from "antd";

import {
  FaAngleRight,
  FaClipboardList,
  FaLightbulb,
} from "react-icons/fa6";
import {
  MdAnalytics,
  MdLocationCity,
  MdReport,
  MdMessage,
} from "react-icons/md";
import { PiOfficeChair } from "react-icons/pi";

import logo from "./assets/imgs/image.png";

import {
  SiAwsorganizations,
  SiOnlyoffice,
} from "react-icons/si";
import {
  IoNotificationsCircle,
  IoSettingsOutline,
} from "react-icons/io5";
import { HiBuildingOffice2 } from "react-icons/hi2";
import BranchPage from "./pages/organzation/branch/BranchPage";
import DepartmentPage from "./pages/organzation/department/DepartmentPage";
import PostionPage from "./pages/organzation/postion/PostionPage";
import ReportPage from "./pages/report/ReportPage";
import ReportAnalyticsPage from "./pages/report/ReportAnalyticsPage";
import { BACKENDURL } from "./helper/Urls";
import axios from "axios";
import {
  LuPanelLeftClose,
  LuPanelRightClose,
} from "react-icons/lu";
import { IoMdArrowBack } from "react-icons/io";
import Search from "antd/es/input/Search";
import LayoutSearchForm from "./helper/LayoutSearchForm";
import { FaRegLightbulb } from "react-icons/fa";
import ModalForm from "./modal/Modal";
import OrganzationInfo from "./pages/organzation/OrganzationInfo";
import PageNotFound from "./pages/PageNotFound";

const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);

  const items = [
    {
      key: "3",
      label: "Organzation",
      icon: <SiAwsorganizations size={20} />,
      children: [
        {
          key: "31",
          label: (
            <Link to={"/organzation/info"}>
              <HiBuildingOffice2 /> Info
            </Link>
          ),
        },
        {
          key: "32",
          label: (
            <Link to={"/organzation/branch"}>
              <MdLocationCity /> Offices
            </Link>
          ),
        },
        {
          key: "33",
          label: (
            <Link to={"/organzation/department"}>
              <SiOnlyoffice /> Department
            </Link>
          ),
        },
        {
          key: "34",
          label: (
            <Link to={"/organzation/postion"}>
              <PiOfficeChair /> Postion
            </Link>
          ),
        },
      ],
    },
    {
      key: "12",
      label: "Daily Report",
      icon: <MdReport size={20} />,
      children: [
        {
          key: "121",
          label: (
            <Link to={"/dailyreport/list"}>
              <FaClipboardList /> List
            </Link>
          ),
        },
        {
          key: "122",
          label: (
            <Link to={"/dailyreport/analytics"}>
              <MdAnalytics /> Analytics
            </Link>
          ),
        },
      ],
    },
  ];

  const getLevelKeys = (items1) => {
    const key = {};
    const func = (items2, level = 1) => {
      items2.forEach((item) => {
        if (item.key) {
          key[item.key] = level;
        }
        if (item.children) {
          func(item.children, level + 1);
        }
      });
    };
    func(items1);
    return key;
  };
  const levelKeys = getLevelKeys(items);

  const [stateOpenKeys, setStateOpenKeys] = useState([]);
  const onOpenChange = (openKeys) => {
    const currentOpenKey = openKeys.find(
      (key) => stateOpenKeys.indexOf(key) === -1
    );
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      setStateOpenKeys(openKeys);
    }
  };

  const pathName = useLocation().pathname;
  const paths = pathName.split("/").filter((path) => path);

  const [openValue, setOpenValue] = useState(false);
  const [openTitle, setTitle] = useState(false);
  const [openContent, setOpenContent] = useState();

  const tabs = [
    {
      key: "1",
      label: "Alerts",
      children: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              width: "49%",
              borderBottom: "1px solid rgba(0,0,0,.2)",
              textAlign: "center",
            }}
          >
            Threat
          </span>
          <span
            style={{
              width: "49%",
              borderBottom: "1px solid rgba(0,0,0,.2)",
              textAlign: "center",
            }}
          >
            Incident
          </span>
        </div>
      ),
    },
    {
      key: "2",
      label: "Message",
      children: <span>Message</span>,
    },
    {
      key: "4",
      label: "Draft",
      children: <span>Draft</span>,
    },
  ];

  const items1 = [
    {
      key: "1",
      label: (
        <span
          style={{ width: "100%", display: "flex", alignItems: "center" }}
        >
          Profile
        </span>
      ),
    },
    {
      key: "2",
      label: (
        <span
        >
          Change Password
        </span>
      ),
    },
    {
      key: "3",
      label: (
        <span
          style={{ width: "100%", display: "flex", alignItems: "center" }}
          onClick={() => {
            localStorage.setItem("ERPUSER_Token", "");
            navigate("/");
          }}
        >
          Logout
        </span>
      ),
    },
  ];

  const items2 = [
    {
      key: "4",
      label: (
        <Tabs
          defaultActiveKey="1"
          items={paths.includes("administrators") ? tabs : tabs}
          style={{ width: "350px", height: "450px" }}
          onChange={() => (c) => !c}
        />
      ),
    },
  ];
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState(true);

  const IsUserAuth = async () => {
    setAuthLoading(true);
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("ERPUSER_Token")}`,
    };
    try {
      const res = await axios.get(`${BACKENDURL}/auth/user`, { headers });
      setAuthLoading(false);
    } catch (error) {
      setAuthLoading(false);
      // navigate("/");
    }
  };

  useEffect(() => {
    IsUserAuth();
  }, [pathName]);

  const [darkmode, setDarkmode] = useState(false);

  useEffect(() => {
    setDarkmode(localStorage.getItem("ERP_DARKMODE"));
  }, []);

  const handleDarkmode = () => {
    setDarkmode(!darkmode);
    localStorage.setItem("ERP_DARKMODE", darkmode);
  };
  return (
    <div>
      <Layout style={{ height: "100vh" }}>
        <ModalForm
          open={openValue}
          close={() => setOpenValue(false)}
          content={openContent}
          title={openTitle}
        />
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          theme={darkmode ? "dark" : "light"}
          style={{ overflow: "scroll" }}
        >
          <div
            style={{
              width: "100%",
              height: "70px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              flexDirection: "column",
            }}
          >
            <Button
              type="text"
              icon={
                collapsed ? (
                  <LuPanelRightClose color="white" size={collapsed ? 30 : 20} />
                ) : (
                  <LuPanelLeftClose color="white" size={20} />
                )
              }
              onClick={() => {
                setCollapsed(!collapsed);
              }}
              style={{
                fontSize: "16px",
                position: "absolute",
                right: !collapsed && "0",
                top: !collapsed && "0",
              }}
            />
            <img
              src={logo}
              alt="logo"
              style={{
                width: "auto",
                height: collapsed ? "0%" : "100%",
                objectFit: "contain",
              }}
            />
          </div>
          <Menu
            openKeys={stateOpenKeys}
            onOpenChange={onOpenChange}
            theme={darkmode ? "dark" : "light"}
            style={{ overflow: "hidden", width: "100%" }}
            mode="inline"
            items={items}
          />
          <div style={{ height: "40px" }}></div>
        </Sider>
        <Layout>
          <Header
            style={{
              padding: "0 16px",
              background: colorBgContainer,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <IoMdArrowBack
                  style={{ fontSize: "25px" }}
                  cursor="pointer"
                  onClick={() => navigate(-1)}
                />
              </div>
              <Breadcrumb separator={<FaAngleRight />}>
                {paths.map((path, index) => {
                  const url = "/" + paths.slice(0, index + 1).join("/");
                  return (
                    <Breadcrumb.Item key={path}>
                      {path.toLocaleUpperCase()}
                    </Breadcrumb.Item>
                  );
                })}
              </Breadcrumb>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <Search
                placeholder="Search"
                allowClear
                size="middle"
                style={{ width: "400px", marginRight: "20px" }}
                onSearch={(v) => {
                  setOpenValue(true);
                  setOpenContent(
                    <LayoutSearchForm
                      value={v}
                      openModalFun={(e) => setOpenValue(e)}
                    />
                  );
                  setTitle(`Search Results for ${v}`);
                }}
              />
              <div
                style={{
                  position: "fixed",
                  bottom: "10px",
                  right: "10px",
                  zIndex: "100",
                }}
              >
                {darkmode ? (
                  <FaRegLightbulb
                    cursor="pointer"
                    size={22}
                    onClick={handleDarkmode}
                  />
                ) : (
                  <FaLightbulb
                    cursor="pointer"
                    size={22}
                    onClick={handleDarkmode}
                  />
                )}
              </div>
              <Tooltip title="Write Message">
                <MdMessage
                  onClick={() => {
                    setOpenValue(true);
                    setOpenContent(
                      <NewMessageForm openModalFun={(e) => setOpenValue(e)} />
                    );
                    setTitle("Message");
                  }}
                  size={25}
                  cursor={"pointer"}
                />
              </Tooltip>
              <Dropdown
                visible={visible}
                onVisibleChange={(v) => setVisible(v)}
                menu={{
                  items: items2,
                  onClick: () => setVisible(true),
                }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Badge size="small" count={0}>
                  <IoNotificationsCircle size={26} cursor={"pointer"} />
                  {/* <IoNotificationsCircle size={26} onClick={()=>play()} cursor={'pointer'} /> */}
                </Badge>
              </Dropdown>
              <Dropdown
                menu={{
                  items: items1,
                }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <IoSettingsOutline size={22} cursor={"pointer"} />
              </Dropdown>
            </div>
          </Header>
          <Content
            style={{
              overflow: "scroll",
              margin: "16px 8px 0",
            }}
          >
            <div
              style={{
                padding: 8,
                minHeight: "100%",
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Routes>
                <Route element={<OrganzationInfo />} path="/organzation/info" />
                <Route element={<BranchPage />} path="/organzation/branch" />
                <Route
                  element={<DepartmentPage />}
                  path="/organzation/department"
                />
                <Route element={<PostionPage />} path="/organzation/postion" />
                <Route element={<PageNotFound />} path="/*" />

                <Route element={<ReportPage />} path="/dailyreport/list" />
                <Route
                  element={<ReportAnalyticsPage />}
                  path="/dailyreport/analytics"
                />

              </Routes>
            </div>
          </Content>
          <Footer
            style={{
              height: "50px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {"SECURE HR TECH ERP"}©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
};
export default App;
