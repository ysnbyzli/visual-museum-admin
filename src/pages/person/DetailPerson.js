import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Modal, Carousel } from "antd";
import MDEditor from "@uiw/react-md-editor";
import { findById } from "../../api/request";
import { log } from "../../utils/log";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../../store/eventSlice";

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
    <div className="relative pb-10">
      <Header person={person} />

      <article data-color-mode="light" className="mt-12 mb-10">
        <h3 className="text-3xl pb-2">Hakkında</h3>
        <MDEditor.Markdown
          source={person?.description}
          style={{ background: "none" }}
        />
      </article>
    </div>
  );
};

export default DetailPerson;
