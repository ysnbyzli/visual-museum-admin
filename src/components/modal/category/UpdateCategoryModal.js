import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { getOneCategory } from "../../../api/request";
import { log } from "../../../utils/log";
import { useDispatch } from "react-redux";
import { updateOneCategory } from "../../../store/categorySlice";

const UpdateCategoryModal = ({
  isModalVisible,
  setIsModalVisible,
  categoryId,
}) => {
  const [category, setCategory] = useState(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      console.log("hi");
      try {
        const response = await getOneCategory(categoryId);
        setCategory(response.data);
        form.setFieldsValue({
          title: response.data?.title,
        });
        log.success("UPDATED_CATEGORY", response.data);
      } catch (e) {
        log.error("UPDATED_CATEGORY", e);
      }
    })();
  }, [categoryId]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onSubmit = (data) => {
    dispatch(updateOneCategory({ _id: categoryId, data }));
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <Modal
      title={`${category?.title} Kategorisini Güncelle`}
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={[
        <Button key="back" danger onClick={handleCancel}>
          İptal
        </Button>,
        <Button form="updateForm" key="submit" htmlType="submit" type="primary">
          Güncelle
        </Button>,
      ]}
    >
      <Form
        id="updateForm"
        initialValues={{
          title: "",
        }}
        form={form}
        onFinish={onSubmit}
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
  );
};

export default UpdateCategoryModal;
