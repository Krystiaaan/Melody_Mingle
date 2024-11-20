import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

function ChangeProfileImgModal({ isOpen, onCloseSave, onClose, onChangeImgFile }: { isOpen: boolean, onCloseSave: () => void, onChangeImgFile: (event: React.ChangeEvent<HTMLInputElement>) => void, onClose: () => void }) {

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="mingle.purple">
          <ModalHeader color="mingle.lightPurple">Select an Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody bg="mingle.lightPurple">
            <Input type="file" onChange={onChangeImgFile} bg="mingle.darkPurple" color="mingle.lightPurple"/>
          </ModalBody>

          <ModalFooter>
            <Button bg="mingle.lightPurple" mr={3} onClick={onCloseSave}>
              Save
            </Button>
            <Button bg="mingle.darkPurple" color="mingle.lightPurple" _hover={{ bg: "mingle.specialPurple" }} onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ChangeProfileImgModal;
