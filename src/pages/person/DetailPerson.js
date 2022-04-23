import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Image, Timeline, Modal } from "antd";
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
} from "@ant-design/icons";
import UpdateEventModal from "../../components/modal/event/UpdateEventModal";

const { confirm } = Modal;

const DetailPerson = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedUpdatedEvent, setSelectedUpdatedEvent] = useState(null);
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

  const showDeleteConfirm = (_id) => {
    confirm({
      title: "Olayı silmek istediğinize emin misiniz?",
      icon: <ExclamationCircleOutlined />,
      content: "Bu işlem geri alınamaz!",
      okText: "Evet",
      okType: "danger",
      cancelText: "Hayır",
      onOk() {
        dispatch(deleteOneEvent(_id));
      },
    });
  };

  return (
    <div className="pt-10">
      <div className="flex justify-between">
        <Avatar shape="square" size={128} src={person?.photo} />
        <AddEvent />
      </div>
      <div className="flex justify-center items-center">
        <Timeline mode="alternate">
          {data.map(
            ({ _id, title, description, startDate, endDate, photos }) => (
              <Timeline.Item
                key={_id}
                label={
                  endDate
                    ? `${encodeDate(startDate)} - ${encodeDate(endDate)}`
                    : `${encodeDate(startDate)}`
                }
              >
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl">{title}</h3>
                    <div className="mr-3 flex gap-4">
                      <EditOutlined
                        style={{ color: "#3498db" }}
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedUpdatedEvent(_id);
                          setIsUpdateModalVisible(true);
                        }}
                      />
                      <DeleteOutlined
                        style={{ color: "#e74c3c" }}
                        className="cursor-pointer"
                        onClick={() => showDeleteConfirm(_id)}
                      />
                    </div>
                  </div>

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
            )
          )}
        </Timeline>
      </div>
      {selectedUpdatedEvent && (
        <UpdateEventModal
          setSelectedUpdatedEvent={setSelectedUpdatedEvent}
          isModalVisible={isUpdateModalVisible}
          setIsModalVisible={setIsUpdateModalVisible}
          _id={selectedUpdatedEvent}
        />
      )}
    </div>
  );
};

export default DetailPerson;
