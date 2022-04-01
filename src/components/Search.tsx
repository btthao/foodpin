import React from "react";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { AiOutlineSearch } from "react-icons/ai";
interface SearchProps {}

const Search: React.FC<SearchProps> = ({}) => {
  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
        height="100%"
        children={<AiOutlineSearch className="text-xl text-gray-500" />}
      />
      <Input
        variant="filled"
        type="text"
        placeholder="Search"
        borderRadius="3xl"
        py="5"
        bg="bgGrey"
        _hover={{ bg: "hoverGrey" }}
        _focus={{ bg: "hoverGrey" }}
      />
    </InputGroup>
  );
};

export default Search;
