import { Button, Stack } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useState } from "react";
import BuildersStack from "../components/BuildersStack";

const NewRecipe: NextPage = () => {
  const [createMethod, setCreateMethod] = useState("webscrape");

  return (
    <div className="max-w-4xl mx-auto px-9 md:px-12 lg:px-5 py-10 sm:py-16">
      <Stack direction="row" spacing={5} align="center">
        {["webscrape", "manual"].map((method: string) => (
          <Button
            key={`${method}-button`}
            variant="ghost"
            _hover={{
              bg: `${createMethod === method ? "transparent" : "hoverGrey"}`,
            }}
            _focus={{ outline: "none" }}
            _active={{ bg: "transparent" }}
            onClick={() => setCreateMethod(method)}
            px="2"
          >
            <div className="font-bold relative">
              {method === "webscrape" ? "Copy from web" : "Create recipe"}
              <span
                className={`absolute -bottom-2 left-0 w-full h-[3px] ${
                  createMethod === method
                    ? "transition-all translate-y-0 bg-black duration-[40ms] ease-out"
                    : "transition-none -translate-y-3 bg-transparent"
                } `}
              ></span>
            </div>
          </Button>
        ))}
      </Stack>
      <div className="mt-6">
        <BuildersStack
          key={`${createMethod}-stack`}
          createMethod={createMethod}
        />
      </div>
    </div>
  );
};

export default NewRecipe;
