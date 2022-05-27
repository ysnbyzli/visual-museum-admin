import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Tag,
} from "antd";
import moment from "moment";
import {
  getAllCategories,
  getAllTags,
  updatePerson,
} from "../../../api/request";
import MDEditor from "@uiw/react-md-editor";
import Dragger from "antd/lib/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import {
  handleUpdatePerson,
  updateOnePerson,
} from "../../../store/personSlice";
import category from "../../../pages/category";
import { log } from "../../../utils/log";

const { Option } = Select;

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

const tagRender = (props) => {
  const { label, value, closable, onClose, color } = props;

  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color={color}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{
        marginRight: 3,
      }}
    >
      {label}
    </Tag>
  );
};

function UpdatePersonModal({ isModalVisible, setIsModalVisible, person }) {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState(person?.description);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getAllCategories();
        setCategories(data);
      } catch (e) {}
    })();
    (async () => {
      try {
        const { data } = await getAllTags();
        setTags(data);
      } catch (e) {}
    })();
  }, []);

  const props = {
    name: "file",
    multiple: false,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} fotoğraf başarıyla yüklendi.`);
      } else if (status === "error") {
        message.error(
          `${info.file.name} fotoğraf yüklenme sırasında bir hata oluştu.`
        );
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    defaultFileList: [
      {
        uid: "1",
        name: `${person?.firstName} ${person?.lastName}`,
        status: "done",
        url: person?.photo,
      },
    ],
  };

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const existingCategory = categories.filter(
        (category) => category?._id === values?.category
      );
      const existingTags = tags.filter((tag) => values.tags.includes(tag?._id));
      await updatePerson(person?._id, { ...values, description });
      const customizedValue = {
        ...values,
        _id: person?._id,
        category: Array.isArray(existingCategory) && existingCategory[0],
        tags: existingTags,
        dateOfBirth: values?.dateOfBirth?._i,
        dateOfDeath: values?.dateOfDeath?._i,
        description,
      };
      dispatch(handleUpdatePerson(customizedValue));
      setIsLoading(false);
      setIsModalVisible(false);
    } catch (e) {
      log.error("UPDATE_PERSON", e.response);
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={`${person?.firstName} ${person?.lastName} Güncelle`}
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      width={1000}
      footer={[
        <Button key="back" danger onClick={() => setIsModalVisible(false)}>
          İptal
        </Button>,
        <Button
          form="updateForm"
          key="submit"
          htmlType="submit"
          type="primary"
          loading={isLoading}
        >
          Güncelle
        </Button>,
      ]}
    >
      <Form
        initialValues={{
          firstName: person?.firstName,
          lastName: person?.lastName,
          dateOfBirth: moment(person?.dateOfBirth),
          dateOfDeath: moment(person?.dateOfDeath),
          photo: person?.photo,
          category: person?.category?._id,
          tags: person?.tags?.map((tag) => tag?._id),
        }}
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        id="updateForm"
        onFinish={onSubmit}
      >
        <div className="flex gap-5">
          <Form.Item
            label="Ad"
            className="w-full"
            name="firstName"
            rules={[
              { required: true, message: "Ad alanı boş bırakılamaz!" },
              { whitespace: true, message: "Ad alanı boş bırakılamaz!" },
              { min: 3, message: "Minumum 3 karakter olmalıdır!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Soyad"
            className="w-full"
            name="lastName"
            rules={[
              { required: true, message: "Soyad alanı boş bırakılamaz!" },
              { whitespace: true, message: "Ad alanı boş bırakılamaz!" },
            ]}
          >
            <Input />
          </Form.Item>
        </div>
        <div className="flex gap-5">
          <Form.Item
            label="Doğum Tarihi"
            className="w-full"
            name="dateOfBirth"
            rules={[
              {
                required: true,
                message: "Doğum Tarihi alanı boş bırakılamaz!",
              },
            ]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item className="w-full" name="dateOfDeath" label="Ölüm Tarihi">
            <DatePicker className="w-full" />
          </Form.Item>
        </div>
        <div className="flex gap-5">
          <Form.Item
            label="Kategori"
            className="w-full"
            wrapperCol={{ span: 18 }}
            labelCol={{ span: 6 }}
            name="category"
            rules={[
              {
                required: true,
                message: "Kategori alanı boş bırakılamaz!",
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              optionLabelProp="label"
              defaultValue={person?.category?.title}
            >
              {categories.map(({ title, _id }) => (
                <Option value={_id} label={title}>
                  <div className="demo-option-label-item">{title}</div>
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Etiket"
            className="w-full"
            wrapperCol={{ span: 18 }}
            labelCol={{ span: 6 }}
            name="tags"
            rules={[
              {
                required: true,
                message: "Etiket alanı boş bırakılamaz!",
              },
            ]}
          >
            <Select
              mode="multiple"
              showArrow
              tagRender={tagRender}
              style={{ width: "100%" }}
              options={tags.map((tag) => ({
                value: tag._id,
                label: tag.title,
              }))}
            />
          </Form.Item>
        </div>
        <Form.Item
          wrapperCol={{ span: 21 }}
          labelCol={{ span: 3 }}
          label="Hakkında"
        >
          <div data-color-mode="light">
            <MDEditor value={description} onChange={setDescription} />
          </div>
        </Form.Item>
        <Form.Item
          name="photo"
          rules={[
            {
              required: true,
              message: "Lütfen bir fotoğraf seçiniz veya sürükleyiniz!",
            },
          ]}
          label="Fotoğraf"
          wrapperCol={{ span: 21 }}
          labelCol={{ span: 3 }}
        >
          <Dragger {...props} listType="picture" customRequest={dummyRequest}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibit from
              uploading company data or other band files
            </p>
          </Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UpdatePersonModal;
