import React, { useState } from "react";
import { Avatar, message, Modal } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Tag from "../shared/Tag";

function Header({ person }) {
  return (
    <>
      <div className="">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl">
            {person?.firstName} {person?.lastName}
          </h1>
          <div className="flex items-center">
            <span className="mr-4">{person?.category?.title},</span>
            {person?.tags.map((tag) => (
              <Tag color={tag?.color} text={tag?.title} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
