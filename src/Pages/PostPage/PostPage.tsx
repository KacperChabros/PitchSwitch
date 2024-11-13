import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../Context/useAuth';
import ErrorHandler from '../../Helpers/ErrorHandler';
import { MinimalTransferDto } from '../../Dtos/TransferDto';
import { MinimalTransferRumourDto } from '../../Dtos/TransferRumourDto';
import { deletePostAPI, getPostByIdAPI, updatePostAPI } from '../../Services/PostService';
import { PostDto, UpdatePostDto } from '../../Dtos/PostDto';
import { getAllMinimalTransfersAPI } from '../../Services/TransferService';
import { toast } from 'react-toastify';
import { getAllMinimalTransferRumoursAPI } from '../../Services/TransferRumourService';
import { AddButton, DeleteButton, UpdateButton } from '../../Components/Buttons/Buttons';
import CommentCard from '../../Components/CommentCard/CommentCard';
import Tile from '../../Components/Tile/Tile';
import Modal from '../../Components/Modal/Modal';
import GenericForm, { FormField } from '../../Components/GenericForm/GenericForm';
import * as Yup from "yup";
import { AddCommentDto, MinimalCommentDto, UpdateCommentDto } from '../../Dtos/Comment';
import { addCommentAPI, deleteCommentAPI, updateCommentAPI } from '../../Services/CommentService';

type Props = {}

const addCommentFields: FormField[] = [
    {
        name: "content",
        label: "Content",
        initialValue: "",
        type: "textarea",
        validationSchema: Yup.string()
            .required("Content is required")
            .min(3, "Content must be at least 3 characters")
            .max(300, "Content can't be more than 300 characters"),
    }
]
const createUpdateCommentFields = (content: string | undefined) => {
    const updateCommentFields: FormField[] = [
        {
            name: "content",
            label: "Content",
            initialValue: content || "",
            type: "textarea",
            validationSchema: Yup.string()
                .required("Content is required")
                .min(3, "Content must be at least 3 characters")
                .max(300, "Content can't be more than 300 characters"),
        }
    ];
    return updateCommentFields
}


const PostPage = (props: Props) => {
    const { postId } = useParams();
    const { logoutUser, IsAdmin, IsJournalist, user} = useAuth();
    const [post, setPost] = useState<PostDto | null>(null);
    const [transfers, setTransfers] = useState<MinimalTransferDto[]>([]);
    const [transferRumours, setTransferRumours] = useState<MinimalTransferRumourDto[]>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalContentType, setModalContentType] = useState<'update' | 'addComment' | 'updateComment' | null>(null);
    const [selectedComment, setSelectedComment] = useState<MinimalCommentDto | null>(null);
    const errorHandler = new ErrorHandler(logoutUser);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                const response = await getPostByIdAPI(Number(postId));
                setPost(response.data);            
            } catch (e: any) {
                errorHandler.handle(e);
                console.log(e);
                setPost(null);
            }finally{
                setIsLoaded(true);
            }
        };
        const fetchTransfers = async () =>{
            if(IsAdmin() || (IsJournalist() && user?.userId === post?.createdByUser.userId)){
                try{
                    const response = await getAllMinimalTransfersAPI();
                    setTransfers(response.data);
                }catch(e: any){
                    errorHandler.handle(e);
                    console.log(e);
                    setTransfers([]);
                }
            }
        };

        const fetchTransferRumours = async () =>{
            if(IsAdmin()){
                try{
                    const response = await getAllMinimalTransferRumoursAPI();
                    setTransferRumours(response.data);
                }catch(e: any){
                    errorHandler.handle(e);
                    console.log(e);
                    setTransferRumours([]);
                }
            }
        };

        if (postId) {
            fetchPlayerData();
            if(IsAdmin() || (IsJournalist() && user?.userId === post?.createdByUser.userId)){
                fetchTransfers();
                fetchTransferRumours();
            }
        }
    }, [postId]);  

    const handleDelete = async () => {
        if(postId){
            try{
                await deletePostAPI(Number(postId));
                toast.success("Post has been deleted!");
                navigate('/home');
            }catch(e: any){
                errorHandler.handle(e);
            }         
        }
      };

    const handleUpdate = () => {
        setModalContentType("update");
        setIsModalOpen(true);
    };

    const handleAddComment = () => {
        setModalContentType("addComment");
        setIsModalOpen(true);
    };

    const handleUpdateComment = (commentId: number) => {
        const commentToUpdate = post?.comments.find(comment => comment.commentId === commentId);
        if (commentToUpdate) {
          setSelectedComment(commentToUpdate);
          setModalContentType('updateComment');
          setIsModalOpen(true);
        }
      };

    const handleDeleteComment = async (commentId: number) => {
        if(commentId){
            try {
                await deleteCommentAPI(commentId);
    
                setPost((prevPost) => ({
                    ...prevPost!,
                    comments: prevPost!.comments.filter((comment) => comment.commentId !== commentId),
                }));
    
                toast.success("Comment has been deleted!");
            } catch (e: any) {
                errorHandler.handle(e);
            }
        }
    }

    const handleUpdateSubmit = async (updatedFields: { [key: string]: string | number | File | null | boolean | Date }) => {
        if (post) {
            const updatePostDto: UpdatePostDto = {
              title: updatedFields.title as string,
              content: updatedFields.content as string,
              image: updatedFields.image as File,
              isImageDeleted: updatedFields.isImageDeleted as boolean,
              transferId: updatedFields.transferId !== '' ? updatedFields.transferId as number : null,
              isTransferDeleted: updatedFields.transferId === '' ? true : false,
              transferRumourId: updatedFields.transferRumourId !== '' ? updatedFields.transferRumourId as number : null,
              isTransferRumourDeleted: updatedFields.transferRumourId === '' ? true : false,
          };
            try{
                const response = await updatePostAPI(Number(postId), updatePostDto);
                toast.success("Post has been updated!");
                setPost(response.data);
            }catch(e: any){
              errorHandler.handle(e);
            }finally{
              setModalContentType(null);
              setIsModalOpen(false);
            }      
        }
    };

    const handleAddCommentSubmit = async (updatedFields: { [key: string]: string | number | File | null | boolean | Date }) => {
        if (post) {
            const addCommentDto: AddCommentDto = {
              content: updatedFields.content as string,
              postId: post.postId
          };
            try{
                const response = await addCommentAPI(addCommentDto);
                toast.success("Comment has been added!");
                post.comments.push(response.data)
            }catch(e: any){
              errorHandler.handle(e);
            }finally{
              setModalContentType(null);
              setIsModalOpen(false);
            }      
        }
    };

    const handleUpdateCommentSubmit = async (updatedFields: { [key: string]: string | number | File | null | boolean | Date }) => {
        if (post && selectedComment) {
            const updateCommentDto: UpdateCommentDto = {
                content: updatedFields.content as string,
            };
    
            try {
                const response = await updateCommentAPI(Number(selectedComment?.commentId), updateCommentDto);
                toast.success("Comment has been updated!");
                
                const updatedComments = post.comments.map((comment) =>
                    comment.commentId === selectedComment.commentId ? { ...comment, content: String(updatedFields.content), isEdited: true } : comment
                );
                setPost((prevPost) => ({ 
                    ...prevPost!,
                    comments: updatedComments 
                }));
            } catch (e: any) {
                errorHandler.handle(e);
            } finally {
                setModalContentType(null);
                setIsModalOpen(false);
            }
        }
    };

    if(!post){
        if (isLoaded){
            return <p className="text-lg font-medium text-gray-500 mt-5 text-center italic">
            There is no such post!
            </p>
        }else{
            return <p className="text-lg font-medium text-gray-500 mt-5 text-center italic">
                Loading...
            </p>
        }    
    }

    const postFields: FormField[] = [
        {
            name: "title",
            label: "Title",
            initialValue: post.title || "",
            type: "text",
            validationSchema: Yup.string()
                .required("Title is required")
                .min(3, "Title must be at least 3 characters")
                .max(100, "Title can't be more than 100 characters"),
        },
        {
            name: "content",
            label: "Content",
            initialValue: post.content || "",
            type: "textarea",
            validationSchema: Yup.string()
                .required("Content is required")
                .min(5, "Content must be at least 5 characters")
                .max(500, "Content can't be more than 5000characters"),
        },
        {
            name: "image",
            label: "Image",
            initialValue: null,
            type: "file",
        },
        {
            name: "isImageDeleted",
            label: "Delete current image",
            initialValue: false,
            type: "checkbox",
            validationSchema: Yup.boolean(),
        },
        {
            name: "transferId",
            label: "Associated Transfer",
            initialValue: post.transfer?.transferId || null,
            type: "select",
            validationSchema: Yup.number().nullable(),
            options: [
                { label: "None", value: "" },
                ...transfers.map((transfer) => ({
                    label: `${transfer.player.firstName.slice(0,1)}. ${transfer.player.lastName}, ${transfer.buyingClub ? transfer.buyingClub.shortName : "FA"} -> ${transfer.sellingClub ? transfer.sellingClub.shortName : "FA"}`,
                    value: transfer.transferId,
                })),
            ],
        },
        {
            name: "transferRumourId",
            label: "Associated Transfer Rumour",
            initialValue: post.transferRumour?.transferRumourId || null,
            type: "select",
            validationSchema: Yup.number().nullable(),
            options: [
                { label: "None", value: "" },
                ...transferRumours.map((transferRumour) => ({
                    label: `${transferRumour.player.firstName.slice(0,1)}. ${transferRumour.player.lastName}, ${transferRumour.buyingClub ? transferRumour.buyingClub.shortName : "FA"} -> ${transferRumour.sellingClub ? transferRumour.sellingClub.shortName : "FA"}`,
                    value: transferRumour.transferRumourId,
                })),
            ],
        },
    ];



    return (
        <div className="flex flex-col items-center px-4 sm:px-8 lg:px-16">
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
                <div className="flex justify-center">
                    <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                        <Tile 
                            title="Type" 
                            subTitle={post.transfer ? "Transfer Post" : (post.transferRumour ? "Rumour Post" : "Standard")}
                            href={post.transfer ? `/transfer/${post.transfer.transferId}` : (post.transferRumour ? `/transferrumour/${post.transferRumour.transferRumourId}` : undefined)}
                        />
                    </div>
                </div>
                {post.transfer ? (
                    <>
                        <div className="flex justify-center">
                            <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                                <Tile 
                                    title="Player" 
                                    subTitle={`${post.transfer.player.firstName} ${post.transfer.player.lastName}` } 
                                    imageUrl={post.transfer.player.photoUrl ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${post.transfer.player.photoUrl}` 
                                    : "/images/default_player_photo.png" }
                                    href={`/player/${post.transfer.player.playerId}`}
                                />
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                                <Tile 
                                    title="Selling Club" 
                                    subTitle={post.transfer.sellingClub ? post.transfer.sellingClub.name : 'Free agent'} 
                                    imageUrl={post.transfer.sellingClub && post.transfer.sellingClub.logoUrl ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${post.transfer.sellingClub.logoUrl}` 
                                    : "/images/default_club_logo.png" }
                                    href={post.transfer.sellingClub ? `/club/${post.transfer.sellingClub.clubId}` : undefined}
                                />
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                                <Tile 
                                    title="Buying Club" 
                                    subTitle={post.transfer.buyingClub ? post.transfer.buyingClub.name : 'Free agent'} 
                                    imageUrl={post.transfer.buyingClub && post.transfer.buyingClub.logoUrl ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${post.transfer.buyingClub.logoUrl}` 
                                    : "/images/default_club_logo.png" }
                                    href={post.transfer.buyingClub ? `/club/${post.transfer.buyingClub.clubId}` : undefined}
                                />
                            </div>
                        </div>
                    </>
                ) : (post.transferRumour ? ( 
                    <>
                        <div className="flex justify-center">
                            <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                                <Tile 
                                    title="Player" 
                                    subTitle={`${post.transferRumour.player.firstName} ${post.transferRumour.player.lastName}` } 
                                    imageUrl={post.transferRumour.player.photoUrl ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${post.transferRumour.player.photoUrl}` 
                                    : "/images/default_player_photo.png" }
                                    href={`/player/${post.transferRumour.player.playerId}`}
                                />
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                                <Tile 
                                    title="Selling Club" 
                                    subTitle={post.transferRumour.sellingClub ? post.transferRumour.sellingClub.name : 'Free agent'} 
                                    imageUrl={post.transferRumour.sellingClub && post.transferRumour.sellingClub.logoUrl ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${post.transferRumour.sellingClub.logoUrl}` 
                                    : "/images/default_club_logo.png" }
                                    href={post.transferRumour.sellingClub ? `/club/${post.transferRumour.sellingClub.clubId}` : undefined}
                                />
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                                <Tile 
                                    title="Buying Club" 
                                    subTitle={post.transferRumour.buyingClub ? post.transferRumour.buyingClub.name : 'Free agent'} 
                                    imageUrl={post.transferRumour.buyingClub && post.transferRumour.buyingClub.logoUrl ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${post.transferRumour.buyingClub.logoUrl}` 
                                    : "/images/default_club_logo.png" }
                                    href={post.transferRumour.buyingClub ? `/club/${post.transferRumour.buyingClub.clubId}` : undefined}
                                />
                            </div>
                        </div>
                    </>)

                    : (<></>))}
                    <div className="flex justify-center">
                        <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                            <Tile 
                                title="Post Created By" 
                                subTitle={post.createdByUser.userName} 
                                imageUrl={post.createdByUser.profilePictureUrl ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${post.createdByUser.profilePictureUrl}` 
                                : "/images/default_user_picture.png" }
                                href={`/user/${post.createdByUser.userId}`}
                            />
                        </div>
                    </div>
            </div>
    
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                {post.imageUrl && (
                    <img
                        src={`${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${post.imageUrl}`}
                        alt={post.title}
                        className="w-full h-64 object-cover sm:h-80 md:h-96"
                    />
                )}
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.title}</h1>
                    <p className="text-gray-700 text-base mb-6">{post.content}</p>
                    <div className="text-sm text-gray-500 mb-4">
                        Posted by {post.createdByUser.userName} on {new Date(post.createdOn).toLocaleDateString()}
                        {post.isEdited && <span className="italic text-gray-400"> (edited)</span>}
                    </div>
                    {IsAdmin() || (IsJournalist() && post.createdByUser.userId === user?.userId) ? 
                        <div className="flex space-x-4">
                            <UpdateButton onClick={handleUpdate} label="Update" />
                            <DeleteButton onClick={handleDelete} label="Delete" />
                        </div>
                    : null}
                    
                </div>
            </div>
    
            <div className="w-full max-w-3xl bg-gray-50 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h2>
                {post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                        <CommentCard 
                        key={comment.commentId}
                        comment={comment}
                        canUpdateAndDelete={IsAdmin() || (IsJournalist() && user?.userId === post.createdByUser.userId) || user?.userId === comment.createdByUser.userId}
                        updateButton={
                            <UpdateButton onClick={() => handleUpdateComment(comment.commentId)} label="Update" />
                        }
                        deleteButton={
                            <DeleteButton onClick={() => handleDeleteComment(comment.commentId)} label="Delete" />
                        }
                        />
                    ))
                    ) : (
                    <p>No comments yet.</p>
                    )}
                <div className="mt-4 flex justify-end">
                    <AddButton onClick={handleAddComment} label="Add Comment" />
                </div>
            </div>
    
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {modalContentType === 'update' ? (
                    <GenericForm fields={postFields} onSubmit={handleUpdateSubmit} />
                ) : modalContentType === 'addComment' ? (
                    <GenericForm fields={addCommentFields} onSubmit={handleAddCommentSubmit} />
                ) : modalContentType === "updateComment" ? (
                    <GenericForm fields={createUpdateCommentFields(selectedComment?.content)} onSubmit={handleUpdateCommentSubmit} />
                ) : null}
            </Modal>
        </div>
    );
    
}

export default PostPage

