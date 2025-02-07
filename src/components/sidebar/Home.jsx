import { Box, Link, Tooltip } from '@chakra-ui/react';
import {Link as RouterLink} from 'react-router-dom';
import { animateScroll as scroller } from 'react-scroll';
import  { AiFillHome } from 'react-icons/ai';

const Home = () => {
    const scrollToSidebar = () => {
        scroller.scrollTo('sidebar', {
          duration: 800,
          delay: 0,
          smooth: 'easeInOutQuart'
        });
    };
  return (
    <Tooltip 
        hasArrow
        label = {"Home"}
        placement = "right"
        m1 = {1}
        openDelay = {500}
        display={{base:'block',md:'none'}}
    >
        <Link
            display={"flex"}
            to ={"/"}
            as={RouterLink}
            alignItems={"center"}
            gap={4}
            _hover={{bg:"whiteAlpha.400"}}
            borderRadius={6}
            p={2}
            w={{base: 10, md: "full"}}
            justifyContent={{base: "center", md: "flex-start"}}
        >
            <AiFillHome size = {25} onClick={scrollToSidebar}/>
            <Box display={{base:"none", md:"block"}} onClick={scrollToSidebar}>
                Home
            </Box>
        </Link>
              
    </Tooltip>
  );
};

export default Home
