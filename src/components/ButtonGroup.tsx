import { Button, Stack } from "@chakra-ui/react";

interface ButtonGroupProps {
  options: string[];
  selected: string;
  setOption: (option: string) => void;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  options,
  selected,
  setOption,
}) => {
  return (
    <Stack direction="row" spacing={5} align="center">
      {options.map((option: string) => (
        <Button
          key={`${option}-button`}
          variant="ghost"
          _hover={{
            bg: `${selected === option ? "transparent" : "hoverGrey"}`,
          }}
          _focus={{ outline: "none" }}
          _active={{ bg: "transparent" }}
          onClick={() => setOption(option)}
          px="2"
        >
          <div className="font-bold relative">
            {option}
            <span
              className={`absolute -bottom-2 left-0 w-full h-[3px] ${
                selected === option
                  ? "transition-all translate-y-0 bg-black duration-[40ms] ease-out"
                  : "transition-none -translate-y-3 bg-transparent"
              } `}
            ></span>
          </div>
        </Button>
      ))}
    </Stack>
  );
};

export default ButtonGroup;
