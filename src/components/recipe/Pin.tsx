import { Button, useToast } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { BiLink } from "react-icons/bi";
import { FiArrowUpRight } from "react-icons/fi";
import { urlFor } from "../../client";
import { selectUser } from "../../store/features/userSlice";
import { useAppSelector } from "../../store/store";
import { RecipeData } from "../../utils/data";
import { copyUrlToClipboard } from "../../utils/helpers";
import SaveRecipe from "./SaveRecipe";

interface PinProps {
  data: RecipeData;
}

const Pin: React.FC<PinProps> = ({ data }) => {
  const { name, _id, byUser, destination, image1, image2, save } = data;
  const [hovered, setHovered] = useState(false);
  const { id: currentUserId } = useAppSelector(selectUser);
  const toast = useToast();
  const router = useRouter();

  return (
    <div className="mx-2 mt-3 mb-8">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className=" relative cursor-zoom-in w-full rounded-lg overflow-hidden bg-grey1"
        onClick={() => router.push(`/recipe/${_id}`)}
      >
        {(image1 || image2) && (
          <img
            className="w-full"
            src={image1 ? urlFor(image1).width(500).url() : image2}
            alt={name}
          />
        )}
        <div
          className={`absolute top-0 left-0 w-full h-full flex flex-col justify-between p-3 z-50 bg-black bg-opacity-30 text-white ${
            hovered ? "opacity-1" : "opacity-0"
          }`}
        >
          <div className="w-full flex justify-between items-center gap-6">
            <div className="flex-1 truncate">
              <Link href={`/${byUser._id}`}>
                <a className="font-bold" onClick={(e) => e.stopPropagation()}>
                  {byUser.userName}
                </a>
              </Link>
            </div>
            <SaveRecipe
              userId={currentUserId}
              recipeId={_id}
              saved={
                save && save.length
                  ? save.filter((savedBy) => savedBy.userId === currentUserId)
                      .length === 1
                  : false
              }
            />
          </div>
          <div className="w-full flex justify-between items-center gap-6">
            <div className="truncate text-sm">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  className="bg-white flex items-center gap-2 text-black font-bold px-2 h-[30px] rounded-full opacity-90 hover:opacity-100"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="w-auto">
                    <FiArrowUpRight className="text-lg" />
                  </span>
                  <span className="truncate">{destination}</span>
                </a>
              )}
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                copyUrlToClipboard(_id);
                toast({
                  title: "Copied to clipboard",
                  status: "success",
                  duration: 1200,
                  isClosable: true,
                });
              }}
              p="0"
              width="30px"
              minWidth="30px"
              height="30px"
              borderRadius="full"
              className="bg-white opacity-90 hover:opacity-100"
            >
              <BiLink />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pin;
