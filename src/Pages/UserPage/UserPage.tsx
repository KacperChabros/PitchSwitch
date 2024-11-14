import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../Context/useAuth';
import ErrorHandler from '../../Helpers/ErrorHandler';
import { MinimalClubDto } from '../../Dtos/ClubDto';
import { deleteUserAPI, getUserByNameAPI, updateUserAPI } from '../../Services/AuthService';
import { GetUserDto, UpdateUserDto } from '../../Dtos/UserDto';
import { getAllMinimalClubsAPI } from '../../Services/ClubService';
import ProfileCard from '../../Components/ProfileCard/ProfileCard';
import { DeleteButton, UpdateButton } from '../../Components/Buttons/Buttons';
import { toast } from 'react-toastify';
import Tile from '../../Components/Tile/Tile';
import Modal from '../../Components/Modal/Modal';
import GenericForm, { FormField } from '../../Components/GenericForm/GenericForm';
import * as Yup from "yup";
import PostCard from '../../Components/PostCard/PostCard';
import Divider from '../../Components/Divider/Divider';
import { MdOutlinePostAdd } from "react-icons/md";
import { BsChatRightQuoteFill } from "react-icons/bs";

type Props = {}

const UserPage = (props: Props) => {
    const { userName } = useParams();
    const { logoutUser, IsAdmin, user} = useAuth();
    const [displayedUser, setDisplayedUser] = useState<GetUserDto | null>(null);
    const [minClubs, setMinClubs] = useState<MinimalClubDto[] | []>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [postsPerPage, setPostsPerPage] = useState<number>(5);
    const errorHandler = new ErrorHandler(logoutUser);
    const navigate = useNavigate();

    useEffect(() => {
        if(userName){
            const fetchUserData = async () => {
                try {
                    const response = await getUserByNameAPI(userName);
                    setDisplayedUser(response.data);            
                } catch (e: any) {
                    errorHandler.handle(e);
                    setDisplayedUser(null);
                }finally{
                    setIsLoaded(true);
                }
            };
            const fetchMinClubs = async () =>{
                    try{
                        const response = await getAllMinimalClubsAPI();
                        setMinClubs(response.data);
                    }catch(e: any){
                        errorHandler.handle(e);
                        console.log(e);
                        setMinClubs([]);
                    }
            };
    
            if (userName) {
                fetchUserData();
                if(userName === user?.userName){
                    fetchMinClubs();
                }
            }
        }
        
    }, [userName]);  

    const handleDelete = async () => {
        if(userName){
            try{
                await deleteUserAPI();
                toast.success("User has been deleted!");
                logoutUser();
            }catch(e: any){
                errorHandler.handle(e);
            }         
        }
      };

    const handleUpdate = () => {
        setIsUpdateModalOpen(true);
    };

    const handleUpdateSubmit = async (updatedFields: { [key: string]: string | number | File | null | boolean | Date }) => {
        if (displayedUser && user) {
            const updateUserDto: UpdateUserDto = {
              firstName: updatedFields.firstName as string,
              lastName: updatedFields.lastName as string,
              email: updatedFields.email as string,
              bio: updatedFields.bio as string,
              isBioDeleted: updatedFields.isBioDeleted as boolean,
              profilePicture: updatedFields.profilePicture as File,
              isProfilePictureDeleted: updatedFields.isProfilePictureDeleted as boolean,
              favouriteClubId: updatedFields.favouriteClubId !== '' ? updatedFields.favouriteClubId as number : null,
              isFavouriteClubIdDeleted: updatedFields.favouriteClubId === ''
          };
            try{
                const response = await updateUserAPI(updateUserDto);
                toast.success("Player has been updated!");
                setDisplayedUser(response.data);
            }catch(e: any){
              errorHandler.handle(e);
            }finally{
              setIsUpdateModalOpen(false);
            }      
        }
    };


    if(!displayedUser){
        if (isLoaded){
            return <p className="text-lg font-medium text-gray-500 mt-5 text-center italic">
            There is no such user!
            </p>
        }else{
            return <p className="text-lg font-medium text-gray-500 mt-5 text-center italic">
                Loading...
            </p>
        }    
    }

    const totalPages = Math.ceil(displayedUser?.posts.length / postsPerPage);

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = displayedUser?.posts.slice(startIndex, endIndex);

    const userFields: FormField[] = [
    {
        name: "email",
        label: "Email",
        initialValue: displayedUser.email || "",
        type: "text",
        validationSchema: Yup.string().email("Invalid email address").required("Email is required"),
    },
    {
        name: "firstName",
        label: "First Name",
        initialValue: displayedUser.firstName || "",
        type: "text",
        validationSchema: Yup.string()
        .required("First name is required")
        .min(2, "First name must be between 2 and 50 characters.")
        .max(50, "First name must be between 2 and 50 characters."),
    },
    {
        name: "lastName",
        label: "Last Name",
        initialValue: displayedUser.lastName || "",
        type: "text",
        validationSchema: Yup.string()
        .required("Last name is required")
        .min(2, "Last name must be between 2 and 50 characters.")
        .max(50, "Last name must be between 2 and 50 characters."),
    },
    {
        name: "favouriteClubId",
        label: "Favourite Club",
        initialValue: displayedUser.favouriteClub?.clubId || "",
        type: "select",
        validationSchema: Yup.number()
        .nullable(),
        options: [
        { label: "None", value: "" },
        ...minClubs.map((club) => ({
            label: club.name,
            value: club.clubId,
        })),
        ],
    },
    { name: "profilePicture", label: "Profile Picture ", initialValue: null, type: "file"},
    {
        name: "isProfilePictureDeleted",
        label: "Delete Profile Picture",
        initialValue: false,
        type: "checkbox",
        validationSchema: Yup.boolean(),
    },
    {
        name: "bio",
        label: "Bio",
        initialValue: displayedUser.bio || "",
        type: "textarea",
        validationSchema: Yup.string()
        .nullable()
        .max(500, "Bio cannot be longer than 500 characters."),
    },
    {
        name: "isBioDeleted",
        label: "Delete Bio",
        initialValue: false,
        type: "checkbox",
        validationSchema: Yup.boolean(),
    },
    ];


  return (
    <>
        <ProfileCard name={`${displayedUser.userName}`} imageUrl={displayedUser.profilePictureUrl 
            ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${displayedUser.profilePictureUrl }` : "/images/default_user_picture.png" }
            updateButton={displayedUser.userName === user?.userName ? <UpdateButton onClick={handleUpdate} label="Update Account"/> : null}
            deleteButton={displayedUser.userName === user?.userName ? <DeleteButton onClick={handleDelete} label="Delete Account"/> : null}
            />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
            <div className="flex justify-center">
                <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile title="Name" subTitle={`${displayedUser.firstName} ${displayedUser.lastName}`} />
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile title="Register Date" subTitle={new Date(displayedUser.registrationDate).toLocaleDateString()} />
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile title="E-mail" subTitle={displayedUser.email} />
                </div>
            </div>
            {displayedUser.favouriteClub && (
                <div className="flex justify-center">
                    <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile 
                        title="Favourite Club" 
                        subTitle={displayedUser.favouriteClub.name} 
                        imageUrl={displayedUser.favouriteClub.logoUrl
                        ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${displayedUser.favouriteClub.logoUrl}` 
                        : "/images/default_club_logo.png" }
                        href={`/club/${displayedUser.favouriteClub.clubId}`}
                    />
                    </div>
                </div>
            )}
        </div>
        {displayedUser.bio && (
                <div className="my-8">
                    <Divider icon={<BsChatRightQuoteFill />} text={`${displayedUser.userName}'s bio`}/>
                    <p className="text-lg text-gray-600 mt-4 mx-auto text-center max-w-2xl italic">
                        {displayedUser.bio}
                    </p>
                </div>
        )}

        <Divider icon={<MdOutlinePostAdd />} text={`${displayedUser.userName}'s posts`} />
        {currentPosts.length === 0 ? (
                <p className="text-lg font-medium text-gray-500 mt-5 text-center italic">
                There are no posts created by {displayedUser.userName}.
              </p>
            ) : (
                <>
                    <div className="flex flex-col items-center">
                        {currentPosts.map((post, index) => (
                            <PostCard
                                key={post.postId}
                                post={post}
                                isAlignedLeft={index % 2 !== 0}
                            >
                
                            </PostCard>
                        ))}
                    </div>
                    {displayedUser.posts.length != currentPosts.length &&
                        <div className="flex justify-center items-center mt-4 space-x-2">
                            <button
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-lg font-medium">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    }
                </>

            )}

        

        <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
                <GenericForm fields={userFields} onSubmit={handleUpdateSubmit} />
        </Modal>
    </>
  )
}

export default UserPage