import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Image, Timeline, List } from "antd";
import { findById } from "../../api/request";
import { log } from "../../utils/log";
import { encodeDate } from "../../utils/date";
import AddEvent from "../../components/person/AddEvent";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../../store/eventSlice";
import { ClockCircleOutlined } from "@ant-design/icons";

const DetailPerson = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const { data } = useSelector((state) => state.events);
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
    <div className="pt-10">
      <div className="flex justify-between">
        <Avatar shape="square" size={128} src={person?.photo} />
        <AddEvent />
      </div>
      <div className="flex justify-center items-center">
        <Timeline mode="alternate">
          {data.map(({ title, description, startDate, endDate, photos }) => (
            <Timeline.Item
              label={
                endDate
                  ? `${encodeDate(startDate)} - ${encodeDate(endDate)}`
                  : `${encodeDate(startDate)}`
              }
            >
              <div className="flex flex-col">
                <h3 className="text-xl">{title}</h3>
                <p>{description}</p>
                <div className="flex gap-2">
                  <Image.PreviewGroup>
                    {photos.map((photo) => (
                      <Image width={200} src={photo} />
                    ))}
                  </Image.PreviewGroup>
                </div>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </div>
  );
};

export default DetailPerson;
