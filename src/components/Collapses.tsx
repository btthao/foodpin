import { Button, Collapse, useDisclosure } from "@chakra-ui/react";
import { FaChevronDown } from "react-icons/fa";

interface CollapsesProps {
  title: string;
  content: any;
}

const Collapses: React.FC<CollapsesProps> = ({ title, content }) => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <div>
      <div className="flex items-center gap-1">
        <h2 className="text-lg font-bold">{title}</h2>
        <Button
          p="0"
          width="44px"
          height="44px"
          borderRadius="full"
          variant="ghost"
          onClick={onToggle}
        >
          <FaChevronDown
            className={`text-lg transform transition-transform ${
              !isOpen ? "-rotate-90" : "rotate-0"
            }`}
          />
        </Button>
      </div>
      <Collapse in={isOpen} animateOpacity>
        {content}
      </Collapse>
    </div>
  );
};

export default Collapses;
