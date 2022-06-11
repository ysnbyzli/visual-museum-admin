import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Upload,
  Modal,
  message,
} from "antd";
import { addEvent, getAllPerson, getAllTags } from "../../api/request";
import { PlusOutlined } from "@ant-design/icons";

import { log } from "../../utils/log";

const { Option } = Select;

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

function CreateEvent() {
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
  // Form hook
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
    setIsLoading(true);
    message.loading({ content: "Oluşturuluyor...", updatable: "updatable" });
    try {
      const data = {
        description: values?.description,
        person: values?.person,
        tags: values?.tags,
        title: values?.title,
        photos: fileList?.map(({ thumbUrl }) => thumbUrl),
        startDate: values?.date[0]?._d,
        endDate: values?.date[1]?._d,
      };
      await addEvent(data);
      form.resetFields();
      setFileList([]);
      setIsLoading(false);
      message.success("Yeni bir olay oluşturuldu!");
    } catch (e) {
      setIsLoading(false);
      log.error("CREATE_EVENT", e.response);
      message.error("Olay oluşturulurken bilinmeyen bir hata oldu!");
    }
  };
  return (
    <div>
      <h1 className="text-4xl">Olay Oluştur</h1>
      <div>
        <Form
          form={form}
          initialValues={{
            title: "",
            person: "",
            description: "",
            date: "",
            photos: "",
            tags: [],
          }}
          name="control-hooks"
          labelCol={{ span: 2 }}
          labelAlign="left"
          wrapperCol={{ span: 24 }}
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
            <Select allowClear>
              {persons?.map(({ _id, firstName, lastName }) => (
                <Option value={_id}>{`${firstName} ${lastName}`}</Option>
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
              maxLength={450}
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
                <Option value={_id}>{title}</Option>
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
          <div className="flex justify-end">
            <Button
              type="primary"
              htmlType="submit"
              className="w-[91.8%]"
              loading={isLoading}
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default CreateEvent;
