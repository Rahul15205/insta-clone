import React from 'react'
import { NotificationsLogo } from '../../assets/constants'
import { Box, Flex, Tooltip } from '@chakra-ui/react'

const Notification = () => {
  return (
    <Tooltip 
        hasArrow
        label = {"Notifications"}
        placement = "right"
        m1 = {1}
        openDelay = {500}
        display={{base:'block',md:'none'}}
    >
        <Flex
            alignItems={"center"}
            gap={4}
            _hover={{bg:"whiteAlpha.400"}}
            borderRadius={6}
            p={2}
            w={{base: 10, md: "full"}}
            justifyContent={{base: "center", md: "flex-start"}}
        >
            <NotificationsLogo size = {25} />
            <Box display={{base:"none", md:"block"}}>
                Notifications
            </Box>
        </Flex>
              
    </Tooltip>
  );
};

export default Notification
