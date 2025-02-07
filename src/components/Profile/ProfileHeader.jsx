import React, { useState} from 'react';
import { Avatar, AvatarGroup, Button, Flex, Text, VStack, useDisclosure } from "@chakra-ui/react";
import useUserProfileStore from "../../store/userProfileStore";
import useAuthStore from "../../store/authStore";
import EditProfile from "./EditProfile";
import FollowersModal from "../Modals/FollowersModal";
import useFollowUser from "../../hooks/useFollowUser";
import { fetchUsersDetails } from "../../hooks/fetchFollowerDetail";

const ProfileHeader = () => {
  const { userProfile, setUserProfile } = useUserProfileStore();
  const authUser = useAuthStore(state => state.user);
  const { isOpen: isEditProfileOpen, onOpen: onEditProfileOpen, onClose: onEditProfileClose } = useDisclosure();
  const { isOpen: isFollowersModalOpen, onOpen: onFollowersModalOpen, onClose: onFollowersModalClose } = useDisclosure();
  const { isFollowing, isUpdating, handleFollowUser } = useFollowUser(userProfile?.uid);
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsers, setModalUsers] = useState([]);

  const visitingOwnProfileAndAuth = authUser && authUser.username === userProfile.username;
  const visitingAnotherProfileAndAuth = authUser && authUser.username !== userProfile.username;


  const handleOpenFollowersModal = async (title, userIds) => {
    console.log("Opening Modal with users:", userIds);
    const users = await fetchUsersDetails(userIds);
    console.log("Fetched Users:", users);
    setModalTitle(title);
    setModalUsers(users);
    onFollowersModalOpen();
  };

  const handleFollowChange = () => {
    setUserProfile({
      ...userProfile,
      followers: userProfile.followers.filter(uid => uid !== authUser.uid),
    });
  };

  return (
    <Flex gap={{ base: 4, sm: 10 }} py={10} direction={{ base: "column", sm: "row" }}>
      <AvatarGroup size={{ base: "xl", md: "2xl" }} justifySelf={"center"} alignSelf={"flex-start"} mx={"auto"}>
        <Avatar src={userProfile.profilePicURL} alt='Profile picture' />
      </AvatarGroup>

      <VStack alignItems={"start"} gap={2} mx={"auto"} flex={1}>
        <Flex 
          gap={4}
          direction={{ base: "column", sm: "row" }} 
          justifyContent={{ base: "center", sm: "flex-start" }} 
          alignItems={"center"} 
          w={"full"}>
          <Text fontSize={{ base: "sm", md: "lg" }}>
            {userProfile.username}
          </Text>

          {visitingOwnProfileAndAuth && (
            <Flex gap={4} alignItems={"center"} justifyContent={"center"}>
              <Button 
                bg={"white"} 
                color={"black"} 
                _hover={{ bg: "whiteAlpha.800" }} 
                size={{ base: "xs", md: "sm" }} 
                onClick={onEditProfileOpen}>
                Edit Profile
              </Button>
            </Flex>
          )}
          {visitingAnotherProfileAndAuth && (
            <Flex gap={4} alignItems={"center"} justifyContent={"center"}>
              <Button 
                bg={"blue.500"} 
                color={"white"} 
                _hover={{ bg: "blue.600" }} 
                size={{ base: "xs", md: "sm" }} 
                onClick={handleFollowUser} 
                isLoading={isUpdating}>
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            </Flex>
          )}
        </Flex>

        <Flex alignItems={"center"} gap={{ base: 2, sm: 4 }}>
          <Text fontSize={{ base: "xs", md: "sm" }} >
            <Text as="span" fontWeight={"bold"} mr={1}>{userProfile.posts.length}</Text>
            Posts
          </Text>
          <Text fontSize={{ base: "xs", md: "sm" }} onClick={() => handleOpenFollowersModal('Followers', userProfile.followers)} cursor={"pointer"}>
            <Text as="span" fontWeight={"bold"} mr={1}  cursor={"pointer"}>{userProfile.followers.length}</Text>
            Followers
          </Text>
          <Text fontSize={{ base: "xs", md: "sm" }} onClick={() => handleOpenFollowersModal('Following', userProfile.following)} cursor={"pointer"}>
            <Text as="span" fontWeight={"bold"} mr={1} cursor={"pointer"}>{userProfile.following.length}</Text>
            Following
          </Text>
        </Flex>

        <Flex alignItems={"center"} gap={4}> 
          <Text fontSize={"sm"} fontWeight={"bold"}>{userProfile.fullName}</Text>
        </Flex>
        
        <Text fontSize={"sm"}>{userProfile.bio}</Text>
      </VStack>
      {isEditProfileOpen && <EditProfile isOpen={isEditProfileOpen} onClose={onEditProfileClose} />}
      {isFollowersModalOpen && <FollowersModal isOpen={isFollowersModalOpen} onClose={onFollowersModalClose} title={modalTitle} users={modalUsers} onFollowChange={handleFollowChange} />}
    </Flex>
  );
};

export default ProfileHeader;
