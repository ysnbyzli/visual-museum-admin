import { Table, Space, Modal, Button, Form, DatePicker, Input } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
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

  const showUpdateModal = () => {
    setIsModalUpdateVisible(true);
  };

  const handleUpdateCancel = () => {
    setIsModalUpdateVisible(false);
  };

  const onUpdateSubmit = (values, id) => {
    dispatch(updateOnePerson({ id, values }));
    setSelectedUpdatePerson(null);
    setIsModalUpdateVisible(false);
  };

  useEffect(() => {
    dispatch(fetchAllPerson());
  }, []);

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
      title: "",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <EditOutlined
            style={{ color: "#3498db" }}
            className="cursor-pointer"
            onClick={() => {
              setSelectedUpdatePerson(record);
              showUpdateModal(true);
            }}
          />
          <DeleteOutlined
            style={{ color: "#e74c3c" }}
            className="cursor-pointer"
            onClick={() => {
              setSelectedDeletePerson(record);
              showDeleteModal(true);
            }}
          />
        </Space>
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
      <Modal
        title="Güncelle"
        visible={isModalUpdateVisible}
        onCancel={handleUpdateCancel}
        footer={[
          <Button key="back" onClick={handleUpdateCancel}>
            İptal
          </Button>,
        ]}
      >
        <Form
          initialValues={{
            firstName: selectedUpdatePerson?.firstName,
            lastName: selectedUpdatePerson?.lastName,
            dateOfBirth: moment(selectedUpdatePerson?.dateOfBirth),
            dateOfDeath: moment(selectedUpdatePerson?.dateOfDeath),
          }}
          onFinish={(values) =>
            onUpdateSubmit(values, selectedUpdatePerson?._id)
          }
          className="w-full"
        >
          <div className="flex gap-5">
            <Form.Item
              className="w-full"
              name="firstName"
              rules={[
                { required: true, message: "Ad alanı boş bırakılamaz!" },
                { whitespace: true, message: "Ad alanı boş bırakılamaz!" },
                { min: 3, message: "Minumum 3 karakter olmalıdır!" },
              ]}
              hasFeedback
            >
              <Input placeholder="Ad" />
            </Form.Item>
            <Form.Item
              className="w-full"
              name="lastName"
              rules={[
                { required: true, message: "Soyad alanı boş bırakılamaz!" },
                { whitespace: true, message: "Ad alanı boş bırakılamaz!" },
              ]}
              hasFeedback
            >
              <Input placeholder="Soyad" />
            </Form.Item>
          </div>
          <div className="flex gap-5">
            <Form.Item
              className="w-full"
              name="dateOfBirth"
              rules={[
                {
                  required: true,
                  message: "Doğum Tarihi alanı boş bırakılamaz!",
                },
              ]}
              hasFeedback
            >
              <DatePicker className="w-full" placeholder="Doğum Tarihi" />
            </Form.Item>
            <Form.Item className="w-full" name="dateOfDeath" hasFeedback>
              <DatePicker className="w-full" placeholder="Ölüm Tarihi" />
            </Form.Item>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Güncelle
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Person;
