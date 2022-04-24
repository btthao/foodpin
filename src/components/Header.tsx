import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { GoogleLoginResponse } from "react-google-login";
import { BsPlusLg } from "react-icons/bs";
import { IoIosAddCircle } from "react-icons/io";
import { Avatar, LoginModal, Search } from ".";
import { login, logout, selectUser } from "../store/features/userSlice";
import { useAppDispatch, useAppSelector } from "../store/store";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector(selectUser);
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const profileObj: GoogleLoginResponse["profileObj"] | null =
      localStorage.getItem("fp-user") !== "undefined"
        ? JSON.parse(localStorage.getItem("fp-user") as string)
        : null;

    if (profileObj) {
      dispatch(login(profileObj));
    }
  }, []);

  const handleLogout = () => {
    dispatch(logout());
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
    <>
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
            <Image src="/assets/logo.png" width={32} height={32} alt="logo" />
          </div>
          {/* searchbar */}
          <div className="flex-1 mx-4 sm:mx-7">
            <Search />
          </div>
          {/* user space */}
          <div>
            {!currentUser ? (
              <LoginModal
                btnProps={{
                  variant: "dark",
                  borderRadius: "3xl",
                  fontWeight: "bold",
                  py: "5",
                  px: "4",
                  fontSize: {
                    md: "large",
                  },
                }}
                btnText="Login"
              />
            ) : (
              <div className="flex items-center">
                {!router.pathname.includes("new-recipe") && (
                  <Button
                    p="0"
                    width="48px"
                    height="48px"
                    borderRadius="full"
                    variant="ghost"
                    mr="2"
                    className="hidden sm:flex"
                    onClick={() => router.push("/new-recipe")}
                  >
                    <IoIosAddCircle className="text-[38px] text-grey-icon" />
                  </Button>
                )}
                <Menu autoSelect={false}>
                  <MenuButton
                    p="0"
                    width="48px"
                    height="48px"
                    borderRadius="full"
                    variant="ghost"
                    as={Button}
                  >
                    <Avatar
                      name={currentUser.userName}
                      src={currentUser.image}
                    />
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
                      onClick={() => router.push(`/${currentUser._id}`)}
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
      {currentUser && !router.pathname.includes("new-recipe") && (
        <div className="sm:hidden fixed bottom-8 right-5 z-[1000] ">
          <button
            className="bg-white hover:bg-grey1 border-white shadow-elevated border-4 p-3 rounded-full "
            onClick={() => router.push("/new-recipe")}
          >
            <BsPlusLg className="text-2xl" />
          </button>
        </div>
      )}
    </>
  );
};

export default Header;
