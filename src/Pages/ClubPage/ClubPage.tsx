import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import Tile from '../../Components/Tile/Tile';
import { ClubDto } from '../../Dtos/ClubDto';
import { archiveClubAPI, getClubByIdAPI, restoreClubAPI } from '../../Services/ClubService';
import ErrorHandler from '../../Helpers/ErrorHandler';
import { useAuth } from '../../Context/useAuth';
import ProfileCard from "../../Components/ProfileCard/ProfileCard";
import RestoreButton, { ArchiveButton, DeleteButton, UpdateButton } from "../../Components/Buttons/Buttons";
import { toast } from "react-toastify";

type Props = {}

const ClubPage = (props: Props) => {
    const { clubId } = useParams();
    const { logoutUser, IsAdmin} = useAuth();
    const [club, setClub] = useState<ClubDto | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
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
        console.log("Update clicked");
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
      </>
    );
}

export default ClubPage;
