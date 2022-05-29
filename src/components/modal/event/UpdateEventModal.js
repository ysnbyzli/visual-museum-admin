import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Select, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getAllPerson, getAllTags, updateEvent } from "../../../api/request";
import moment from "moment";
import { log } from "../../../utils/log";

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });

const uploadButton = (
  <div>
    <PlusOutlined />
    <div
      style={{
        marginTop: 8,
      }}
    >
      Upload
    </div>
  </div>
);

const UpdateEventModal = ({
  isModalVisible,
  setIsModalVisible,
  event: {
    _id,
    title,
    person,
    description,
    endDate,
    startDate,
    tags: dataTags,
    photos,
  },
  setEvents,
  events,
}) => {
  // data
  const [persons, setPersons] = useState([]);
  const [tags, setTags] = useState([]);
  // pictures
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  // loading
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  useEffect(() => {
    if (Array.isArray(photos) && photos.length > 0) {
      setFileList(
        photos.map((photo, index) => ({
          uid: `${index}`,
          name: `${index}`,
          status: "done",
          url: photo,
        }))
      );
    }
  }, [photos]);

  useEffect(() => {
    (async () => {
      try {
        const response = await getAllPerson();
        setPersons(response?.data);
      } catch (e) {}
    })();
    (async () => {
      try {
        const response = await getAllTags();
        setTags(response?.data);
      } catch (e) {}
    })();
  }, []);

  const onSubmit = async (values) => {
    try {
      const data = {
        description: values?.description,
        person: values?.person,
        tags: values?.tags,
        title: values?.title,
        photos: fileList?.map(({ thumbUrl, url }) => thumbUrl || url),
        startDate: values?.date[0]?._d,
        endDate: values?.date[1]?._d,
      };
      const response = await updateEvent(_id, data);
      setEvents(
        events.map((event) =>
          event?._id !== _id
            ? event
            : {
                _id,
                title: values?.title,
                photos: fileList?.map(({ thumbUrl, url }) => thumbUrl || url),
                startDate: values?.date[0]?._d,
                endDate: values?.date[1]?._d,
                description: values?.description,
                tags: tags.filter((tag) => values?.tags?.includes(tag._id)),
              }
        )
      );
      setIsModalVisible(false);
      log.success("UPDATE_EVENT", response.data);
    } catch (e) {
      log.error("UPDATE_EVENT", e.response);
    }
  };

  return (
    <Modal
      title={`${title} Adlı Olayı Güncelle`}
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      width={1000}
      footer={[
        <Button key="back" danger onClick={() => setIsModalVisible(false)}>
          İptal
        </Button>,
        <Button form="updateForm" key="submit" htmlType="submit" type="primary">
          Güncelle
        </Button>,
      ]}
    >
      <Form
        id="updateForm"
        form={form}
        initialValues={{
          title: title,
          person: person,
          description: description,
          date: [moment(startDate), moment(endDate)],
          photos: "",
          tags: dataTags.map((tag) => tag?._id),
        }}
        name="control-hooks"
        labelCol={{ span: 4 }}
        labelAlign="left"
        wrapperCol={{ span: 22 }}
        onFinish={onSubmit}
      >
        <Form.Item
          name="title"
          label="Başlık"
          rules={[
            {
              required: true,
              message: "Başlık alanı zorunludur!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="person"
          label="Kişi"
          rules={[
            {
              required: true,
              message: "Olay oluşturmak için bir kişi seçmelisiniz!",
            },
          ]}
        >
          <Select
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {persons?.map(({ _id, firstName, lastName }) => (
              <Select.Option
                value={_id}
              >{`${firstName} ${lastName}`}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="description"
          label="Açıklama"
          rules={[
            {
              required: true,
              message: "Açıklama alanı zorunludur!",
            },
            {
              min: 10,
              message: "En az 10 karakter girilmelidir!",
            },
          ]}
        >
          <Input.TextArea
            autoSize={{ minRows: 3, maxRows: 5 }}
            maxLength={400}
          />
        </Form.Item>
        <Form.Item
          name="date"
          label="Tarih Aralığı"
          rules={[
            {
              required: true,
              message: "Tarih aralığı alanı zorunludur!",
            },
          ]}
        >
          <DatePicker.RangePicker
            className="w-full"
            placeholder={["Başlangıç Tarihi", "Bitiş Tarihi"]}
          />
        </Form.Item>
        <Form.Item name="tags" label="Etiketler">
          <Select allowClear mode="tags">
            {tags?.map(({ _id, title }) => (
              <Select.Option value={_id}>{title}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Fotoğraf" name="photos">
          <Upload
            customRequest={dummyRequest}
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
          <Modal
            visible={previewVisible}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img
              alt="example"
              style={{
                width: "100%",
              }}
              src={previewImage}
            />
          </Modal>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateEventModal;
