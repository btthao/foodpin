import {
  Alert,
  AlertDescription,
  AlertIcon,
  AspectRatio,
  Box,
  Button,
  CloseButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { IoIosImages } from "react-icons/io";
import { Oval } from "react-loader-spinner";
import { Categories, List } from ".";
import { client } from "../client";
import { resetFeed } from "../store/features/feedSlice";
import { selectUser } from "../store/features/userSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { DuplicateRecipeBuilderData, RecipeBuilderData } from "../utils/data";
// pass down prop id to list and categories
interface RecipeBuilderProps {
  id: string;
  builderData: DuplicateRecipeBuilderData;
  duplicateFn?: (
    afterId: string | null,
    data: DuplicateRecipeBuilderData
  ) => void;
  deleteFn: (id: string) => void;
  showError: (text: string) => void;
  updateBuildersPreview?: (id: string, image: string) => void;
}

type RecipeDoc = RecipeBuilderData & {
  _type: string;
  byUser: {
    _type: string;
    _ref: string;
  };
};

export enum uploadState {
  NOT_UPLOADING,
  ATTEMPT_UPLOADING,
  UPLOAD_SUCCESS,
  UPLOAD_FAIL,
}

const RecipeBuilder: React.FC<RecipeBuilderProps> = ({
  id,
  builderData,
  duplicateFn,
  deleteFn,
  showError,
  updateBuildersPreview,
}) => {
  // start recipe data state
  const [name, setName] = useState<string>(builderData?.name || "");
  const [ingredients, setIngredients] = useState<string[]>(
    builderData?.ingredients || []
  );
  const [instructions, setInstructions] = useState<string[]>(
    builderData?.instructions || []
  );
  const [categories, setCategories] = useState<string[]>(
    builderData?.categories || []
  );
  const [servings, setServings] = useState<string>(builderData?.servings || "");
  const [image1, setImage1] = useState<any>(builderData?.image1 || null);
  const [image2, setImage2] = useState<string>(builderData?.image2 || "");
  const [destination, setDestination] = useState<string>(
    builderData?.destination || ""
  );
  // end recipe data state
  const { id: userId } = useAppSelector(selectUser);
  const [upload, setUpload] = useState<number>(uploadState.NOT_UPLOADING);
  const [showSpinner, setShowSpinner] = useState(false);
  const [isMissingFields, setIsMissingFields] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const acceptedImgType = ["image/jpeg", "image/png", "image/webp"];
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (updateBuildersPreview) {
      updateBuildersPreview(id, image1 ? URL.createObjectURL(image1) : "");
    }
  }, [image1]);

  const createDoc = (image1?: any) => {
    const doc: RecipeDoc = {
      _type: "recipe",
      name,
      ingredients,
      instructions,
      categories,
      servings,
      destination,
      image2: image2 || "",
      byUser: {
        _type: "byUser",
        _ref: userId,
      },
    };

    if (image1) {
      doc.image1 = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: image1._id,
        },
      };
    }

    client
      .create(doc)
      .then(() => {
        setUploadSuccess(true);
        dispatch(resetFeed());
      })
      .catch((error: { message: any }) => {
        showError(
          "There was a problem uploading your recipe. Try again later."
        );
        setShowSpinner(false);
        console.log("Upload failed:", error.message);
      });
  };

  const uploadRecipe = () => {
    setUpload(uploadState.ATTEMPT_UPLOADING);
    setIsMissingFields(false);

    if (
      name &&
      ingredients.length > 0 &&
      instructions.length > 0 &&
      (image1 || image2)
    ) {
      setShowSpinner(true);

      if (image1 && acceptedImgType.includes(image1.type)) {
        client.assets
          .upload("image", image1, {
            contentType: image1.type,
            filename: image1.name,
          })
          .then((documentImg) => {
            createDoc(documentImg);
          })
          .catch((error: { message: any }) => {
            console.log("Upload failed:", error.message);
            showError(
              "There was a problem uploading your recipe. Try again later."
            );
            setShowSpinner(false);
          });
      } else {
        createDoc();
      }
    } else {
      setIsMissingFields(true);
    }
  };

  if (uploadSuccess) {
    return (
      <div className="w-full relative bg-white p-5 rounded-xl shadow-sm flex justify-between gap-10">
        <div className="flex items-center gap-5 flex-1">
          <AspectRatio
            width="60px"
            borderRadius="lg"
            overflow="hidden"
            ratio={1}
            className="hidden sm:block"
          >
            <img
              src={image2 !== "" ? image2 : URL.createObjectURL(image1)}
              alt="uploaded-pic"
              className="object-cover"
            />
          </AspectRatio>
          <div className="text-gray-600 flex-1">
            <h1 className="text-md sm:text-lg font-bold line-clamp-1">
              {name}
            </h1>
            <p className="text-xs">Published just now</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button borderRadius="3xl">See it</Button>
          <CloseButton
            borderRadius="full"
            size="sm"
            onClick={() => {
              deleteFn(id);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative bg-white px-5 py-8 md:py-12 md:px-9 rounded-xl shadow-sm">
      {showSpinner && (
        <div className="absolute  top-0 left-0 w-full h-full bg-white z-50 opacity-90 flex justify-center pt-20">
          <Oval
            ariaLabel="loading-indicator"
            height={100}
            width={100}
            strokeWidth={4}
            color="#8f8f8f"
            secondaryColor="#d8d8d8"
          />
        </div>
      )}
      {/* edit and submit btn */}
      <div className="w-full flex justify-between items-center px-3 ">
        <Menu autoSelect={false}>
          <MenuButton
            p="1"
            className="grid place-items-center"
            ml="-2"
            borderRadius="full"
            variant="ghost"
            as={Button}
          >
            <BiDotsHorizontalRounded className="text-grey-icon text-2xl" />
          </MenuButton>
          <MenuList className="shadow-elevated " border="none" minWidth="none">
            <MenuItem
              onClick={() => {
                deleteFn(id);
              }}
              pr="16"
              fontWeight="bold"
              _hover={{ bg: "bgGrey" }}
            >
              Delete
            </MenuItem>
            {duplicateFn && (
              <MenuItem
                onClick={() => {
                  duplicateFn(id, {
                    name,
                    ingredients,
                    instructions,
                    categories,
                    servings,
                    image1,
                    image2,
                    destination,
                  });
                }}
                pr="16"
                fontWeight="bold"
                _hover={{ bg: "bgGrey" }}
              >
                Duplicate
              </MenuItem>
            )}
          </MenuList>
        </Menu>
        <Button variant="primary" onClick={() => uploadRecipe()}>
          Upload recipe
        </Button>
      </div>
      {/* missing fields warning */}
      {isMissingFields && (
        <div className="px-3">
          <Alert className="mt-6" borderRadius="lg" status="error">
            <AlertIcon />
            <AlertDescription className="flex-grow font-semibold">
              Please fill in missing fields.
            </AlertDescription>
            <CloseButton onClick={() => setIsMissingFields(false)} />
          </Alert>
        </div>
      )}
      {/* recipe name */}
      <div className="px-3 mt-7">
        <Input
          isInvalid={upload === uploadState.ATTEMPT_UPLOADING && name == ""}
          variant="flushed"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Recipe name"
          className="font-bold"
          fontSize="2xl"
          borderColor="borderGrey"
          _placeholder={{ color: "placeholderGrey" }}
        />
      </div>
      {/* recipe details */}
      <div className="max-h-[800px] overflow-scroll px-3 md:flex md:flex-row-reverse md:gap-8">
        <div className="md:flex-1">
          {/* servings */}
          <div className="mt-8 flex items-center">
            <span className="mr-2 font-bold">Servings: </span>
            <Input
              variant="outline"
              size="sm"
              type="text"
              value={servings}
              onChange={(e) => {
                setServings(e.target.value);
              }}
              borderColor="borderGrey"
              bg="white"
              _hover={{ bg: "white" }}
            />
          </div>
          {/* categories */}
          <div className="mt-7">
            <Categories
              id={id}
              categories={categories}
              setCategories={setCategories}
            />
          </div>
          {/* ingredients and instructions */}
          <div className="sm:flex md:flex-col sm:gap-8 md:gap-4">
            <div className="mt-8 flex-[0.6]">
              <List
                name={`${id}-ingredients`}
                list={ingredients}
                updateList={setIngredients}
                upload={upload}
              />
            </div>
            <div className="mt-8 flex-1">
              <List
                name={`${id}-instructions`}
                list={instructions}
                updateList={setInstructions}
                upload={upload}
              />
            </div>
          </div>
          {/* destination */}
          <div className="mt-10">
            <Input
              variant="flushed"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Add a destination link"
              borderColor="borderGrey"
              _placeholder={{ color: "placeholderGrey" }}
            />
          </div>
        </div>
        {/* img upload */}
        <div className="w-full mt-12 md:mt-8 md:flex-[0.8]">
          {!image1 && !image2 ? (
            <div>
              <Box
                bg="bgGrey"
                borderColor={
                  upload == uploadState.ATTEMPT_UPLOADING ? "error" : "bgGrey"
                }
                borderWidth="2px"
                className="relative rounded-md md:min-h-[380px] md:p-3 md:flex md:flex-col"
              >
                <div className="flex flex-row items-center justify-between px-4 py-4 md:flex-col-reverse md:justify-center md:gap-4 md:border md:border-dashed md:border-gray-400 md:rounded-md md:flex-1">
                  <p className="font-bold">Click to upload</p>
                  <IoIosImages className="text-3xl text-grey-icon" />
                </div>
                <Input
                  type="file"
                  accept={acceptedImgType.join(",")}
                  name="upload-recipe-image"
                  onChange={(e) => {
                    setImage2("");
                    setImage1(e.target.files?.[0]);
                  }}
                  className="cursor-pointer h-full w-full absolute top-0 left-0 opacity-0"
                />
              </Box>
              <p className="mt-3 text-grey-muted text-xs">
                Recommendation: Use high-quality JPG, JPEG, PNG.
              </p>
            </div>
          ) : (
            <div>
              <Box
                border="1px"
                borderColor="borderGrey"
                className="relative p-2 rounded-lg"
              >
                <img
                  src={image2 !== "" ? image2 : URL.createObjectURL(image1)}
                  alt="uploaded-pic"
                  className="h-full w-full object-contain rounded-lg"
                />
                <Button
                  className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full p-1 shadow-2xl"
                  width="40px"
                  height="40px"
                  onClick={() => {
                    setImage1(null);
                    setImage2("");
                  }}
                >
                  <FaTrash />
                </Button>
              </Box>
              {image2 && (
                <p className="mt-3 text-grey-muted text-xs">
                  Note: image from this link might be of low quality. Please
                  consider uploading your own photo.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeBuilder;
