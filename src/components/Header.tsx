import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GoogleLoginResponse } from "react-google-login";
import { IoIosAddCircle, IoIosNotifications } from "react-icons/io";
import { login, logout, selectUser } from "../store/features/userSlice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { Search, LoginModal, Avatar } from ".";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { username, image, id } = useAppSelector(selectUser);
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

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

  const handleScroll = () => {
    if (window.pageYOffset > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full  px-4 sm:px-5  bg-white z-[1000] transition-shadow duration-500 ${
        scrolled ? "shadow-sm" : "shadow-none"
      }`}
    >
      <div className="flex h-20 items-center">
        {/* logo */}
        <div
          className="cursor-pointer flex items-center"
          onClick={() => router.push("/")}
        >
          <Image src="/assets/logo.png" width={30} height={30} alt="logo" />
        </div>
        {/* categories */}
        <Button
          variant="ghost"
          border="2px"
          borderColor="white"
          borderRadius="3xl"
          fontWeight="bold"
          fontSize={{
            md: "large",
          }}
          py="5"
          px="4"
          className="ml-4 sm:ml-7"
          _hover={{ bg: "bgGrey", borderColor: "bgGrey" }}
        >
          Categories
        </Button>
        {/* searchbar */}
        <div className="flex-1 mx-4 sm:mx-7">
          <Search />
        </div>
        {/* user space */}
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
                mx="2"
                onClick={() => router.push("/new-recipe")}
              >
                <IoIosAddCircle className="text-[36px] text-grey-icon" />
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
                <MenuList
                  className="shadow-elevated"
                  border="none"
                  minWidth="none"
                >
                  <MenuItem
                    fontWeight="bold"
                    pr="20"
                    _hover={{ bg: "bgGrey" }}
                    onClick={() => router.push(`/${id}`)}
                  >
                    My profile
                  </MenuItem>
                  <MenuItem
                    fontWeight="bold"
                    _hover={{ bg: "bgGrey" }}
                    onClick={handleLogout}
                  >
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
