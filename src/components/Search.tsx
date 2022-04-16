import {
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { client } from "../client";
import { selectFeed, setFeedData } from "../store/features/feedSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { feedQuery, searchFeedQuery } from "../utils/data";
interface SearchProps {}

const Search: React.FC<SearchProps> = ({}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { mainFeed } = useAppSelector(selectFeed);
  const searchInput = useRef<any>(null);
  const toast = useToast();

  const searchRecipes = () => {
    router.push({
      pathname: "/search",
      query: {
        q: searchQuery,
      },
    });

    if (!searchQuery) {
      if (mainFeed.length) {
        dispatch(setFeedData({ type: "search", data: mainFeed }));
      } else {
        client.fetch(feedQuery).then((data) => {
          dispatch(setFeedData({ type: "main", data }));
          dispatch(setFeedData({ type: "search", data }));
          toast.closeAll();
          console.log(data.length);
        });
      }
    } else {
      client.fetch(searchFeedQuery(searchQuery.toLowerCase())).then((data) => {
        dispatch(setFeedData({ type: "search", data }));
        console.log(data.length);

        if (!data.length) {
          if (!toast.isActive("no-result")) {
            toast({
              id: "no-result",
              title: "No results",
              status: "error",
              variant: "subtle",
              duration: null,
              isClosable: false,
            });
          }
        } else {
          toast.closeAll();
        }
      });
    }
  };

  useEffect(() => {
    // fetch when search input is focused
    if (document.activeElement === searchInput.current) {
      searchRecipes();
    }
  }, [searchQuery]);

  useEffect(() => {
    const path = router.asPath;
    if (path.includes("/search")) {
      setSearchQuery(
        path.indexOf("q=") > -1 ? path.slice(path.indexOf("q=") + 2) : ""
      );
      setTimeout(() => {
        searchInput.current.focus();
      }, 100);
    }
  }, []);

  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
        height="100%"
        children={<AiOutlineSearch className="text-xl text-gray-500" />}
      />
      <Input
        autoFocus={false}
        variant="filled"
        type="text"
        placeholder="Search"
        borderRadius="3xl"
        py="5"
        bg="bgGrey"
        _hover={{ bg: "hoverGrey" }}
        _focus={{
          bg: "white",
          borderWidth: "4px",
          borderColor: "#87ce7e",
          boxShadow: "md",
        }}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        onFocus={() => searchRecipes()}
        ref={searchInput}
      />
    </InputGroup>
  );
};

export default Search;
