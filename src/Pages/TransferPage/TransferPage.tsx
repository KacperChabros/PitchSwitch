import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../Context/useAuth';
import ErrorHandler from '../../Helpers/ErrorHandler';
import { MinimalClubDto } from '../../Dtos/ClubDto';
import { TransferDto, TransferType, UpdateTransferDto } from '../../Dtos/TransferDto';
import { getAllMinimalClubsAPI } from '../../Services/ClubService';
import { deleteTransferAPI, getTransferByIdAPI, updateTransferAPI } from '../../Services/TransferService';
import ProfileCard from '../../Components/ProfileCard/ProfileCard';
import { DeleteButton, UpdateButton } from '../../Components/Buttons/Buttons';
import Tile from '../../Components/Tile/Tile';
import GenericForm, { FormField } from '../../Components/GenericForm/GenericForm';
import * as Yup from "yup";
import { MinimalPlayerDto } from '../../Dtos/PlayerDto';
import { getAllMinimalPlayersAPI } from '../../Services/PlayerService';
import Modal from '../../Components/Modal/Modal';

type Props = {}

const TransferPage = (props: Props) => {
    const { transferId } = useParams();
    const { logoutUser, IsAdmin} = useAuth();
    const [transfer, setTransfer] = useState<TransferDto | null>(null);
    const [minClubs, setMinClubs] = useState<MinimalClubDto[] | []>([]);
    const [minPlayers, setMinPlayers] = useState<MinimalPlayerDto[] | []>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const errorHandler = new ErrorHandler(logoutUser);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                const response = await getTransferByIdAPI(Number(transferId));
                setTransfer(response.data);            
            } catch (e: any) {
                errorHandler.handle(e);
                console.log(e);
                setTransfer(null);
            }finally{
                setIsLoaded(true);
            }
        };
        const fetchMinClubs = async () =>{
            if(IsAdmin()){
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
            if(IsAdmin()){
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

        if (transferId) {
            fetchPlayerData();
            if(IsAdmin()){
                fetchMinClubs();
                fetchMinPlayers();
            }
        }
    }, [transferId]);  

    const handleDelete = async () => {
        if(transferId){
            try{
                await deleteTransferAPI(Number(transferId));
                toast.success("Transfer has been deleted!");
                navigate('/transfersearch');
            }catch(e: any){
                errorHandler.handle(e);
            }         
        }
      };

    const handleUpdate = () => {
        setIsUpdateModalOpen(true);
    };

    const handleUpdateSubmit = async (updatedFields: { [key: string]: string | number | File | null | boolean | Date }) => {
        if (transfer) {
            const updateTransferDto: UpdateTransferDto = {
              transferType: updatedFields.transferType as number,
              transferDate: updatedFields.transferDate as Date,
              transferFee: updatedFields.transferFee as number,
              playerId: updatedFields.playerId as number,
              sellingClubId: updatedFields.sellingClubId !== '' ? updatedFields.sellingClubId as number : null,
              isSellingClubDeleted: updatedFields.sellingClubId === '' ? true : false,
              buyingClubId: updatedFields.buyingClubId !== '' ? updatedFields.buyingClubId as number : null,
              isBuyingClubDeleted: updatedFields.buyingClubId === '' ? true : false,
          };
            try{
                const response = await updateTransferAPI(Number(transferId), updateTransferDto);
                toast.success("Transfer has been updated!");
                setTransfer(response.data);
            }catch(e: any){
              errorHandler.handle(e);
            }finally{
              setIsUpdateModalOpen(false);
            }      
        }
    };

    if(!transfer){
        if (isLoaded){
            return <p className="text-lg font-medium text-gray-500 mt-5 text-center italic">
            There is no such transfer!
            </p>
        }else{
            return <p className="text-lg font-medium text-gray-500 mt-5 text-center italic">
                Loading...
            </p>
        }    
    }


    const transferFields: FormField[] = [
        { name: "playerId", label: "Player", initialValue: transfer.player.playerId, type: "select", validationSchema: Yup.number().required("Player is required"), options: minPlayers.map((player) => ({ label: `${player.firstName} ${player.lastName}`, value: player.playerId })) },
        { name: "sellingClubId", label: "Selling Club", initialValue: transfer.sellingClub ? transfer.sellingClub.clubId : '', type: "select", validationSchema: Yup.number().nullable(), options: [{ label: "Free Agent", value: '' }, ...minClubs.map((club) => ({ label: club.name, value: club.clubId }))] },
        { name: "buyingClubId", label: "Buying Club", initialValue: transfer.buyingClub ? transfer.buyingClub.clubId : '', type: "select", validationSchema: Yup.number(), options: [{ label: "Free Agent", value: '' }, ...minClubs.map((club) => ({ label: club.name, value: club.clubId }))] },
        { name: "transferType", label: "Transfer Type", initialValue: transfer.transferType, type: "select", validationSchema: Yup.string().required("Transfer Type is required"), 
            options: [{ label: "Permanent", value: 0 }, { label: "Loan", value: 1 }] },
        { name: "transferDate", label: "Transfer Date", initialValue: new Date(transfer.transferDate), type: "date", validationSchema: Yup.date().required("Transfer Date is required").max(new Date(), "Transfer Date can't be in the future") },
        { name: "transferFee", label: "Transfer Fee (€)", initialValue: transfer.transferFee, type: "number", validationSchema: Yup.number().nullable().required("Transfer Fee is required").min(0, "Transfer Fee can't be negative").max(1000000000, "Transfer Fee can't exceed €1,000,000,000") },
    ];
    
  return (
    <>
        <ProfileCard name={`${transfer.player.firstName} ${transfer.player.lastName}, ${transfer.sellingClub ? transfer.sellingClub.name : 'Free agent'} -> ${transfer.buyingClub ? transfer.buyingClub.name : 'Free agent'}`}
            updateButton={IsAdmin() ? <UpdateButton onClick={handleUpdate} label="Update Transfer"/> : null}
            deleteButton={IsAdmin() ? <DeleteButton onClick={handleDelete} label="Delete Transfer"/> : null}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
            <div className="flex justify-center">
                <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile title="Transfer Date" subTitle={new Date(transfer.transferDate).toLocaleDateString()} />
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile title="Transfer Type" subTitle={TransferType[transfer.transferType]} />
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile title="Transfer Fee" subTitle={`€${transfer.transferFee.toLocaleString()}`} />
                </div>
            </div>
            {transfer.player && (
                <div className="flex justify-center">
                    <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                        <Tile 
                            title="Player" 
                            subTitle={`${transfer.player.firstName} ${transfer.player.lastName}`} 
                            imageUrl={transfer.player.photoUrl
                            ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${transfer.player.photoUrl}` 
                            : "/images/default_player_photo.png" }
                            href={`/player/${transfer.player.playerId}`}
                        />
                    </div>
                </div>
            )}
            <div className="flex justify-center">
                <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile 
                        title="Selling Club" 
                        subTitle={transfer.sellingClub ? transfer.sellingClub.name : 'Free agent'} 
                        imageUrl={transfer.sellingClub && transfer.sellingClub.logoUrl ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${transfer.sellingClub.logoUrl}` 
                        : "/images/default_club_logo.png" }
                        href={transfer.sellingClub ? `/club/${transfer.sellingClub.clubId}` : undefined}
                    />
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile 
                        title="Buying Club" 
                        subTitle={transfer.buyingClub ? transfer.buyingClub.name : 'Free agent'} 
                        imageUrl={transfer.buyingClub && transfer.buyingClub.logoUrl ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${transfer.buyingClub.logoUrl}` 
                        : "/images/default_club_logo.png" }
                        href={transfer.buyingClub ? `/club/${transfer.buyingClub.clubId}` : undefined}
                    />
                </div>
            </div>
        </div>
        <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
                <GenericForm fields={transferFields} onSubmit={handleUpdateSubmit} />
        </Modal>
    </>
  )
}

export default TransferPage