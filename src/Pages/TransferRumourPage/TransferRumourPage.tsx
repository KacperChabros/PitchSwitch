import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../Context/useAuth';
import ErrorHandler from '../../Helpers/ErrorHandler';
import { MinimalClubDto } from '../../Dtos/ClubDto';
import { TransferType } from '../../Dtos/TransferDto';
import { getAllMinimalClubsAPI } from '../../Services/ClubService';
import ProfileCard from '../../Components/ProfileCard/ProfileCard';
import { ArchiveButton, DeleteButton, UpdateButton } from '../../Components/Buttons/Buttons';
import Tile from '../../Components/Tile/Tile';
import GenericForm, { FormField } from '../../Components/GenericForm/GenericForm';
import * as Yup from "yup";
import { MinimalPlayerDto } from '../../Dtos/PlayerDto';
import { getAllMinimalPlayersAPI } from '../../Services/PlayerService';
import Modal from '../../Components/Modal/Modal';
import { TransferRumourDto, UpdateTransferRumourDto } from '../../Dtos/TransferRumourDto';
import { archiveTransferRumourAPI, deleteTransferRumourAPI, getTransferRumourByIdAPI, updateTransferRumourAPI } from '../../Services/TransferRumourService';

type Props = {}

const archiveRumourFields: FormField[] = [
    { name: "isConfirmed", label: "Is Transfer Confirmed?", initialValue: false, type: "checkbox" }
];

const TransferPage = (props: Props) => {
    const { transferRumourId } = useParams();
    const { logoutUser, IsAdmin, IsJournalist, user} = useAuth();
    const [transferRumour, setTransferRumour] = useState<TransferRumourDto | null>(null);
    const [minClubs, setMinClubs] = useState<MinimalClubDto[] | []>([]);
    const [minPlayers, setMinPlayers] = useState<MinimalPlayerDto[] | []>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [modalContentType, setModalContentType] = useState<'update' | 'archive' | null>(null);
    const errorHandler = new ErrorHandler(logoutUser);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                const response = await getTransferRumourByIdAPI(Number(transferRumourId));
                setTransferRumour(response.data);            
            } catch (e: any) {
                errorHandler.handle(e);
                console.log(e);
                setTransferRumour(null);
            }finally{
                setIsLoaded(true);
            }
        };
        const fetchMinClubs = async () =>{
            if(IsAdmin() || IsJournalist()){
                try{
                    const response = await getAllMinimalClubsAPI();
                    setMinClubs(response.data);
                }catch(e: any){
                    errorHandler.handle(e);
                    console.log(e);
                    setMinClubs([]);
                }
            }
        };

        const fetchMinPlayers = async () =>{
            if(IsAdmin() || IsJournalist()){
                try{
                    const response = await getAllMinimalPlayersAPI();
                    setMinPlayers(response.data);
                }catch(e: any){
                    errorHandler.handle(e);
                    console.log(e);
                    setMinPlayers([]);
                }
            }
        };

        if (transferRumourId) {
            fetchPlayerData();
            if(IsAdmin() || IsJournalist()){
                fetchMinClubs();
                fetchMinPlayers();
            }
        }
    }, [transferRumourId]);  

    const handleDelete = async () => {
        if(transferRumourId){
            try{
                await deleteTransferRumourAPI(Number(transferRumourId));
                toast.success("Transfer Rumour has been deleted!");
                navigate('/transferrumoursearch');
            }catch(e: any){
                errorHandler.handle(e);
            }         
        }
      };

    const handleUpdate = () => {
        setModalContentType('update');
        setIsUpdateModalOpen(true);
    };
    const handleArchive = () => {
        setModalContentType('archive');
        setIsUpdateModalOpen(true);
    };

    const handleUpdateSubmit = async (updatedFields: { [key: string]: string | number | File | null | boolean | Date }) => {
        if (transferRumour) {
            const updateTransferRumourDto: UpdateTransferRumourDto = {
              transferType: updatedFields.transferType as number,
              rumouredFee: updatedFields.rumouredFee as number,
              confidenceLevel: updatedFields.confidenceLevel as number,
              playerId: updatedFields.playerId as number,
              buyingClubId: updatedFields.buyingClubId !== '' ? updatedFields.buyingClubId as number : null,
              isBuyingClubDeleted: updatedFields.buyingClubId === '' ? true : false,
          };
            try{
                const response = await updateTransferRumourAPI(Number(transferRumourId), updateTransferRumourDto);
                toast.success("Transfer rumour has been updated!");
                setTransferRumour(response.data);
            }catch(e: any){
              errorHandler.handle(e);
            }finally{
              setIsUpdateModalOpen(false);
            }      
        }
    };

    const handleArchiveSubmit = async (updatedFields: { [key: string]: string | number | File | null | boolean | Date }) => {
        if (transferRumour) {
            const isConfirmed: boolean = updatedFields.isConfirmed as boolean;
            try{ 
                const response = await archiveTransferRumourAPI(Number(transferRumourId), isConfirmed);
                toast.success("Transfer rumour has been archived!");
                setTransferRumour(response.data);
            }catch(e: any){
              errorHandler.handle(e);
            }finally{
              setIsUpdateModalOpen(false);
            }      
        }
    };

    if(!transferRumour){
        if (isLoaded){
            return <p className="text-lg font-medium text-gray-500 mt-5 text-center italic">
            There is no such transfer rumour!
            </p>
        }else{
            return <p className="text-lg font-medium text-gray-500 mt-5 text-center italic">
                Loading...
            </p>
        }    
    }


    const transferRumourFields: FormField[] = [
        { name: "playerId", label: "Player", initialValue: transferRumour.player.playerId, type: "select", validationSchema: Yup.number().required("Player is required"), options: minPlayers.map((player) => ({ label: `${player.firstName} ${player.lastName}`, value: player.playerId })) },
        { name: "buyingClubId", label: "Buying Club", initialValue: transferRumour.buyingClub ? transferRumour.buyingClub.clubId : '', type: "select", validationSchema: Yup.number(), options: [{ label: "Free Agent", value: '' }, ...minClubs.map((club) => ({ label: club.name, value: club.clubId }))] },
        { name: "transferType", label: "Transfer Type", initialValue: transferRumour.transferType, type: "select", validationSchema: Yup.string().required("Transfer Type is required"), 
            options: [{ label: "Permanent", value: 0 }, { label: "Loan", value: 1 }] },
        { name: "rumouredFee", label: "Transfer Fee (€)", initialValue: transferRumour.rumouredFee, type: "number", validationSchema: Yup.number().nullable().required("Rumoured Fee is required").min(0, "Rumoured Fee can't be negative").max(1000000000, "Rumoured Fee can't exceed €1,000,000,000") },
        { name: "confidenceLevel", label: "Confidence Level (%)", initialValue: transferRumour.confidenceLevel, type: "number", validationSchema: Yup.number().nullable().required("Confidence Level is required").min(1, "Confidence Level can't be less than 1%").max(100, "Confidence Level can't exceed 100%") },
    ];
    
  return (
    <>
        <ProfileCard name={`${transferRumour.player.firstName} ${transferRumour.player.lastName}, ${transferRumour.sellingClub ? transferRumour.sellingClub.name : 'Free agent'} -> ${transferRumour.buyingClub ? transferRumour.buyingClub.name : 'Free agent'}`}
            updateButton={IsAdmin() || (IsJournalist() && user?.userId === transferRumour.createdByUser.userId) ? <UpdateButton onClick={handleUpdate} label="Update Transfer Rumour"/> : null}
            archiveButton={IsAdmin() || (IsJournalist() && user?.userId === transferRumour.createdByUser.userId && !transferRumour.isArchived) ? <ArchiveButton onClick={handleArchive} label="Archive Transfer Rumour"/> : null}
            deleteButton={IsAdmin() || (IsJournalist() && user?.userId === transferRumour.createdByUser.userId) ? <DeleteButton onClick={handleDelete} label="Delete Transfer Rumour"/> : null}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
            <div className="flex justify-center">
                <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile title="Transfer Type" subTitle={TransferType[transferRumour.transferType]} />
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile title="Rumoured Fee" subTitle={`€${transferRumour.rumouredFee.toLocaleString()}`} />
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile title="Confidence Level" subTitle={`${transferRumour.confidenceLevel}%`} />
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile title="Status" subTitle={transferRumour.isConfirmed ? 'Confirmed' : transferRumour.isArchived ? 'Archived' : 'Pending'} />
                </div>
            </div>
            {transferRumour.player && (
                <div className="flex justify-center">
                    <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                        <Tile 
                            title="Player" 
                            subTitle={`${transferRumour.player.firstName} ${transferRumour.player.lastName}`} 
                            imageUrl={transferRumour.player.photoUrl
                            ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${transferRumour.player.photoUrl}` 
                            : "/images/default_player_photo.png" }
                            href={`/player/${transferRumour.player.playerId}`}
                        />
                    </div>
                </div>
            )}
            <div className="flex justify-center">
                <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile 
                        title="Selling Club" 
                        subTitle={transferRumour.sellingClub ? transferRumour.sellingClub.name : 'Free agent'} 
                        imageUrl={transferRumour.sellingClub && transferRumour.sellingClub.logoUrl ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${transferRumour.sellingClub.logoUrl}` 
                        : "/images/default_club_logo.png" }
                        href={transferRumour.sellingClub ? `/club/${transferRumour.sellingClub.clubId}` : undefined}
                    />
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile 
                        title="Buying Club" 
                        subTitle={transferRumour.buyingClub ? transferRumour.buyingClub.name : 'Free agent'} 
                        imageUrl={transferRumour.buyingClub && transferRumour.buyingClub.logoUrl ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${transferRumour.buyingClub.logoUrl}` 
                        : "/images/default_club_logo.png" }
                        href={transferRumour.buyingClub ? `/club/${transferRumour.buyingClub.clubId}` : undefined}
                    />
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile 
                        title="Created By" 
                        subTitle={transferRumour.createdByUser ? transferRumour.createdByUser.userName : 'Unknown'} 
                        imageUrl={transferRumour.createdByUser && transferRumour.createdByUser.profilePictureUrl ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${transferRumour.createdByUser.profilePictureUrl}` 
                        : "/images/default_user_picture.png" }
                        href={transferRumour.createdByUser ? `/user/${transferRumour.createdByUser.userName}` : undefined}
                    />
                </div>
            </div>
        </div>
        <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
                {modalContentType === 'update' ? (
                    <>
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Update Transfer Rumour
                        </h1>
                        <GenericForm fields={transferRumourFields} onSubmit={handleUpdateSubmit} />
                    </>           
                ) : modalContentType === 'archive' ? (
                    <>
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Archive Transfer Rumour
                        </h1>
                        <GenericForm fields={archiveRumourFields} onSubmit={handleArchiveSubmit} />
                    </>
                    
                ) : null}
        </Modal>
    </>
  )
}

export default TransferPage