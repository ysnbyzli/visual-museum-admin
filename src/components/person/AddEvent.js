import React, { useState } from "react";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, Modal, message, Upload } from "antd";
import { useDispatch } from "react-redux";
import { addNewEvent } from "../../store/eventSlice";

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

const { Dragger } = Upload;

const AddEvent = ({ _id }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const onSubmit = (values) => {
    const data = {
      person: _id,
      ...values,
      photos: files.map((file) => file.thumbUrl).filter(Boolean),
    };
    dispatch(addNewEvent(data));
    form.resetFields();
  };

  const props = {
    name: "file",
    multiple: true,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
      }
      if (status === "done") {
        setFiles((prev) => [...prev, info.file]);
        message.success(`${info.file.name} file uploaded successfully.`);
      }
    },
    onDrop(e) {},
  };

  return (
    <>
      <Button
        type="primary"
        shape="round"
        icon={<PlusOutlined />}
        onClick={showModal}
      >
        Olay Ekle
      </Button>
      <Modal
        title="Olay Ekle"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            İptal
          </Button>,
        ]}
      >
        <Form
          initialValues={{
            title: "",
            description: "",
            startDate: "",
            endDate: "",
            photos: [],
          }}
          onFinish={onSubmit}
        >
          <Form.Item name="title">
            <Input placeholder="Title" />
          </Form.Item>
          <Form.Item name="description">
            <Input.TextArea
              rows={4}
              style={{ resize: "none" }}
              maxLength={300}
              placeholder="Açıklama"
            />
          </Form.Item>
          <div className="flex gap-5">
            <Form.Item className="w-full" name="startDate">
              <DatePicker className="w-full" placeholder="Başlangıç Tarihi" />
            </Form.Item>
            <Form.Item className="w-full" name="endDate">
              <DatePicker className="w-full" placeholder="Bitiş Tarihi" />
            </Form.Item>
          </div>
          <Form.Item name="photos">
            <Dragger {...props} listType="picture" customRequest={dummyRequest}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Yüklemek için lütfen tıklayın veya bu alana sürükleyin
              </p>
            </Dragger>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Ekle
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddEvent;
