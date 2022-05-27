import React, { useState } from "react";
import { Avatar, message, Modal, Tag } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { deletePerson } from "../../api/request";
import { useNavigate } from "react-router-dom";
import UpdatePersonModal from "../modal/person/UpdatePersonModal";

function Header({ person }) {
  return (
    <>
      <div className="flex  justify-between">
        <div className="flex items-center gap-5">
          <Avatar
            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
            icon={<UserOutlined />}
            src={person?.photo}
          />
          <div className="flex flex-col">
            <p className="flex items-center gap-2">
              <span className="font-bold">Kategori:</span>{" "}
              {person?.category?.title}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-bold">Etiket:</span>{" "}
              {person?.tags.map((tag) => (
                <Tag color={tag?.color}>{tag?.title}</Tag>
              ))}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
