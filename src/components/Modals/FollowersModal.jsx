import { Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React from 'react';
import FollowerItem from './FollowerItem';

const FollowersModal = ({ isOpen, onClose, title, users }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset='slideInLeft'>
      <ModalOverlay />
      <ModalContent bg={"black"} border={"1px solid gray"} maxW={"400px"}>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Flex mb={4} gap={4} flexDir={"column"} maxH={"250px"} overflowY={"auto"}>
            {users.map((user) => (
              <FollowerItem user={user} key={user.id}  />
            ))}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FollowersModal;
