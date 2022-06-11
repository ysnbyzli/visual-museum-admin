import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, message, Select, Tag } from "antd";
import MDEditor from "@uiw/react-md-editor";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addNewPerson } from "../../store/personSlice";
import Dragger from "antd/lib/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { getAllCategories, getAllTags } from "../../api/request";
const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};
const { Option } = Select;

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

const AddNewPerson = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const dispatch = useDispatch();

  const onSubmit = (values) => {
    dispatch(
      addNewPerson({
        ...values,
        description,
        photo: values.photo.file.thumbUrl,
      })
    );
    form.resetFields();
    navigate("/persons");
  };

  const props = {
    name: "file",
    multiple: false,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        
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
      
    },
  };

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
  return (
    <div className="flex flex-col items-center pb-10">
      <h1 className="self-start text-4xl">Kişi Ekle</h1>
      <div className="w-full flex ">
        <Form
          initialValues={{
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            dateOfDeath: "",
            photo: "",
            category: "",
            tags: [],
          }}
          onFinish={onSubmit}
          className="w-full"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
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
            <Form.Item
              className="w-full"
              name="dateOfDeath"
              label="Ölüm Tarihi"
            >
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
                placeholder=""
                optionLabelProp="label"
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
          <div className="flex justify-center items-center">
            <Button type="primary" htmlType="submit" className="w-1/2 ml-24">
              Kaydet
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AddNewPerson;
