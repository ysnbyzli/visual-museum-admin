import { Route, Routes } from "react-router-dom";
import {
  HomeOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  SettingOutlined,
  LinkOutlined,
  TeamOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import Person from "./pages/person";
import AddNewPerson from "./pages/person/AddNewPerson";
import Home from "./pages/Home";

export const ROUTES = [
  {
    id: "1",
    title: "Anasayfa",
    key: "HOME",
    path: "/",
    icon: <HomeOutlined />,
    element: <Home />,
  },
  {
    id: "2",
    title: "Kişiler",
    key: "PERSONS",
    path: "/persons",
    icon: <TeamOutlined />,
    element: <Person />,
  },
  {
    id: "3",
    title: "Kişi Ekle",
    key: "ADD-PERSON",
    path: "/persons/add",
    icon: <UserAddOutlined />,
    element: <AddNewPerson />,
  },
];

export const Switcher = () => {
  return (
    <Routes>
      {ROUTES.map(({ path, element }) => (
        <Route path={path} element={element} />
      ))}
    </Routes>
  );
};
