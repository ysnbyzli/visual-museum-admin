import React from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  HolderOutlined,
  TeamOutlined,
  UserAddOutlined,
  TableOutlined,
  TagOutlined,
  PicCenterOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { SubMenu } = Menu;

const Sidebar = () => {
  return (
    <Menu
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      theme="dark"
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
      <Menu.Item key={"4"} icon={<HolderOutlined />}>
        <Link to={"/categories"}>Kategoriler</Link>
      </Menu.Item>
      <Menu.Item key={"5"} icon={<TagOutlined />}>
        <Link to={"/tags"}>Etiketler</Link>
      </Menu.Item>
      <SubMenu key="sub2" icon={<PicCenterOutlined />} title="Olaylar">
        <Menu.Item key="6" icon={<PlusOutlined />}>
          <Link to="/events/create">Oluştur</Link>
        </Menu.Item>
      </SubMenu>
    </Menu>
  );
};

export default Sidebar;
