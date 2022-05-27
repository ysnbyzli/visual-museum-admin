import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Table, Tag } from "antd";
import { TwitterPicker } from "react-color";
import { useDispatch, useSelector } from "react-redux";
import { addNewTag, deleteOneTag, fetchAllTags } from "../../store/tagSlice";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import UpdateTagModal from "../../components/modal/tag/UpdateTagModal";

const { confirm } = Modal;

function Index() {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [deletedTag, setDeletedTag] = useState(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updatedTag, setUpdatedTag] = useState(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { data, loading } = useSelector((state) => state.tags);

  const onSubmit = (values) => {
    dispatch(addNewTag(values));
    setIsAddModalVisible(false);
    form.resetFields();
  };

  useEffect(() => {
    dispatch(fetchAllTags());
  }, []);

  const showDeleteConfirm = () =>
    confirm({
      title: "Bu etiketi silmek istediğinize emin misiniz?",
      icon: <ExclamationCircleOutlined />,
      content: "Silme işlemi geri alınamaz!",
      okText: "Evet",
      okType: "danger",
      cancelText: "Hayır",
      onOk() {
        dispatch(deleteOneTag(deletedTag));
        setDeletedTag(null);
      },
      onCancel() {
        setDeletedTag(null);
      },
    });

  useEffect(() => {
    deletedTag && showDeleteConfirm();
  }, [deletedTag]);

  const columns = [
    {
      title: "Başlık",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => {
        return a?.title.localeCompare(b?.title);
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
      title: "Renk",
      dataIndex: "color",
      key: "color",
      render: (text) => (
        <div className={"h-8"}>
          <Tag
            color={text}
            className={"h-full w-36 "}
            style={{ height: "100%" }}
          />
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
              setUpdatedTag(record?._id);
              setIsUpdateModalVisible(true);
            }}
          />
          <DeleteOutlined
            style={{ color: "#e74c3c" }}
            className="cursor-pointer"
            onClick={() => {
              setDeletedTag(record?._id);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="py-10">
      <h1 className="text-3xl">Etiketler</h1>
      <div className="mb-5 flex justify-end">
        <Button
          type="primary"
          onClick={() => setIsAddModalVisible(true)}
          loading={loading}
        >
          Etiket Ekle
        </Button>
      </div>
      <Table loading={loading} columns={columns} dataSource={data} />
      <Modal
        title="Yeni Bir Etiket Ekle"
        onCancel={() => setIsAddModalVisible(false)}
        visible={isAddModalVisible}
        footer={[
          <Button key="back" danger onClick={() => setIsAddModalVisible(false)}>
            İptal
          </Button>,
          <Button form="addForm" key="submit" htmlType="submit" type="primary">
            Ekle
          </Button>,
        ]}
      >
        <Form
          id="addForm"
          initialValues={{
            title: "",
            color: "",
          }}
          form={form}
          labelCol={{ flex: "100px" }}
          labelWrap
          onFinish={onSubmit}
        >
          <Form.Item
            label="Etiket Adı"
            name="title"
            rules={[
              { required: true, message: "Lütfen bir etiket adı giriniz!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Renk"
            name="color"
            rules={[{ required: true, message: "Lütfen bir renk seçiniz!" }]}
          >
            <TwitterPicker
              onChange={({ hex }) => form.setFieldsValue({ color: hex })}
              color={form.getFieldValue("color")}
            />
          </Form.Item>
        </Form>
      </Modal>
      <UpdateTagModal
        isModalVisible={isUpdateModalVisible}
        setIsModalVisible={setIsUpdateModalVisible}
        tagId={updatedTag}
      />
    </div>
  );
}

export default Index;
