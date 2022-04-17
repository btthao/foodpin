import { Box } from "@chakra-ui/react";

interface ImageBoxProps {
  zIndex: number;
}

const ImageBox: React.FC<ImageBoxProps> = ({ zIndex, children }) => {
  return (
    <Box
      w="115px"
      h="160px"
      bg="bgGrey"
      border="1px"
      borderColor="white"
      borderRadius="xl"
      borderWidth="1.5px"
      zIndex={zIndex}
      overflow="hidden"
    >
      {children}
    </Box>
  );
};

export default ImageBox;
