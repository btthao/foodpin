import React from "react";
import { Avatar as ChakraAvatar } from "@chakra-ui/react";
interface AvatarProps {
  name: string;
  src: string;
  size?: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, src, size }) => {
  return (
    <ChakraAvatar
      size={size || "sm"}
      name={name.replace(" ", "-")}
      src={src}
      bg="bgGrey"
      color="black"
    />
  );
};

export default Avatar;
