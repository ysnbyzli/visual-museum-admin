import React, { useEffect, useState } from "react";
import {
  deleteEvent,
  getAllPerson,
  getEventsByPersonId,
} from "../../api/request";
import {
  Select,
  Table,
  Tag,
  Avatar,
  Spin,
  Modal,
  Switch,
  Timeline,
  Image,
  Empty,
} from "antd";
import { log } from "../../utils/log";
import Text from "antd/lib/typography/Text";
import { encodeDate, encodeDateYear } from "../../utils/date";
import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import UpdateEventModal from "../../components/modal/event/UpdateEventModal";

function Index() {
  // data
  const [persons, setPersons] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // action
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedDelete, setSelectedDelete] = useState(null);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  // modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  // timeline
  const [isShowTimeline, setIsShowTimeline] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const response = await getAllPerson();
        setPersons(response?.data);
      } catch (e) {}
    })();
  }, []);

  const getAllEventsByPersonId = async () => {
    setIsLoading(true);
    try {
      const response = await getEventsByPersonId(selectedPerson);
      setEvents(response?.data);
      setIsLoading(false);
      log.success("GET_EVENT_BY_PERSON", response?.data);
    } catch (e) {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (selectedPerson) {
      getAllEventsByPersonId();
    }
  }, [selectedPerson]);

  useEffect(() => {
    if (selectedDelete) {
      showDeleteConfirm();
    }
  }, [selectedDelete]);

  const columns = [
    {
      title: "Başlık",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a?.title.localeCompare(b?.title),
      filters: [
        ...events.map(({ title }) => ({
          text: title,
          value: title,
        })),
      ],
      onFilter: (value, record) => record?.title.startsWith(value),
      filterSearch: true,
    },
    {
      title: "Fotoğraflar",
      dataIndex: "photos",
      key: "photos",
      render: (text, record) => (
        <Avatar.Group
          maxCount={3}
          maxPopoverTrigger="click"
          size="large"
          maxStyle={{
            color: "#f56a00",
            backgroundColor: "#fde3cf",
            cursor: "pointer",
          }}
        >
          {record?.photos?.map((photo) => (
            <Avatar src={photo} />
          ))}
        </Avatar.Group>
      ),
    },
    {
      title: "Açıklama",
      dataIndex: "description",
      key: "description",
      width: "25%",
      render: (text, record) => <Text>{text.substring(0, 70)}...</Text>,
    },
    {
      title: "Tarih",
      dataIndex: "startDate",
      key: "startDate",
      sorter: (a, b) => new Date(a?.startDate) * new Date(b?.startDate),
      render: (text, record) => (
        <Text className="line-clamp-1">{`${encodeDate(
          record?.startDate
        )} / ${encodeDate(record?.endDate)}`}</Text>
      ),
    },
    {
      title: "Etiketler",
      dataIndex: "tags",
      key: "tags",
      render: (text, record) => (
        <Text>
          {record?.tags?.map(({ title, color }) => (
            <Tag color={color}>{title}</Tag>
          ))}
        </Text>
      ),
    },
    {
      title: "",
      key: "action",
      render: (text, record) => (
        <div className="flex justify-end gap-5">
          <EditOutlined
            style={{ color: "#3498db" }}
            className="cursor-pointer"
            onClick={() => {
              setSelectedUpdate(record);
              setIsModalVisible(true);
            }}
          />
          <DeleteOutlined
            style={{ color: "#e74c3c" }}
            className="cursor-pointer"
            onClick={() => {
              setSelectedDelete(record?._id);
            }}
          />
        </div>
      ),
    },
  ];
  const [visible, setVisible] = useState(false);

  const showDeleteConfirm = () =>
    Modal.confirm({
      title: "Olayı silmek istediğine emin misiniz?",
      icon: <ExclamationCircleOutlined />,
      okText: "Evet",
      okType: "danger",
      cancelText: "Hayır",
      async onOk() {
        try {
          await deleteEvent(selectedDelete);
          setEvents(events.filter((event) => event?._id !== selectedDelete));
          setSelectedDelete(null);
        } catch (e) {}
      },
      onCancel() {},
    });

  return (
    <div>
      <head className="flex items-center justify-between">
        <h1 className="text-4xl">Olayları Listele</h1>
        {events.length > 0 && (
          <label
            htmlFor="timeline"
            className="flex items-center gap-2 cursor-pointer font-medium"
          >
            Zaman çizelgesini göster
            <Switch
              id="timeline"
              onChange={setIsShowTimeline}
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
            />
          </label>
        )}
      </head>

      <main>
        <Select
          loading={isLoading}
          disabled={isLoading}
          allowClear
          className="w-full"
          placeholder="Olaylarını listelemek istediğiniz bir kişiyi seçiniz"
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
          onChange={setSelectedPerson}
        >
          {persons?.map(({ _id, firstName, lastName }) => (
            <Select.Option
              value={_id}
            >{`${firstName} ${lastName}`}</Select.Option>
          ))}
        </Select>
        {isLoading ? (
          <Spin />
        ) : (
          <>
            {events.length > 0 ? (
              <Table dataSource={events} columns={columns} className="mt-10" />
            ) : (
              selectedPerson && (
                <>
                  <div className="py-10">
                    <Empty
                      className="flex flex-col items-center justify-center"
                      description="Kişiye ait bir olay bulunamadı!"
                      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                      imageStyle={{
                        height: 60,
                      }}
                    />
                  </div>
                </>
              )
            )}
          </>
        )}

        {isShowTimeline && (
          <div className="mt-10">
            <Timeline mode="alternate">
              {events.map(
                ({ title, description, tags, photos, endDate, startDate }) => (
                  <Timeline.Item
                    label={`${encodeDateYear(startDate)} - ${encodeDateYear(
                      endDate
                    )}`}
                  >
                    <h4>{title}</h4>
                    <p>{description}</p>
                    <div className="flex justify-between">
                      <div>
                        {photos.map((photo) => (
                          <Avatar shape="square" size={128} src={photo} />
                        ))}
                      </div>
                      <div>
                        {tags.map(({ title, color }) => (
                          <Tag color={color}>{title}</Tag>
                        ))}
                      </div>
                    </div>
                  </Timeline.Item>
                )
              )}
            </Timeline>
          </div>
        )}
        {selectedUpdate && (
          <UpdateEventModal
            setIsModalVisible={setIsModalVisible}
            isModalVisible={isModalVisible}
            event={selectedUpdate}
            setEvents={setEvents}
            events={events}
          />
        )}
      </main>
    </div>
  );
}

export default Index;
