import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import GoogleLogin, { GoogleLoginResponse } from "react-google-login";
import { FcGoogle } from "react-icons/fc";
import { loginAsync } from "../../store/features/userSlice";
import { useAppDispatch } from "../../store/store";

interface LoginModalProps {
  btnProps: Record<string, any>;
  btnText: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ btnProps, btnText }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const handleLogin = (response: any) => {
    const profileObj: GoogleLoginResponse["profileObj"] = response?.profileObj;
    if (profileObj) {
      dispatch(loginAsync(profileObj));
    }
  };

  const handleError = () => {
    toast({
      title: "There was a problem logging you in.",
      status: "error",
      duration: null,
      isClosable: true,
    });
  };

  return (
    <>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        {...btnProps}
      >
        {btnText}
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
              <div className="pb-8">
                <Image
                  src="/assets/logo.png"
                  width={70}
                  height={70}
                  alt="logo"
                />
              </div>
              <GoogleLogin
                clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
                render={(renderProps) => (
                  <Button
                    type="button"
                    variant="outline"
                    borderRadius="3xl"
                    fontSize="lg"
                    pr="6"
                    onClick={(e) => {
                      e.stopPropagation();
                      renderProps.onClick();
                    }}
                    disabled={renderProps.disabled}
                    _active={{
                      transform: "scale(0.96)",
                    }}
                    _hover={{
                      bg: "hoverGrey",
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
