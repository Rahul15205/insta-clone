import { Box, Button, CloseButton, Flex, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, Tooltip, useDisclosure } from "@chakra-ui/react";
import { CreatePostLogo } from "../../assets/constants";
import { BsFillImageFill } from 'react-icons/bs';
import { useState, useRef } from "react";
import usePreviewMedia from "../../hooks/usePreviewMedia";
import useShowToast from "../../hooks/useShowToast";
import useAuthStore from "../../store/authStore";
import usePostStore from "../../store/postStore";
import useUserProfileStore from "../../store/userProfileStore";
import { useLocation } from "react-router-dom";
import { addDoc, arrayUnion, collection, doc, updateDoc } from "firebase/firestore";
import { firestore, storage } from "../../firebase/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const CreatePost = () => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const [caption, setCaption] = useState('');
    const fileRef = useRef(null);
    const { selectedFile, handleMediaChange, setSelectedFile, mediaType } = usePreviewMedia();
    const { isLoading, handleCreatePost } = useCreatePost();
    const showToast = useShowToast();

    const handlePostCreation = async () => {
        try {
            await handleCreatePost(selectedFile, caption, mediaType);
            onClose();
            setCaption("");
            setSelectedFile(null);
        } catch (error) {
            showToast("Error", error.message, "error");
        }
    }

    return (
        <>
            <Tooltip 
                hasArrow
                label={"Create"}
                placement="right"
                m1={1}
                openDelay={500}
                display={{base: 'block', md: 'none'}}
            >
                <Flex
                    alignItems={"center"}
                    gap={4}
                    _hover={{ bg: "whiteAlpha.400" }}
                    borderRadius={6}
                    p={2}
                    w={{ base: 10, md: "full" }}
                    justifyContent={{ base: "center", md: "flex-start" }}
                    onClick={onOpen}
                >
                    <CreatePostLogo />
                    <Box display={{ base: "none", md: "block" }}>
                        Create
                    </Box>
                </Flex>
            </Tooltip>
            <Modal isOpen={isOpen} onClose={onClose} size='xl'>
                <ModalOverlay />
                <ModalContent bg={"black"} border={"1px solid gray"}>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Textarea placeholder="Post caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />
                        <Input type="file" hidden ref={fileRef} onChange={handleMediaChange} accept="image/*,video/*" />
                        <BsFillImageFill style={{ marginTop: "15px", marginLeft: "5px", cursor: "pointer" }} size={16} onClick={() => fileRef.current.click()} />
                        {selectedFile && (
                            <Flex mt={5} w={"full"} position={"relative"} justifyContent={"center"}>
                                {mediaType === 'image' ? (
                                    <Image src={selectedFile} alt='selected img' />
                                ) : (
                                    <video src={selectedFile} controls style={{ maxWidth: "100%" }} />
                                )}
                                <CloseButton 
                                    position={"absolute"}
                                    top={2}
                                    right={2}
                                    onClick={() => {
                                        setSelectedFile(null);
                                    }}
                                />
                            </Flex>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={handlePostCreation} isLoading={isLoading}>Post</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreatePost;

function useCreatePost() {
    const showToast = useShowToast();
    const [isLoading, setIsLoading] = useState(false);
    const authUser = useAuthStore((state) => state.user);
    const createPost = usePostStore(state => state.createPost);
    const addPost = useUserProfileStore(state => state.addPost);
    const userProfile = useUserProfileStore(state => state.userProfile);
    const { pathname } = useLocation();

    const handleCreatePost = async (selectedFile, caption, mediaType) => {
        if (isLoading) return;
        if (!selectedFile) throw new Error('Please select an image or video');
        setIsLoading(true);
        const newPost = {
            caption: caption,
            likes: [],
            comments: [],
            createdAt: Date.now(),
            createdBy: authUser.uid,
            mediaType: mediaType  // Store media type
        }
        try {
            const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
            const userDocRef = doc(firestore, "users", authUser.uid);
            const fileRef = ref(storage, `posts/${postDocRef.id}`);
            await updateDoc(userDocRef, { posts: arrayUnion(postDocRef.id) });

            // Upload file as binary data
            const blob = await fetch(selectedFile).then(res => res.blob());
            await uploadBytes(fileRef, blob);

            const downloadURL = await getDownloadURL(fileRef);
            if (mediaType === 'image') {
                await updateDoc(postDocRef, { imageURL: downloadURL });
            } else if (mediaType === 'video') {
                await updateDoc(postDocRef, { videoURL: downloadURL });
            }

            newPost.fileURL = downloadURL;
            if (userProfile === authUser.uid) createPost({ ...newPost, id: postDocRef.id });
            if (pathname !== "/" && userProfile.uid === authUser.uid) addPost({ ...newPost, id: postDocRef.id });

            showToast("Success", "Post created successfully", "success");
        } catch (error) {
            showToast("Error", error.message, "error");
        } finally {
            setIsLoading(false);
        }
    }

    return { isLoading, handleCreatePost };
}
