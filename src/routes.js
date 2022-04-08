import { Route, Routes } from "react-router-dom";
import {
  HomeOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  SettingOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import Categories from "./pages/Categories";
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
    title: "Kategoriler",
    key: "CATEGORIES",
    path: "/categories",
    icon: <AppstoreOutlined />,
    element: <Categories />,
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
