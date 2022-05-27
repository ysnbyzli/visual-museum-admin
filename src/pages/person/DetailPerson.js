import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Image, Timeline, Modal, Tag } from "antd";
import MDEditor from "@uiw/react-md-editor";
import { findById } from "../../api/request";
import { log } from "../../utils/log";
import { encodeDate } from "../../utils/date";
import AddEvent from "../../components/person/AddEvent";
import { useDispatch, useSelector } from "react-redux";
import { deleteOneEvent, getAllEvents } from "../../store/eventSlice";
import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Header from "../../components/person/Header";

const { confirm } = Modal;

const DetailPerson = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const response = await findById(id);
        setPerson(response.data);
        log.success("GET_PERSON_DETAIL", response.data);
      } catch (error) {
        log.error("GET_PERSON_DETAIL", error.response);
      }
    })();
    dispatch(getAllEvents(id));
  }, [id]);

  return (
    <div className="pt-10 relative">
      <Header person={person} />
      <article data-color-mode="light" className="my-3 mb-10">
        <MDEditor.Markdown source={person?.description} />{" "}
      </article>
    </div>
  );
};

export default DetailPerson;
