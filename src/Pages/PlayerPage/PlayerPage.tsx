import React, { useEffect, useState } from 'react'
import { Foot, PlayerDto, UpdatePlayerDto } from '../../Dtos/PlayerDto';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../Context/useAuth';
import ErrorHandler from '../../Helpers/ErrorHandler';
import { deletePlayerAPI, getPlayerByIdAPI, updatePlayerAPI } from '../../Services/PlayerService';
import Modal from '../../Components/Modal/Modal';
import GenericForm, { FormField } from '../../Components/GenericForm/GenericForm';
import ProfileCard from '../../Components/ProfileCard/ProfileCard';
import { DeleteButton, UpdateButton } from '../../Components/Buttons/Buttons';
import Tile from '../../Components/Tile/Tile';
import * as Yup from "yup";
import { toast } from 'react-toastify';
import { MinimalClubDto } from '../../Dtos/ClubDto';
import { getAllMinimalClubsAPI } from '../../Services/ClubService';
type Props = {}

const PlayerPage = (props: Props) => {
    const { playerId } = useParams();
    const { logoutUser, IsAdmin} = useAuth();
    const [player, setPlayer] = useState<PlayerDto | null>(null);
    const [minClubs, setMinClubs] = useState<MinimalClubDto[] | []>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const errorHandler = new ErrorHandler(logoutUser);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                const response = await getPlayerByIdAPI(Number(playerId));
                setPlayer(response.data);            
            } catch (e: any) {
                errorHandler.handle(e);
                console.log(e);
                setPlayer(null);
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

        if (playerId) {
            fetchPlayerData();
            if(IsAdmin()){
                fetchMinClubs();
            }
        }
    }, [playerId]);  

    const handleDelete = async () => {
        if(playerId){
            try{
                await deletePlayerAPI(Number(playerId));
                toast.success("Player has been deleted!");
                navigate('/playersearch');
            }catch(e: any){
                errorHandler.handle(e);
            }         
        }
      };

    const handleUpdate = () => {
        setIsUpdateModalOpen(true);
    };

    const handleUpdateSubmit = async (updatedFields: { [key: string]: string | number | File | null | boolean | Date }) => {
        if (player) {
            const updatePlayerDto: UpdatePlayerDto = {
              firstName: updatedFields.firstName as string,
              lastName: updatedFields.lastName as string,
              dateOfBirth: updatedFields.dateOfBirth as Date,
              nationality: updatedFields.nationality as string,
              position: updatedFields.position as string,
              height: updatedFields.height as number,
              weight: updatedFields.weight as number,
              preferredFoot: updatedFields.preferredFoot as number,
              marketValue: updatedFields.marketValue as number,
              photo: updatedFields.photo as File,
              isPhotoDeleted: updatedFields.isPhotoDeleted as boolean,
              clubId: updatedFields.clubId !== 'unemployed' ? updatedFields.clubId as number : null,
              isClubIdDeleted: updatedFields.clubId === 'unemployed'
          };
            try{
                const response = await updatePlayerAPI(Number(playerId), updatePlayerDto);
                toast.success("Player has been updated!");
                setPlayer(response.data);
            }catch(e: any){
              errorHandler.handle(e);
            }finally{
              setIsUpdateModalOpen(false);
            }      
        }
    };

    if(!player){
        if (isLoaded){
            return <p className="text-lg font-medium text-gray-500 mt-5 text-center italic">
            There is no such player!
            </p>
        }else{
            return <p className="text-lg font-medium text-gray-500 mt-5 text-center italic">
                Loading...
            </p>
        }    
    }

    
    const playerFields: FormField[] = [
        { name: "firstName", label: "First Name", initialValue: player.firstName, type: "text", validationSchema: Yup.string().required("First name is required").min(2, "First name must be at least 2 characters").max(100, "First name can't be more than 100 characters") },
        { name: "lastName", label: "Last Name", initialValue: player.lastName, type: "text", validationSchema: Yup.string().required("Last name is required").min(2, "Last name must be at least 2 characters").max(100, "Last name can't be more than 100 characters") },
        { 
            name: "clubId", 
            label: "Club", 
            initialValue: player.club ? player.club.clubId : null,
            type: "select", 
            validationSchema: Yup.string().nullable(),
            options: [
                { label: "Unemployed", value: "unemployed" },
                ...minClubs.map((club) => ({
                    label: club.name,
                    value: club.clubId,
                })),
            ],
        },
        { name: "dateOfBirth", label: "Date of Birth", initialValue: new Date(player.dateOfBirth), type: "date", validationSchema: Yup.date().required("Date of Birth is required").max(new Date(), "Date of Birth can't be in the future") },
        { name: "nationality", label: "Nationality", initialValue: player.nationality, type: "text", validationSchema: Yup.string().required("Nationality is required").min(2, "Nationality must be at least 2 characters").max(100, "Nationality can't be more than 100 characters") },
        { name: "position", label: "Position", initialValue: player.position, type: "text", validationSchema: Yup.string().required("Position is required").min(2, "Position must be at least 2 characters").max(100, "Position can't be more than 100 characters") },
        { name: "height", label: "Height (cm)", initialValue: player.height, type: "number", validationSchema: Yup.number().required("Height is required").min(100, "Height must be at least 100 cm").max(230, "Height can't be more than 230 cm") },
        { name: "weight", label: "Weight (kg)", initialValue: player.weight, type: "number", validationSchema: Yup.number().required("Weight is required").min(30, "Weight must be at least 30 kg").max(200, "Weight can't be more than 200 kg") },
        { name: "preferredFoot", label: "Preferred Foot", initialValue: player.preferredFoot, type: "select", validationSchema: Yup.string().required("Preferred foot is required") , options: [
          { label: "Left", value: 0 },
          { label: "Right", value: 1 },
          { label: "Both", value: 2 }
        ]},
        { name: "marketValue", label: "Market Value (€)", initialValue: player.marketValue, type: "number", validationSchema: Yup.number().required("Market value is required").min(0, "Market value can't be negative").max(1000000000, "Market value can't be more than 1000000000") },
        { name: "photo", label: "Profile Photo", initialValue: null, type: "file"},
        { name: "isPhotoDeleted", label: "Delete current photo", initialValue: false, type: "checkbox" }
      ];

    return (
        <>
        <ProfileCard name={`${player.firstName} ${player.lastName}`} imageUrl={player.photoUrl 
            ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${player.photoUrl }` : "/images/default_player_photo.png" }
            updateButton={IsAdmin() ? <UpdateButton onClick={handleUpdate} label="Update Player"/> : null}
            deleteButton={IsAdmin() ? <DeleteButton onClick={handleDelete} label="Delete Player"/> : null}
            />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
            <div className="flex justify-center">
                <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile title="Date of Birth" subTitle={new Date(player.dateOfBirth).toLocaleDateString()} />
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile title="Nationality" subTitle={player.nationality} />
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile title="Position" subTitle={player.position} />
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile title="Height" subTitle={`${player.height} cm`} />
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile title="Weight" subTitle={`${player.weight} kg`} />
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile title="Preferred Foot" subTitle={Foot[player.preferredFoot]} />
                </div>
            </div>
            <div className="flex justify-center">
                <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile title="Market Value" subTitle={`€${player.marketValue.toLocaleString()}`} />
                </div>
            </div>
            {player.club && (
                <div className="flex justify-center">
                    <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
                    <Tile 
                        title="Club" 
                        subTitle={player.club.name} 
                        imageUrl={player.club.logoUrl
                        ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${player.club.logoUrl}` 
                        : "/images/default_club_logo.png" }
                        href={`/club/${player.club.clubId}`}
                    />
                    </div>
                </div>
            )}
        </div>

        <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
                <GenericForm fields={playerFields} onSubmit={handleUpdateSubmit} />
        </Modal>
      </>
    );
}

export default PlayerPage