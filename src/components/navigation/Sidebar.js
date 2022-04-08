import React from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  SettingOutlined,
  LinkOutlined,
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
      {ROUTES.map(({ id, title, icon, path }) => (
        <Menu.Item key={id} icon={icon}>
          <Link to={path}>{title}</Link>
        </Menu.Item>
      ))}
      <SubMenu key="sub1" icon={<AppstoreOutlined />} title="Navigation Two">
        <Menu.Item key="3">Option 3</Menu.Item>
        <Menu.Item key="4">Option 4</Menu.Item>
        <SubMenu key="sub1-2" title="Submenu">
          <Menu.Item key="5">Option 5</Menu.Item>
          <Menu.Item key="6">Option 6</Menu.Item>
        </SubMenu>
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
