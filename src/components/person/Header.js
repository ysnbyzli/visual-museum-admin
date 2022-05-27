import React from "react";
import { Tag } from "antd";
import { encodeDate } from "../../utils/date";

function Header({ person }) {
  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-4xl">
            {person?.firstName} {person?.lastName}
            <span className="text-xs ml-2">
              ({encodeDate(person?.dateOfBirth)}
              {" / "}
              {encodeDate(person?.dateOfDeath)})
            </span>
          </h1>
          <div className="flex items-center">
            <span className="mr-4">{person?.category?.title},</span>
            {person?.tags.map((tag) => (
              <Tag color={tag?.color}>{tag?.title}</Tag>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
