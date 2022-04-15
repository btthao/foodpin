import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import GoogleLogin, { GoogleLoginResponse } from "react-google-login";
import { FcGoogle } from "react-icons/fc";
import { client } from "../../client";
import { login } from "../../store/features/userSlice";
import { useAppDispatch } from "../../store/store";

const LoginModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useAppDispatch();

  const handleLogin = (response: any) => {
    const profileObj: GoogleLoginResponse["profileObj"] = response?.profileObj;

    if (profileObj) {
      console.log(profileObj);
      const { name, imageUrl, googleId } = profileObj;
      const doc = {
        _id: googleId,
        _type: "user",
        userName: name,
        image: imageUrl,
      };
      localStorage.setItem("fp-user", JSON.stringify(profileObj));
      client.createIfNotExists(doc);
      dispatch(login({ username: name, image: imageUrl, id: googleId }));
    }
  };

  const handleError = () => {};

  return (
    <>
      <Button
        onClick={onOpen}
        variant="dark"
        borderRadius="3xl"
        fontWeight="bold"
        fontSize={{
          md: "large",
        }}
        py="5"
        px="4"
      >
        Login
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} autoFocus={false}>
        <ModalOverlay />
        <ModalContent className="py-8 text-center">
          <ModalHeader fontWeight="bold" fontSize="3xl">
            Welcome to FoodPin
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex  justify-center flex-col items-center">
              <div className="pb-8">logoo</div>
              <GoogleLogin
                clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
                render={(renderProps) => (
                  <Button
                    type="button"
                    variant="outline"
                    borderRadius="3xl"
                    fontSize="lg"
                    pr="6"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    _active={{
                      transform: "scale(0.96)",
                    }}
                  >
                    <FcGoogle className="mr-4" /> Continue with google
                  </Button>
                )}
                onSuccess={handleLogin}
                onFailure={handleError}
                cookiePolicy="single_host_origin"
              />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoginModal;
