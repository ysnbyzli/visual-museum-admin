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
  findById,
  getAllCategories,
  getAllTags,
  updatePerson,
} from "../../../api/request";
import MDEditor from "@uiw/react-md-editor";
import Dragger from "antd/lib/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { handleUpdatePerson } from "../../../store/personSlice";
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

function UpdatePersonModal({ isModalVisible, setIsModalVisible, personId }) {
  const [form] = Form.useForm();
  const [title, setTitle] = useState(null);
  const [photo, setPhoto] = useState("");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
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

  useEffect(() => {
    if (personId) {
      (async () => {
        try {
          const res = await findById(personId);
          const person = res.data;
          log.success("FIND_BY_PERSON", person);
          form.setFieldsValue({
            firstName: person?.firstName,
            lastName: person?.lastName,
            dateOfBirth: moment(person?.dateOfBirth),
            dateOfDeath: moment(person?.dateOfDeath),
            photo: person?.photo,
            category: person?.category?._id,
            tags: person?.tags?.map((tag) => tag?._id),
          });
          setDescription(person?.description);
          setTitle(`${person?.firstName} ${person?.lastName}`);
          setPhoto(person?.photo);
        } catch (e) {}
      })();
    }
  }, [personId]);

  const props = {
    name: "file",
    multiple: false,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
      }
      if (status === "done") {
        message.success(`${info.file.name} foto??raf ba??ar??yla y??klendi.`);
      } else if (status === "error") {
        message.error(
          `${info.file.name} foto??raf y??klenme s??ras??nda bir hata olu??tu.`
        );
      }
    },
    onDrop(e) {},
    defaultFileList: [
      {
        uid: "1",
        name: title,
        status: "done",
        url: photo,
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
      await updatePerson(personId, { ...values, description });
      const customizedValue = {
        ...values,
        _id: personId,
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
      title={`${title} G??ncelle`}
      visible={isModalVisible}
      onCancel={() => setIsModalVisible(false)}
      width={1000}
      footer={[
        <Button key="back" danger onClick={() => setIsModalVisible(false)}>
          ??ptal
        </Button>,
        <Button
          form="updateForm"
          key="submit"
          htmlType="submit"
          type="primary"
          loading={isLoading}
        >
          G??ncelle
        </Button>,
      ]}
    >
      <Form
        id="updateForm"
        initialValues={{
          firstName: "",
          lastName: "",
          dateOfBirth: "",
          dateOfDeath: "",
          photo: "",
          category: "",
          tags: "",
        }}
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onFinish={onSubmit}
      >
        <div className="flex gap-5">
          <Form.Item
            label="Ad"
            className="w-full"
            name="firstName"
            rules={[
              { required: true, message: "Ad alan?? bo?? b??rak??lamaz!" },
              { whitespace: true, message: "Ad alan?? bo?? b??rak??lamaz!" },
              { min: 3, message: "Minumum 3 karakter olmal??d??r!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Soyad"
            className="w-full"
            name="lastName"
            rules={[
              { required: true, message: "Soyad alan?? bo?? b??rak??lamaz!" },
              { whitespace: true, message: "Ad alan?? bo?? b??rak??lamaz!" },
            ]}
          >
            <Input />
          </Form.Item>
        </div>
        <div className="flex gap-5">
          <Form.Item
            label="Do??um Tarihi"
            className="w-full"
            name="dateOfBirth"
            rules={[
              {
                required: true,
                message: "Do??um Tarihi alan?? bo?? b??rak??lamaz!",
              },
            ]}
          >
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item className="w-full" name="dateOfDeath" label="??l??m Tarihi">
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
                message: "Kategori alan?? bo?? b??rak??lamaz!",
              },
            ]}
          >
            <Select style={{ width: "100%" }} optionLabelProp="label">
              {categories.map(({ title, _id }) => (
                <Option value={_id} label={title} key={_id}>
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
                message: "Etiket alan?? bo?? b??rak??lamaz!",
              },
            ]}
          >
            <Select
              mode="tags"
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
          label="Hakk??nda"
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
              message: "L??tfen bir foto??raf se??iniz veya s??r??kleyiniz!",
            },
          ]}
          label="Foto??raf"
          wrapperCol={{ span: 21 }}
          labelCol={{ span: 3 }}
        >
          <Dragger
            {...props}
            defa
            listType="picture"
            customRequest={dummyRequest}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Bir foto??raf s??r??kleyin veya t??klay??n.
            </p>
          </Dragger>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default UpdatePersonModal;
