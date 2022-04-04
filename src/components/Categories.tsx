import {
  FormControl,
  FormErrorMessage,
  Input,
  ScaleFade,
  Tag,
  TagCloseButton,
  TagLabel,
} from "@chakra-ui/react";
import { useState } from "react";

interface CategoriesProps {
  id: string;
  categories: string[];
  setCategories: Function;
}

const Categories: React.FC<CategoriesProps> = ({
  id,
  categories,
  setCategories,
}) => {
  const [addNewCategory, setAddNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [isError, setIsError] = useState(false);

  const updateCategories = () => {
    if (categories.includes(newCategory.toLowerCase())) {
      setIsError(true);
    } else {
      if (newCategory !== "") {
        setCategories([...categories, newCategory.toLowerCase()]);
      }
      setNewCategory("");
      setAddNewCategory(false);
    }
  };
  const removeCategory = (cat: string, idx: number) => {
    const newCategories = categories.filter(
      (name, i) => i !== idx && name !== cat
    );
    setCategories(newCategories);
  };

  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((cat, idx) => (
        <Tag
          key={`${id}-${cat}`}
          variant="solid"
          borderRadius="full"
          bg="bgGrey"
          color="black"
          py="2"
          px="3"
        >
          <TagLabel>{cat}</TagLabel>
          <TagCloseButton ml="3" onClick={() => removeCategory(cat, idx)} />
        </Tag>
      ))}

      {addNewCategory ? (
        <ScaleFade initialScale={0.9} in={true}>
          <FormControl className="relative" isInvalid={isError}>
            <Input
              variant="filled"
              size="sm"
              type="text"
              value={newCategory}
              onChange={(e) => {
                setIsError(false);
                setNewCategory(e.target.value);
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter") updateCategories();
              }}
              onBlur={updateCategories}
              autoFocus={true}
              py="2"
              bg="white"
              _hover={{ bg: "white" }}
            />
            {isError && (
              <FormErrorMessage className="absolute bg-white -top-1/2 left-4 text-xs py-0 px-2">
                Duplicate category
              </FormErrorMessage>
            )}
          </FormControl>
        </ScaleFade>
      ) : (
        <Tag
          key={`${id}-new-cat`}
          variant="solid"
          borderRadius="full"
          bg="bgGrey"
          color="black"
          className="cursor-pointer"
          fontWeight="bold"
          py="2"
          px="3"
          onClick={() => setAddNewCategory(true)}
          _active={{
            transform: "scale(0.9)",
          }}
          transition="ease-in-out"
          transitionDuration="150ms"
        >
          <TagLabel>Add category</TagLabel>
        </Tag>
      )}
    </div>
  );
};

export default Categories;
