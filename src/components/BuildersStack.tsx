import { Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import { BsImage } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";
import { v4 as uuidv4 } from "uuid";
import { duplicateRecipeBuilderData } from "../utils/data";
import RecipeBuilder from "./RecipeBuilder";

interface BuildersStackProps {
  showError: (text: string) => void;
}

const BuildersStack: React.FC<BuildersStackProps> = ({ showError }) => {
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
      <div className="fixed left-4 top-28 hidden lg:flex flex-col h-[calc(100vh-7rem)] ">
        <div
          className="flex items-center justify-center bg-white  rounded-lg shadow-sm cursor-pointer text-grey-icon text-xl w-10 h-16 mb-3"
          onClick={() => duplicateBuilder(null, {})}
        >
          <GrAdd />
        </div>
        <div className="w-10 h-[0.5px] bg-gray-400"></div>
        {/* have to calculate height */}
        <div className="flex-1 overflow-scroll mt-1 pr-4 pb-3">
          {buildersPreview.map((preview) => (
            <div
              key={`preview-${preview.id}`}
              className="bg-grey2 w-10 h-16 grid place-items-center rounded-lg shadow-sm cursor-pointer mt-2 overflow-hidden"
            >
              {preview.image ? <img src={preview.image} /> : <BsImage />}
            </div>
          ))}
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
        <div
          className="flex items-center justify-center bg-white  rounded-lg shadow-sm cursor-pointer bg-opacity-70 hover:bg-opacity-100 text-grey-icon py-3 transition-all duration-100 lg:hidden"
          onClick={() => duplicateBuilder(null, {})}
        >
          <GrAdd />
          <span className="ml-2">Add recipe builder</span>
        </div>
      </Stack>
    </>
  );
};

export default BuildersStack;
