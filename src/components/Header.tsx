import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { GoogleLoginResponse } from "react-google-login";
import { IoIosAddCircle, IoIosNotifications } from "react-icons/io";
import { login, logout, selectUser } from "../store/features/userSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import Avatar from "./Avatar";
import LoginModal from "./LoginModal";
import Search from "./Search";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { username, image, id } = useAppSelector(selectUser);
  const router = useRouter();

  // check if user already exists in local storage
  useEffect(() => {
    const loggedInUser: GoogleLoginResponse["profileObj"] | null =
      localStorage.getItem("fp-user") !== "undefined"
        ? JSON.parse(localStorage.getItem("fp-user") as string)
        : null;

    if (loggedInUser) {
      dispatch(
        login({
          username: loggedInUser.name,
          image: loggedInUser.imageUrl,
          id: loggedInUser.googleId,
        })
      );
    } else {
      router.push("/");
    }
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("fp-user");
    router.push("/");
  };

  return (
    <header className="shadow-md px-4 sm:px-5 py-3 sm:py-4 bg-white">
      <div className="flex justify-between items-center">
        <div className="cursor-pointer" onClick={() => router.push("/")}>
          <Text
            color="primary"
            className="hidden sm:block text-2xl sm:text-3xl font-extrabold"
          >
            FoodPin
          </Text>
          <Text
            color="primary"
            className="block sm:hidden text-2xl sm:text-3xl font-extrabold"
          >
            F
          </Text>
        </div>
        <div className="  flex-1 mx-4 sm:mx-7">
          <Search />
        </div>
        <div>
          {!username ? (
            <LoginModal />
          ) : (
            <div className="flex items-center">
              <Button
                p="0"
                width="44px"
                height="44px"
                borderRadius="full"
                variant="ghost"
              >
                <IoIosNotifications className="text-3xl text-gray-500" />
              </Button>
              <Button
                p="0"
                width="44px"
                height="44px"
                borderRadius="full"
                variant="ghost"
                mx="2"
                onClick={() => router.push("/new-recipe")}
              >
                <IoIosAddCircle className="text-3xl text-gray-500" />
              </Button>

              <Menu autoSelect={false}>
                <MenuButton
                  p="0"
                  width="44px"
                  height="44px"
                  borderRadius="full"
                  variant="ghost"
                  as={Button}
                >
                  <Avatar name={username} src={image} />
                </MenuButton>
                <MenuList className="shadow-elevated" border="none">
                  <MenuItem
                    _hover={{ bg: "bgGrey" }}
                    onClick={() => router.push(`/${id}`)}
                  >
                    My profile
                  </MenuItem>
                  <MenuItem _hover={{ bg: "bgGrey" }} onClick={handleLogout}>
                    Log out
                  </MenuItem>
                </MenuList>
              </Menu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
