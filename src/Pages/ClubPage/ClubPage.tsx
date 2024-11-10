import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Tile from '../../Components/Tile/Tile';
import { ClubDto, UpdateClubDto } from '../../Dtos/ClubDto';
import { archiveClubAPI, getClubByIdAPI, restoreClubAPI, updateClubAPI } from '../../Services/ClubService';
import ErrorHandler from '../../Helpers/ErrorHandler';
import { useAuth } from '../../Context/useAuth';
import ProfileCard from "../../Components/ProfileCard/ProfileCard";
import RestoreButton, { ArchiveButton, DeleteButton, UpdateButton } from "../../Components/Buttons/Buttons";
import { toast } from "react-toastify";
import Modal from "../../Components/Modal/Modal";
import UpdateForm, { UpdateField } from "../../Components/UpdateForm/UpdateForm";
import * as Yup from "yup";


type Props = {}

const ClubPage = (props: Props) => {
    const { clubId } = useParams();
    const { logoutUser, IsAdmin} = useAuth();
    const [club, setClub] = useState<ClubDto | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false); // Dodajemy stan do kontrolowania modalu
    const errorHandler = new ErrorHandler(logoutUser);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchClubData = async () => {
            try {
                const response = await getClubByIdAPI(Number(clubId));
                setClub(response.data);            
            } catch (e: any) {
                errorHandler.handle(e);
                console.log(e);
                setClub(null);
            }finally{
                setIsLoaded(true);
            }
        };
        if (clubId) {
            fetchClubData();
        }
    }, [clubId]);  

    const handleArchive = async () => {
        if(clubId){
            try{
                await archiveClubAPI(Number(clubId));
                toast.success("Club has been archived!");
                navigate('/clubsearch');
            }catch(e: any){
                errorHandler.handle(e);
            }         
        }
      };

      const handleRestore = async () => {
        if(clubId){
            try{
                const result = await restoreClubAPI(Number(clubId));
                toast.success("Club has been restored!");
                setClub(result.data);
            }catch(e: any){
                errorHandler.handle(e);
            }         
        }
      };
    
      const handleUpdate = () => {
        setIsUpdateModalOpen(true);
    };

    const handleUpdateSubmit = async (updatedFields: { [key: string]: string | number | File | null | boolean }) => {
      if (club) {
          const updateClubDto: UpdateClubDto = {
            name: updatedFields.name as string,
            shortName: updatedFields.shortName as string,
            league: updatedFields.league as string,
            country: updatedFields.country as string,
            city: updatedFields.city as string,
            foundationYear: updatedFields.foundationYear as number,
            stadium: updatedFields.stadium as string,
            Logo: updatedFields.newLogo as File,
            IsLogoDeleted: updatedFields.deleteCurrentImage as boolean
        };
          try{
              const response = await updateClubAPI(Number(clubId), updateClubDto);
              toast.success("Club has been updated!");
              setClub(response.data);
          }catch(e: any){
            errorHandler.handle(e);
          }finally{
            setIsUpdateModalOpen(false);
          }      
      }
  };

    if(!club){
        if (isLoaded){
            return <p className="text-lg font-medium text-gray-500 mt-5 text-center italic">
            There is no such club!
            </p>
        }else{
            return <p className="text-lg font-medium text-gray-500 mt-5 text-center italic">
                Loading...
            </p>
        }    
    }

    const clubFields: UpdateField[] = [
      { name: "name", label: "Name", initialValue: club.name, type: "text", validationSchema: Yup.string().required("Name is required").min(3, "Name must be at least 3 characters").max(255, "Name can't be more than 255 characters") },
      { name: "shortName", label: "Shortname", initialValue: club.shortName, type: "text" },
      { name: "league", label: "League", initialValue: club.league, type: "select", options: [
          { label: "Premier League", value: "Premier League" },
          { label: "La Liga", value: "La Liga" },
          { label: "Serie A", value: "Serie A" },
          { label: "Bundesliga", value: "Bundesliga"},
          { label: "Ligue 1", value: "Ligue 1"},
      ]},
      { name: "country", label: "Country", initialValue: club.country, type: "text", validationSchema: Yup.string().required("Country is required").min(3, "Country must be at least 3 characters").max(150, "Country can't be more than 150 characters") },
      { name: "city", label: "City", initialValue: club.city, type: "text", validationSchema: Yup.string().required("Country is required").min(3, "City must be at least 3 characters").max(150, "City can't be more than 150 characters") },
      { name: "foundationYear", label: "Foundation Year", initialValue: club.foundationYear, type: "number", validationSchema: Yup.number().min(1800, "Year must be later than 1800").max(new Date().getFullYear(), "Year can't be more than current year").required("Foundation Year is required") },
      { name: "stadium", label: "Stadium", initialValue: club.stadium, type: "text", validationSchema: Yup.string().required("Stadium is required").min(3, "Stadium must be at least 3 characters").max(255, "Stadium can't be more than 255 characters") },
      { name: "newLogo", label: "New Logo", initialValue: null, type: "file"},
      { name: "deleteCurrentImage", label: "Delete current logo", initialValue: false, type: "checkbox" }
  ];

    return (
        <>
        <ProfileCard name={club.name} imageUrl={club.logoUrl 
            ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${club.logoUrl}` : "/images/default_club_logo.png" }
            updateButton={IsAdmin() ? <UpdateButton onClick={handleUpdate} label="Update Club"/> : null}
            deleteButton={IsAdmin() ? (club.isArchived ? 
                                        <RestoreButton onClick={handleRestore} label="Restore Club"/> : 
                                        <ArchiveButton onClick={handleArchive} label="Archive Club"/> ) 
                                        : null }
            />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 lg:gap-4 mt-5">
          <div className="flex justify-center">
            <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
              <Tile title="Shortname" subTitle={club.shortName} />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
              <Tile title="League" subTitle={club.league} />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
              <Tile title="Country" subTitle={club.country} />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
              <Tile title="City" subTitle={club.city} />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
              <Tile title="Foundation Year" subTitle={club.foundationYear.toString()} />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-xs aspect-w-1 aspect-h-1">
              <Tile title="Stadium" subTitle={club.stadium} />
            </div>
          </div>
        </div>

        <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
                <UpdateForm fields={clubFields} onSubmit={handleUpdateSubmit} />
        </Modal>
      </>
    );
}

export default ClubPage;
