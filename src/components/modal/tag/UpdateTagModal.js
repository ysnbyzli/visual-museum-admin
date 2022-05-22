import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { useDispatch } from "react-redux";
import { getOneTag } from "../../../api/request";
import { log } from "../../../utils/log";
import { TwitterPicker } from "react-color";
import { updateOneTag } from "../../../store/tagSlice";

function UpdateTagModal({ isModalVisible, setIsModalVisible, tagId }) {
  const [tag, setTag] = useState(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      try {
        const response = await getOneTag(tagId);
        setTag(response.data);
        form.setFieldsValue({
          title: response.data?.title,
          color: response.data?.color,
        });
        log.success("UPDATED_TAG", response.data);
      } catch (e) {
        log.error("UPDATED_TAG", e.response);
      }
    })();
  }, [tagId]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onSubmit = (data) => {
    dispatch(updateOneTag({ _id: tagId, data }));
    setIsModalVisible(false);
    form.resetFields();
  };
  return (
    <Modal
      title={`${tag?.title} Kategorisini Güncelle`}
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
        labelCol={{ flex: "100px" }}
        labelWrap
      >
        <Form.Item
          label="Etiket Adı"
          name="title"
          rules={[
            { required: true, message: "Lütfen bir kategori adı giriniz!" },
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
  );
}

export default UpdateTagModal;
