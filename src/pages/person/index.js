import {
  Table,
  Space,
  Modal,
  Button,
  Form,
  DatePicker,
  Input,
  Tag,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteOnePerson,
  fetchAllPerson,
  updateOnePerson,
} from "../../store/personSlice";
import { yearDifferenceBetweenTwoDates } from "../../utils/date";
import moment from "moment";
import { Link } from "react-router-dom";
import UpdatePersonModal from "../../components/modal/person/UpdatePersonModal";
import { deleteOneTag } from "../../store/tagSlice";

const { confirm } = Modal;

const Person = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.persons);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
  const [isModalUpdateVisible, setIsModalUpdateVisible] = useState(false);
  const [selectedDeletePerson, setSelectedDeletePerson] = useState(null);
  const [selectedUpdatePerson, setSelectedUpdatePerson] = useState(null);

  const showDeleteModal = () => {
    setIsModalDeleteVisible(true);
  };

  const handleDeleteOk = () => {
    dispatch(deleteOnePerson(selectedDeletePerson?._id));
    setIsModalDeleteVisible(false);
  };

  const handleDeleteCancel = () => {
    setIsModalDeleteVisible(false);
  };

  useEffect(() => {
    dispatch(fetchAllPerson());
  }, []);

  useEffect(() => {
    selectedDeletePerson && showDeleteConfirm();
  }, [selectedDeletePerson]);

  const showDeleteConfirm = () =>
    confirm({
      title: "Kişiyi silmek istediğinize emin misiniz?",
      icon: <ExclamationCircleOutlined />,
      content: "Silme işlemi sonrasında kişiye ait tüm bilgiler silinecektir!",
      okText: "Evet",
      okType: "danger",
      cancelText: "Hayır",
      onOk() {
        dispatch(deleteOnePerson(selectedDeletePerson));
        setSelectedDeletePerson(null);
      },
      onCancel() {
        setSelectedDeletePerson(null);
      },
    });

  const columns = [
    {
      title: "Ad Soyad",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Text>
          <Link to={`/persons/${record._id}`}>
            {record?.firstName} {record?.lastName}
          </Link>
        </Text>
      ),
    },
    {
      title: "Yaş",
      dataIndex: "age",
      key: "age",
      render: (text, record) => (
        <Text>
          {yearDifferenceBetweenTwoDates(
            record?.dateOfBirth,
            record?.dateOfDeath
          )}
        </Text>
      ),
    },
    {
      title: "Kategori",
      dataIndex: "category",
      key: "category",
      sorter: (a, b) => {
        return a?.category?.title.localeCompare(b?.category?.title);
      },
      filters: [
        ...data.map(({ category }) => ({
          text: category?.title,
          value: category?.title,
        })),
      ],
      filterSearch: true,
      render: (text, record) => <Text>{record?.category?.title}</Text>,
    },
    {
      title: "Etiketler",
      dataIndex: "tags",
      key: "tags",
      render: (text, record) => (
        <div>
          {record?.tags.map(({ color, title }) => (
            <Tag color={color}>{title}</Tag>
          ))}
        </div>
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
              setSelectedUpdatePerson(record);
              setIsModalUpdateVisible(true);
            }}
          />
          <DeleteOutlined
            style={{ color: "#e74c3c" }}
            className="cursor-pointer"
            onClick={() => {
              setSelectedDeletePerson(record?._id);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="pt-10">
      <Table columns={columns} dataSource={data} loading={loading} />
      <Modal
        title={`${selectedDeletePerson?.firstName} ${selectedDeletePerson?.lastName}`}
        visible={isModalDeleteVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        footer={[
          <Button key="back" onClick={handleDeleteCancel}>
            İptal
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleDeleteOk}
            danger
          >
            Evet
          </Button>,
        ]}
      >
        <p>Silmek istediğinize emin misiniz?</p>
      </Modal>
      {selectedUpdatePerson && (
        <UpdatePersonModal
          isModalVisible={isModalUpdateVisible}
          person={selectedUpdatePerson}
          setIsModalVisible={setIsModalUpdateVisible}
        />
      )}
    </div>
  );
};

export default Person;
