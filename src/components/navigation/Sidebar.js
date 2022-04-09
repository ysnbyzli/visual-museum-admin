import React from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  SettingOutlined,
  LinkOutlined,
  TeamOutlined,
  UserAddOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { ROUTES } from "../../routes";
import { Link } from "react-router-dom";

const { SubMenu } = Menu;

const Sidebar = () => {
  return (
    <Menu
      style={{ width: 256, height: "100%" }}
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      theme="light"
    >
      <Menu.Item key={"1"} icon={<HomeOutlined />}>
        <Link to={"/"}>Anasayfa</Link>
      </Menu.Item>
      <SubMenu key="sub1" icon={<TeamOutlined />} title="Kişiler">
        <Menu.Item key="2" icon={<TableOutlined />}>
          <Link to={"/persons"}>Listele</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<UserAddOutlined />}>
          <Link to="/persons/add">Ekle</Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu key="sub2" icon={<SettingOutlined />} title="Navigation Three">
        <Menu.Item key="7">Option 7</Menu.Item>
        <Menu.Item key="8">Option 8</Menu.Item>
        <Menu.Item key="9">Option 9</Menu.Item>
        <Menu.Item key="10">Option 10</Menu.Item>
      </SubMenu>
      <Menu.Item key="link" icon={<LinkOutlined />}>
        <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
          Ant Design
        </a>
      </Menu.Item>
    </Menu>
  );
};

export default Sidebar;
