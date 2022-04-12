import React from "react";
import { Avatar as ChakraAvatar } from "@chakra-ui/react";
interface AvatarProps {
  name: string;
  src: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, src }) => {
  return (
    <ChakraAvatar
      size="sm"
      width="26px"
      height="26px"
      name={name}
      src={src}
      bg="bgGrey"
      color="black"
      className="text-xs"
    />
  );
};

export default Avatar;
