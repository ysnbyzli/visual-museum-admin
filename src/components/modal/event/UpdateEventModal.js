import React, { useEffect, useState } from "react";
import { Button, DatePicker, Input, Modal, Form, Upload, message } from "antd";
import { getOneEvent } from "../../../api/request";
import { log } from "../../../utils/log";
import { encodeDate } from "../../../utils/date";
import moment from "moment";
import { InboxOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { updateOneEvent } from "../../../store/eventSlice";

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

const { Dragger } = Upload;

const UpdateEventModal = ({
  _id,
  isModalVisible,
  setIsModalVisible,
  setSelectedUpdatedEvent,
}) => {
  const [files, setFiles] = useState([]);
  const [form] = Form.useForm();
  const { loading } = useSelector((state) => state.events);
  const dispatch = useDispatch();

  const handleCancel = () => {
    setSelectedUpdatedEvent(null);
    setIsModalVisible(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getOneEvent(_id);
        log.success("GET_ONE_EVENT", data);
        form.setFieldsValue({
          title: data?.title,
          description: data?.description,
          startDate: data?.startDate ? moment(encodeDate(data?.startDate)) : "",
          endDate: data?.endDate ? moment(encodeDate(data?.endDate)) : "",
          file: data?.photos,
        });
      } catch (e) {
        log.error("GET_ONE_EVENT", e.response);
      }
    })();
  }, []);

  const onSubmit = (values) => {
    const data = {
      ...values,
      startDate: values.startDate?._d,
      endDate: values.endDate?._d,
    };
    dispatch(updateOneEvent({ _id, data }));
    handleCancel();
  };

  const props = {
    name: "file",
    multiple: true,
    valuePropName: "fileList",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        setFiles((prev) => [...prev, info.file]);
        message.success(`${info.file.name} file uploaded successfully.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  return (
    <Modal
      title="Güncelle"
      visible={isModalVisible}
      onCancel={handleCancel}
      footer={[
        <Button danger onClick={handleCancel}>
          İptal
        </Button>,
        <Button
          htmlType="submit"
          form={"updateEvent"}
          key="submit"
          type="primary"
          loading={loading}
        >
          Güncelle
        </Button>,
      ]}
    >
      <Form
        initialValues={{ title: "" }}
        form={form}
        name="updateEvent"
        onFinish={onSubmit}
      >
        <Form.Item name="title">
          <Input placeholder="Başlık" />
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
      </Form>
    </Modal>
  );
};

export default UpdateEventModal;
