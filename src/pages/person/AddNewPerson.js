import React from "react";
import { Button, DatePicker, Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addNewPerson } from "../../store/personSlice";
import Dragger from "antd/lib/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

const AddNewPerson = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const onSubmit = (values) => {
    dispatch(addNewPerson({ ...values, photo: values.photo.file.thumbUrl }));
    form.resetFields();
    navigate("/persons");
  };

  const props = {
    name: "file",
    multiple: false,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <div className="flex flex-col items-center pt-10">
      <div className="w-[700px]">
        <Form
          initialValues={{
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            dateOfDeath: "",
            photo: "",
          }}
          onFinish={onSubmit}
          className="w-full"
        >
          <div className="flex gap-5">
            <Form.Item
              className="w-full"
              name="firstName"
              rules={[
                { required: true, message: "Ad alanı boş bırakılamaz!" },
                { whitespace: true, message: "Ad alanı boş bırakılamaz!" },
                { min: 3, message: "Minumum 3 karakter olmalıdır!" },
              ]}
              hasFeedback
            >
              <Input placeholder="Ad" />
            </Form.Item>
            <Form.Item
              className="w-full"
              name="lastName"
              rules={[
                { required: true, message: "Soyad alanı boş bırakılamaz!" },
                { whitespace: true, message: "Ad alanı boş bırakılamaz!" },
              ]}
              hasFeedback
            >
              <Input placeholder="Soyad" />
            </Form.Item>
          </div>
          <div className="flex gap-5">
            <Form.Item
              className="w-full"
              name="dateOfBirth"
              rules={[
                {
                  required: true,
                  message: "Doğum Tarihi alanı boş bırakılamaz!",
                },
              ]}
              hasFeedback
            >
              <DatePicker className="w-full" placeholder="Doğum Tarihi" />
            </Form.Item>
            <Form.Item className="w-full" name="dateOfDeath" hasFeedback>
              <DatePicker className="w-full" placeholder="Ölüm Tarihi" />
            </Form.Item>
          </div>
          <Form.Item
            name="photo"
            rules={[
              {
                required: true,
                message: "Lütfen bir fotoğraf seçiniz veya sürükleyiniz!",
              },
            ]}
            hasFeedback
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

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Kaydet
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddNewPerson;
