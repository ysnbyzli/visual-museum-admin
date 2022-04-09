import React from "react";
import { Button, DatePicker, Form, Input } from "antd";

const AddNewPerson = () => {
  const onSubmit = (values) => {
    alert(JSON.stringify(values, null, 2));
  };

  return (
    <div className="flex flex-col items-center pt-10">
      <div className="w-[700px]">
        <Form
          initialValues={{
            firstName: "",
            lastName: "",
            birthOfDate: "",
            deathOfDate: "",
          }}
          onFinish={onSubmit}
          className="w-full"
        >
          <div className="flex gap-5">
            <Form.Item
              className="w-full"
              name="name"
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
              name="birthOfDate"
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
            <Form.Item className="w-full" name="deathOfDate" hasFeedback>
              <DatePicker className="w-full" placeholder="Ölüm Tarihi" />
            </Form.Item>
          </div>
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
