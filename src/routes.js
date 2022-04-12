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
import DetailPerson from "./pages/person/DetailPerson";

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
    exact: true,
    element: <Person />,
  },
  {
    id: "3",
    title: "Kişi Detay",
    key: "DETAIL-PERSON",
    path: "/persons/:id",
    element: <DetailPerson />,
  },
  {
    id: "4",
    title: "Kişi Ekle",
    key: "ADD-PERSON",
    path: "/persons/add",
    element: <AddNewPerson />,
  },
];

export const Switcher = () => {
  return (
    <Routes>
      {ROUTES.map(({ path, element, exact }) => (
        <Route path={path} element={element} exact={exact} />
      ))}
    </Routes>
  );
};
