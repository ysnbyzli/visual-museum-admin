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
  Empty,
} from "antd";
import { addEvent, getAllPerson, getAllTags } from "../../api/request";
import { PlusOutlined } from "@ant-design/icons";

import { log } from "../../utils/log";
import { Link } from "react-router-dom";

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
    message.loading({ content: "Olu??turuluyor...", updatable: "updatable" });
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
      message.success("Yeni bir olay olu??turuldu!");
    } catch (e) {
      setIsLoading(false);
      log.error("CREATE_EVENT", e.response);
      message.error("Olay olu??turulurken bilinmeyen bir hata oldu!");
    }
  };
  return (
    <div>
      <h1 className="text-4xl">Olay Olu??tur</h1>
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
          labelCol={{ span: 3 }}
          labelAlign="left"
          wrapperCol={{ span: 23 }}
          onFinish={onSubmit}
        >
          <Form.Item
            name="title"
            label="Ba??l??k"
            rules={[
              {
                required: true,
                message: "Ba??l??k alan?? zorunludur!",
              },
            ]}
          >
            <Input maxLength={100} showCount />
          </Form.Item>
          <Form.Item
            name="person"
            label="Ki??i"
            rules={[
              {
                required: true,
                message: "Olay olu??turmak i??in bir ki??i se??melisiniz!",
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
            label="A????klama"
            rules={[
              {
                required: true,
                message: "A????klama alan?? zorunludur!",
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
              showCount
            />
          </Form.Item>
          <Form.Item
            name="date"
            label="Tarih Aral??????"
            rules={[
              {
                required: true,
                message: "Tarih aral?????? alan?? zorunludur!",
              },
            ]}
            className="!mt-8"
          >
            <DatePicker.RangePicker
              className="w-full"
              placeholder={["Ba??lang???? Tarihi", "Biti?? Tarihi"]}
              disabledDate={(current) =>
                current && current.valueOf() > Date.now()
              }
            />
          </Form.Item>
          <Form.Item name="tags" label="Etiketler">
            <Select
              mode="multiple"
              showArrow
              allowClear
              notFoundContent={
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  imageStyle={{
                    height: 60,
                  }}
                  description={<span>Etiket Bulunamad??</span>}
                >
                  <Link to="/tags">
                    <Button type="primary">??imdi Olu??tur</Button>
                  </Link>
                </Empty>
              }
              style={{ width: "100%" }}
              options={tags.map((tag) => ({
                value: tag._id,
                label: tag.title,
              }))}
            />
          </Form.Item>
          <Form.Item label="Foto??raf" name="photos">
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
              className="w-[87.5%]"
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
