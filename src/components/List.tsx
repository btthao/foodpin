import {
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Input,
  useEditableControls,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { IoIosAddCircleOutline } from "react-icons/io";
import { RiDeleteBin3Fill } from "react-icons/ri";
import { uploadState } from "./RecipeBuilder";

interface ListProps {
  name: string;
  list: string[];
  updateList: Function;
  upload: number;
}
// show more or less
const List: React.FC<ListProps> = ({ name, list, updateList, upload }) => {
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (newItem !== "") {
      updateList([...list, newItem]);
      setNewItem("");
    }
  };

  const removeItem = (idx: number) => {
    const updatedList = list.filter((_, i) => i !== idx);
    updateList(updatedList);
  };

  const editList = (idx: number, newValue: string) => {
    if (newValue === "") {
      removeItem(idx);
    } else {
      let updatedList = [...list];
      updatedList[idx] = newValue;
      updateList(updatedList);
    }
  };

  const EditableControls: React.FC<{ idx: number }> = ({ idx }) => {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <Button p="0" {...getSubmitButtonProps()}>
          <AiOutlineCheck />
        </Button>
        <Button
          p="0"
          {...getCancelButtonProps()}
          onClick={() => removeItem(idx)}
        >
          <RiDeleteBin3Fill />
        </Button>
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <Button size="sm" bg="none" p="0" {...getEditButtonProps()}>
          <FiEdit />
        </Button>
      </Flex>
    );
  };

  return (
    <div>
      <p className=" pb-1 font-bold text-lg capitalize">
        {name.split("-")[name.split("-").length - 1]}:
      </p>
      {/* display list items */}
      <ul>
        {list.map((item, idx) => (
          <li
            key={`${name}-${item}-${idx}`}
            className={` ${
              name.includes("instructions") ? "mb-3" : "mb-[0.15rem]"
            }`}
          >
            {name.includes("instructions") && (
              <div className="font-bold ">step {idx + 1} </div>
            )}
            <Editable
              submitOnBlur={true}
              className="flex"
              defaultValue={item}
              isPreviewFocusable={false}
              onSubmit={(newValue) => {
                editList(idx, newValue);
              }}
            >
              <EditablePreview fontSize="md" className="flex-grow mr-4 " />
              <Input
                size="sm"
                fontSize="md"
                className="flex-grow mr-4"
                as={EditableInput}
              />
              <EditableControls idx={idx} />
            </Editable>
          </li>
        ))}
      </ul>
      {/* add new item */}
      <div className="flex gap-3 mt-1">
        <Input
          variant="flushed"
          size="sm"
          type="text"
          value={newItem}
          borderColor="borderGrey"
          onChange={(e) => setNewItem(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") addItem();
          }}
          isInvalid={upload === uploadState.ATTEMPT_UPLOADING && !list.length}
        />

        <Button size="sm" px="0" bg="none" onClick={() => addItem()}>
          <IoIosAddCircleOutline className="text-xl" />
        </Button>
      </div>
    </div>
  );
};

export default List;
