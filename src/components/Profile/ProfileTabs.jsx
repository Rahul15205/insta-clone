import { Box, Flex, Text } from "@chakra-ui/react";
import {BsGrid3X3, BsBookmark, BsSuitHeart} from "react-icons/bs";
const ProfileTabs = () => {
  return (
    <Flex
      w={"full"}
      justifyContent={"center"}
      gap={{base:4,sm:10}}
      textTransform={"uppercase"}
      fontWeight={"bold"}
    >
      <Flex borderTop={"1px solid white"} alignItems={"Center"} p="3" gap={1} cursor={"pointer"}>
        <Box fontSize={20}>
          <BsGrid3X3 />
        </Box>
        <Text fontSize={12} display={{base:"none",sm:"block"}}>Posts</Text>
      </Flex>
      <Flex alignItems={"Center"} p="3" gap={1} cursor={"pointer"}>
        <Box fontSize={20}>
          <BsBookmark />
        </Box>
        <Text fontSize={12} display={{base:"none",sm:"block"}}>Saved</Text>
      </Flex>
      <Flex alignItems={"Center"} p="3" gap={1} cursor={"pointer"}>
        <Box fontSize={20}>
          <BsSuitHeart fontWeight={"bold"} />
        </Box>
        <Text fontSize={12} display={{base:"none",sm:"block"}}>Likes</Text>
      </Flex>
    </Flex>
  )
}

export default ProfileTabs
