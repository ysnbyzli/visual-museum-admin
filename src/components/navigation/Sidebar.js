import React from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  SolutionOutlined,
  PlusCircleOutlined,
  TeamOutlined,
  UserAddOutlined,
  TableOutlined,
} from "@ant-design/icons";
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
      <SubMenu key="sub2" icon={<SolutionOutlined />} title="Kategoriler">
        <Menu.Item key="4" icon={<TableOutlined />}>
          <Link to={"/categories"}>Listele</Link>
        </Menu.Item>
        <Menu.Item key="5" icon={<PlusCircleOutlined />}>
          <Link to="/categories/add">Ekle</Link>
        </Menu.Item>
      </SubMenu>
    </Menu>
  );
};

export default Sidebar;
