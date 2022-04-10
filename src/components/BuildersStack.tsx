import { Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import { BiChevronRight } from "react-icons/bi";
import { BsImage } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";
import { v4 as uuidv4 } from "uuid";
import { duplicateRecipeBuilderData } from "../utils/data";
import RecipeBuilder from "./RecipeBuilder";

interface BuildersStackProps {
  showError: (text: string) => void;
}

const BuildersStack: React.FC<BuildersStackProps> = ({ showError }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [builders, setBuilders] = useState<
    {
      id: string;
      data: duplicateRecipeBuilderData;
    }[]
  >([{ id: uuidv4(), data: {} }]);

  const [buildersPreview, setBuildersPreview] = useState<
    { id: string; image?: string }[]
  >([{ id: builders[0].id }]);

  const updateBuildersPreview = (id: string, image: string) => {
    const newBuildersPreview = [...buildersPreview];
    for (const builder of newBuildersPreview) {
      if (builder.id === id) {
        builder.image = image;
        break;
      }
    }
    setBuildersPreview(newBuildersPreview);
  };

  const duplicateBuilder = (
    afterId: string | null,
    data: duplicateRecipeBuilderData
  ) => {
    const id = uuidv4();

    if (afterId) {
      let insertIdx: number = builders.length;

      for (let i = 0; i < builders.length; i++) {
        if (builders[i].id === afterId) {
          insertIdx = i + 1;
          break;
        }
      }

      const newBuilders = [...builders];
      const newBuildersPreview = [...buildersPreview];

      newBuilders.splice(insertIdx, 0, {
        id,
        data,
      });

      newBuildersPreview.splice(insertIdx, 0, {
        id,
        image: data.image1 ? URL.createObjectURL(data.image1) : data.image2,
      });

      setBuilders(newBuilders);
      setBuildersPreview(newBuildersPreview);
    } else {
      // click add new at the bottom
      setBuilders([...builders, { id, data }]);
      setBuildersPreview([...buildersPreview, { id }]);
    }
  };

  const deleteBuilder = (id: string) => {
    const newBuilders = builders.filter((builder) => builder.id !== id);
    const newBuildersPreview = buildersPreview.filter(
      (builder) => builder.id !== id
    );

    if (newBuilders.length && newBuildersPreview.length) {
      setBuilders(newBuilders);
      setBuildersPreview(newBuildersPreview);
    } else {
      const id = uuidv4();
      setBuilders([{ id, data: {} }]);
      setBuildersPreview([{ id }]);
    }
  };

  return (
    <>
      {/* sidebar */}
      <div
        className={`fixed left-0 top-0 pl-4 pt-28 flex flex-col h-screen z-50 transform transition-transform shadow-lg bg-grey1 border-r-2 border-white lg:border-0 lg:shadow-none  ${
          showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div
          className="flex items-center justify-center bg-white  rounded-lg shadow-sm cursor-pointer text-grey-icon text-xl w-10 h-[3.7rem] mb-3"
          onClick={() => duplicateBuilder(null, {})}
        >
          <GrAdd />
        </div>
        <div className="w-10 h-[0.5px] bg-gray-400"></div>
        <div className="flex-1 overflow-scroll mt-1 pr-4 pb-3 z-20">
          {buildersPreview.map((preview) => (
            <div
              key={`preview-${preview.id}`}
              className="bg-grey2 w-10 h-[3.7rem] grid place-items-center rounded-lg shadow-sm cursor-pointer mt-2 overflow-hidden"
            >
              {preview.image ? (
                <img src={preview.image} />
              ) : (
                <BsImage className="text-grey-icon" />
              )}
            </div>
          ))}
        </div>
        {/* hide btn */}
        <div
          className="absolute -right-1 top-1/2 transform -translate-y-1/2 translate-x-full rounded-full bg-grey2 shadow-lg border-2 border-white w-8 h-8  lg:hidden"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <button className=" w-full h-full rounded-full grid place-items-center  bg-grey2">
            <BiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>
      <Stack direction="column" spacing={10}>
        {builders.map((builder) => (
          <RecipeBuilder
            key={builder.id}
            id={builder.id}
            builderData={builder.data}
            duplicateFn={duplicateBuilder}
            deleteFn={deleteBuilder}
            showError={showError}
            updateBuildersPreview={updateBuildersPreview}
          />
        ))}
      </Stack>
    </>
  );
};

export default BuildersStack;
