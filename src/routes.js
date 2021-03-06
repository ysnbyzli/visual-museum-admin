import { Route, Routes } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import Person from "./pages/person";
import AddNewPerson from "./pages/person/AddNewPerson";
import Home from "./pages/Home";
import DetailPerson from "./pages/person/DetailPerson";
import Category from "./pages/category";
import Tags from "./pages/tags";
import CreateEvent from "./pages/events/CreateEvent";
import Events from "./pages/events";

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
  {
    id: "5",
    title: "Kategoriler",
    key: "CATEGORIES",
    path: "/categories",
    element: <Category />,
  },
  {
    id: "6",
    title: "Etiketler",
    key: "TAGS",
    path: "/tags",
    element: <Tags />,
  },
  {
    id: "7",
    title: "Olaylar",
    key: "EVENTS",
    path: "/events",
    element: <Events />,
  },
  {
    id: "8",
    title: "Olay Oluştur",
    key: "EVENT_CREATE",
    path: "/events/create",
    element: <CreateEvent />,
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
