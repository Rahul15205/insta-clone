import { Box, Image } from "@chakra-ui/react";
import React from 'react';

import PostHeader from "./PostHeader";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";
import PostFooter from "./PostFooter";

const Feedpost = ({ post }) => {
  const { userProfile } = useGetUserProfileById(post.createdBy);
  

  // Check if userProfile exists and has profilePicURL before rendering
  if (!userProfile || !userProfile.profilePicURL) {
    return null; // or handle the loading state appropriately
  }
  return (
    <>
      <PostHeader post={post} creatorProfile={userProfile} />
      <Box my={2} borderRadius={4} overflow={"hidden"}>
        {post.imageURL  ?  (
          
          <Image src={post.imageURL}  alt='FEED POST IMAGE' />
        ) : (
          <video src={post.videoURL}  controls style={{ maxWidth: "100%" }}/>
        )}
      </Box>
      <PostFooter post={post} creatorProfile={userProfile} />
    </>
  );
};

export default Feedpost;
