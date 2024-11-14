import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../Context/useAuth';
import ErrorHandler from '../../Helpers/ErrorHandler';
import { MinimalClubDto } from '../../Dtos/ClubDto';
import { deleteUserAPI, getAllMinUsersAPI, getUserByNameAPI, updateUserAPI } from '../../Services/AuthService';
import { GetUserDto, MinimalUserDto, UpdateUserDto } from '../../Dtos/UserDto';
import { getAllMinimalClubsAPI } from '../../Services/ClubService';
import ProfileCard from '../../Components/ProfileCard/ProfileCard';
import { AddButton, DeleteButton, ReviewButton, UpdateButton } from '../../Components/Buttons/Buttons';
import { toast } from 'react-toastify';
import Tile from '../../Components/Tile/Tile';
import Modal from '../../Components/Modal/Modal';
import GenericForm, { FormField } from '../../Components/GenericForm/GenericForm';
import * as Yup from "yup";
import PostCard from '../../Components/PostCard/PostCard';
import Divider from '../../Components/Divider/Divider';
import { MdOutlinePostAdd, MdRateReview } from "react-icons/md";
import { BsChatRightQuoteFill } from "react-icons/bs";
import { AddJournalistStatusApplicationDto, JournalistStatusApplicationDto, JournalistStatusApplicationQueryObject, ReviewJournalistStatusApplicationDto, UpdateJournalistStatusApplicationDto } from '../../Dtos/JournalistStatusApplicationDto';
import { addJournalistApplicationAPI, deleteApplicationAPI, getAllJournalistApplicationsAPI, reviewApplicationAPI, updateApplicationAPI } from '../../Services/JournalistStatusApplicationService';
import ApplicationCard from '../../Components/ApplicationCard/ApplicationCard';
import SearchForm from '../../Components/SearchForm/SearchForm';

type Props = {}

const journalistApplicationFields: FormField[] = [
    {
      name: "motivation",
      label: "Motivation",
      initialValue: "",
      type: "textarea",
      validationSchema: Yup.string()
        .required("Motivation is required")
        .min(2, "Motivation cannot shorter than 2 characters.")
        .max(500, "Motivation cannot be longer than 500 characters."),
    },
  ];

  const reviewFields: FormField[] = [
      {
          name: "isAccepted",
          label: "Accepted",
          initialValue: false,
          type: "checkbox",
          validationSchema: Yup.boolean().required("Acceptance status is required"),
      },
      {
          name: "rejectionReason",
          label: "Rejection Reason",
          initialValue: null,
          type: "textarea",
          validationSchema: Yup.string().nullable().min(2, "Rejection reason can't be less than 2 characters").max(500, "Rejection reason can't be more than 500 characters")            
      }
  ];
  

  const createJournalistSearchFieldsConfig = (minUsers: MinimalUserDto[]) => {
    return [
        { 
            name: 'motivation', 
            label: 'Motivation', 
            type: 'input' as const, 
            placeholder: 'Enter motivation',
        },
        { 
            name: 'createdOn', 
            label: 'Created On', 
            type: 'date' as const, 
            placeholder: 'Select creation date',
        },
        {
            name: 'createdOnComparison',
            label: 'Created On Comparison',
            type: 'select' as const,
            placeholder: 'Select comparison',
            options: [
                { label: 'Greater than', value: 'gt' },
                { label: 'Greater equal', value: 'ge' },
                { label: 'Less than', value: 'lt' },
                { label: 'Less equal', value: 'le' },
                { label: 'Equal to', value: 'eq' },
            ],
        },
        { 
            name: 'isAccepted', 
            label: 'Accepted', 
            type: 'checkbox' as const, 
            defaultValue: false 
        },
        { 
            name: 'isReviewed', 
            label: 'Reviewed', 
            type: 'checkbox' as const, 
            defaultValue: false 
        },
        { 
            name: 'rejectionReason', 
            label: 'Rejection Reason', 
            type: 'input' as const, 
            placeholder: 'Enter rejection reason',
        },
        { 
            name: 'submittedByUserId', 
            label: 'Submitted By', 
            type: 'select' as const, 
            placeholder: 'Select user', 
            options: minUsers.map((user) => ({
                label: user.userName,
                value: user.userId,
            })),
        },
        { 
            name: 'sortBy', 
            label: 'Sort By', 
            type: 'select' as const, 
            placeholder: 'Choose field',
            options: [
                { label: 'Motivation', value: 'motivation' },
                { label: 'Created On', value: 'createdOn' },
                { label: 'Acceptance Status', value: 'isAccepted' },
                { label: 'Review Status', value: 'isReviewed' },
                { label: 'Rejection Reason', value: 'rejectionReason' },
            ],
        },
        { 
            name: 'sortOrder', 
            label: 'Sort Order', 
            type: 'select' as const, 
            placeholder: 'Choose type', 
            options: [
                { label: 'Ascending', value: 'asc' },
                { label: 'Descending', value: 'desc' },
            ],
            defaultValue: 'desc',
        },
    ];
};


const UserPage = (props: Props) => {
    const { userName } = useParams();
    const { logoutUser, IsAdmin, user, IsJournalist} = useAuth();
    const [displayedUser, setDisplayedUser] = useState<GetUserDto | null>(null);
    const [minClubs, setMinClubs] = useState<MinimalClubDto[] | []>([]);
    const [minUsers, setMinUsers] = useState<MinimalUserDto[] | []>([]);
    const [applications, setApplications] = useState<JournalistStatusApplicationDto[] | []>([]);
    const [applicationToEdit, setApplicationToEdit] = useState<JournalistStatusApplicationDto | null>(null);
    const [totalApplicationCount, setTotalApplicationCount] = useState<number>(0);
    const [pageNumberApplication, setPageNumberApplication] = useState<number>(1);
    const [applicationsPerPage, setApplicationsPerPage] = useState<number>(6);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [modalContentType, setModalContentType] = useState<'addApplication' | 'updateApplication' | 'updateProfile' | 'reviewApplication' | null>(null);
    const [currentPagePost, setCurrentPagePost] = useState<number>(1);
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

            const fetchMinUsers = async () =>{
                try{
                    const response = await getAllMinUsersAPI();
                    setMinUsers(response.data);
                }catch(e: any){
                    errorHandler.handle(e);
                    console.log(e);
                    setMinUsers([]);
                }
            };
    
            if (userName) {
                fetchUserData();
                if(userName === user?.userName){
                    fetchMinClubs();
                }
                if(IsAdmin()){
                    fetchMinUsers();
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
        setModalContentType("updateProfile")
        setIsUpdateModalOpen(true);
    };

    const handleAddApplication = () => {
        setModalContentType("addApplication");
        setIsUpdateModalOpen(true);
      };

      const handleUpdateApplication = (application: JournalistStatusApplicationDto) => {
        setApplicationToEdit(application);
        setModalContentType("updateApplication");
        setIsUpdateModalOpen(true);
      };

      const handleReviewApplication = (application: JournalistStatusApplicationDto) => {
        setApplicationToEdit(application);
        setModalContentType("reviewApplication");
        setIsUpdateModalOpen(true);
      };

    const handleDeleteApplication = async (application: JournalistStatusApplicationDto) => {
        try{
            await deleteApplicationAPI(application.id)
            toast.success("Application has been successfully deleted")
            setDisplayedUser((prevUser) => {
                if (!prevUser) return prevUser;
    
                const updatedApplications = prevUser.applications.filter(
                    (app) => app.id !== application.id
                );
    
                return {
                    ...prevUser,
                    applications: updatedApplications,
                };
            });
        }catch(e: any){
            errorHandler.handle(e);
        }
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
                toast.success("User has been updated!");
                setDisplayedUser(response.data);
            }catch(e: any){
              errorHandler.handle(e);
            }finally{
              setIsUpdateModalOpen(false);
            }      
        }
    };

    const handleAddApplicationSubmit = async (addedFields: { [key: string]: string | number | File | null | boolean | Date }) => {
        try {
            const addApplicationDto: AddJournalistStatusApplicationDto = {
                motivation: addedFields.motivation as string,
            };
            
            const response = await addJournalistApplicationAPI(addApplicationDto);
            const newApplication = response.data;
    
            toast.success("Application for journalist status submitted successfully!");
    
            setDisplayedUser((prevUser) => {
                if (!prevUser) return prevUser;
                
                return {
                    ...prevUser,
                    applications: [...prevUser.applications, newApplication]
                };
            });
        } catch (e: any) {
            errorHandler.handle(e);
        } finally {
            setIsUpdateModalOpen(false);
        }
      };

      const handleUpdateApplicationSubmit = async (updatedFields: { [key: string]: string | number | File | null | boolean | Date }) => {
        if (applicationToEdit) {
          try {
            const updateApplicationDto: UpdateJournalistStatusApplicationDto = {
                motivation: updatedFields.motivation as string,
              };
            const result = await updateApplicationAPI(applicationToEdit.id, updateApplicationDto);
            toast.success("Application updated successfully!");

            setDisplayedUser((prevUser) => {
                if (!prevUser) return prevUser;
    
                const updatedApplications = prevUser.applications.map((app) =>
                    app.id === applicationToEdit.id
                        ? { ...app, motivation: updateApplicationDto.motivation }
                        : app
                );
    
                return {
                    ...prevUser,
                    applications: updatedApplications
                };
            });
          } catch (e: any) {
            errorHandler.handle(e);
          } finally {
            setIsUpdateModalOpen(false);
            setApplicationToEdit(null);
          }
        }
      };

      const handleReviewApplicationSubmit = async (updatedFields: { [key: string]: string | number | File | null | boolean | Date }) => {
        if (applicationToEdit) {
          try {
            const reviewApplicationDto: ReviewJournalistStatusApplicationDto = {
                isAccepted: updatedFields.isAccepted as boolean, 
                rejectionReason: updatedFields.rejectionReason as string,
              };
            const result = await reviewApplicationAPI(applicationToEdit.id, reviewApplicationDto);
            toast.success("Application reviewed successfully!");
            if (result) {
                const updatedApplication = result.data;
        
                setApplications((prevApplications) => 
                  prevApplications.map((application) =>
                    application.id === applicationToEdit.id ? updatedApplication : application
                  )
                );
              }
          } catch (e: any) {
            errorHandler.handle(e);
          } finally {
            setIsUpdateModalOpen(false);
            setApplicationToEdit(null);
          }
        }
      };

      const handleSearch = async (values: any) => {
        const searchDto: JournalistStatusApplicationQueryObject = {
            motivation: values.motivation,
            createdOn: values.createdOn,
            createdOnComparison: values.createdOnComparison,
            isAccepted: values.isAccepted,
            isReviewed: values.isReviewed,
            submittedByUserId: values.submittedByUserId,
            rejectionReason: values.rejectionReason,
            sortBy: values.sortBy,
            isDescending: values.sortOrder === 'desc' ? true : false,
            pageSize: applicationsPerPage,
            pageNumber: pageNumberApplication
        };

        try {
            const players = await getAllJournalistApplicationsAPI(searchDto);
            setApplications(players.data.items);
            setTotalApplicationCount(players.data.totalCount);
        } catch (e: any) {
            errorHandler.handle(e);
            console.log(e);
            setApplications([]);
            setTotalApplicationCount(0);
        }    
    };

      const updateApplicationFields: FormField[] = [
        {
          name: "motivation",
          label: "Motivation",
          initialValue: applicationToEdit ? applicationToEdit.motivation : "",
          type: "textarea",
          validationSchema: Yup.string()
            .required("Motivation is required")
            .min(2, "Motivation cannot be shorter than 2 characters.")
            .max(500, "Motivation cannot be longer than 500 characters."),
        },
      ];

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

    const totalPostPages = Math.ceil(displayedUser?.posts.length / postsPerPage);

    const goToNextPagePost = () => {
        setCurrentPagePost((prevPage) => Math.min(prevPage + 1, totalPostPages));
    };

    const goToPreviousPagePost = () => {
        setCurrentPagePost((prevPage) => Math.max(prevPage - 1, 1));
    };
    const startIndexPost = (currentPagePost - 1) * postsPerPage;
    const endIndexPost = startIndexPost + postsPerPage;
    const currentPosts = displayedUser?.posts.slice(startIndexPost, endIndexPost);

    const totalApplicationPages = Math.ceil(totalApplicationCount / applicationsPerPage);

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
    const journalistStatusFields = createJournalistSearchFieldsConfig(minUsers);
    


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

        
        {!IsAdmin() && displayedUser.userName === user?.userName ? (
            <>
                <Divider icon={<MdRateReview />} text={`Journalist Status Applications`} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayedUser.applications.length === 0 ? (
                        <p className="text-center text-gray-500 w-full">No applications found.</p>
                    ) : (
                        displayedUser.applications.map((application) => (
                            <ApplicationCard 
                                key={application.id} 
                                application={application} 
                                updateButton={!application.isReviewed ? <UpdateButton label="Update" onClick={() => handleUpdateApplication(application)} /> : undefined}
                                deleteButton={!application.isReviewed ? <DeleteButton label="Delete" onClick={() => handleDeleteApplication(application)} /> : undefined}
                            />
                        ))
                    )}
                </div>
                {!IsJournalist() && <div className="flex justify-center my-4">
                    <AddButton onClick={handleAddApplication} label="Apply for Journalist Status" />
                </div>
                }
            </>
        ) : IsAdmin() ? (
            <>
                <Divider icon={<MdRateReview />} text={`Journalist Status Applications`} />
                <div>
                    <SearchForm fields={journalistStatusFields} onSubmit={handleSearch} 
                                            totalPages={totalApplicationPages}
                                            currentPage={pageNumberApplication}
                                            onPageChange={setPageNumberApplication}
                        />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {applications.length === 0 ? (
                        <p className="text-center text-gray-500 w-full">No applications found for this user.</p>
                    ) : (
                        applications.map((application) => (
                            <ApplicationCard 
                                key={application.id} 
                                application={application}
                                reviewButton={!application.isReviewed ? <ReviewButton label="Review" onClick={() => handleReviewApplication(application)} /> : undefined}
                            />
                        ))
                    )}
                </div>
            </>
        ) : null}


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
                                onClick={goToPreviousPagePost}
                                disabled={currentPagePost === 1}
                                className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-lg font-medium">
                                Page {currentPagePost} of {totalPostPages}
                            </span>
                            <button
                                onClick={goToNextPagePost}
                                disabled={currentPagePost === totalPostPages}
                                className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    }
                </>

            )}    

        <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
                 {modalContentType === 'updateProfile' ? (
                    <GenericForm fields={userFields} onSubmit={handleUpdateSubmit} />
                ) : modalContentType === 'addApplication' ? (
                    <GenericForm fields={journalistApplicationFields} onSubmit={handleAddApplicationSubmit} />
                ) : modalContentType === 'updateApplication' ? (
                    <GenericForm fields={updateApplicationFields} onSubmit={handleUpdateApplicationSubmit} />
                ) : modalContentType === 'reviewApplication' ? (
                    <GenericForm fields={reviewFields} onSubmit={handleReviewApplicationSubmit} />
                )  
                : null}
                
        </Modal>
    </>
  )
}

export default UserPage