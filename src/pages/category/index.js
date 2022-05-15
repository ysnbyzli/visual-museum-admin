import React, { useEffect, useState } from "react";
import { Table, Modal, Button, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCategories,
  deleteOneCategory,
  addNewCategory,
} from "../../store/categorySlice";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { confirm } = Modal;

const Index = () => {
  const [deletedCategory, setDeletedCategory] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const { data, loading } = useSelector((state) => state.categories);
  const [form] = Form.useForm();
  const showModal = () => {
    setIsAddModalVisible(true);
  };
  console.log(loading);
  const handleOk = () => {
    setIsAddModalVisible(false);
  };

  const handleCancel = () => {
    setIsAddModalVisible(false);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, []);

  useEffect(() => {
    deletedCategory && showDeleteConfirm();
  }, [deletedCategory]);

  const showDeleteConfirm = () =>
    confirm({
      title: "Bu kategoriyi silmek istediğinize emin misiniz?",
      icon: <ExclamationCircleOutlined />,
      content: "Silme işlemi geri alınamaz!",
      okText: "Evet",
      okType: "danger",
      cancelText: "Hayır",
      onOk() {
        dispatch(deleteOneCategory(deletedCategory));
        setDeletedCategory(null);
      },
      onCancel() {
        setDeletedCategory(null);
      },
    });

  const columns = [
    {
      title: "Başlık",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => {
        return a?.title - b?.title;
      },
      filters: [
        ...data.map((category) => ({
          text: category?.title,
          value: category?.title,
        })),
      ],
      onFilter: (value, record) => record.title.startsWith(value),
      filterSearch: true,
      width: "40%",
    },
    {
      title: "",
      key: "action",
      render: (text, record) => (
        <div className="flex justify-end gap-5">
          <EditOutlined
            style={{ color: "#3498db" }}
            className="cursor-pointer"
            onClick={() => {}}
          />
          <DeleteOutlined
            style={{ color: "#e74c3c" }}
            className="cursor-pointer"
            onClick={() => {
              setDeletedCategory(record?._id);
            }}
          />
        </div>
      ),
    },
  ];

  const onSubmit = (values) => {
    dispatch(addNewCategory(values));
    handleCancel();
    form.resetFields();
  };

  return (
    <div className="py-10">
      <div className="mb-5 flex justify-end">
        <Button loading={loading} type="primary" onClick={showModal}>
          Kategori Ekle
        </Button>
      </div>
      <Table dataSource={data} columns={columns} loading={loading} />
      <Modal
        title="Yeni Bir Kategori Ekle"
        visible={isAddModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" danger onClick={handleCancel}>
            İptal
          </Button>,
          <Button
            form="addForm"
            key="submit"
            htmlType="submit"
            type="primary"
            loading={loading}
          >
            Ekle
          </Button>,
        ]}
      >
        <Form
          id="addForm"
          initialValues={{
            title: "",
          }}
          onFinish={onSubmit}
          form={form}
        >
          <Form.Item
            label="Kategori Adı"
            name="title"
            rules={[
              { required: true, message: "Lütfen bir kategori adı giriniz!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Index;
