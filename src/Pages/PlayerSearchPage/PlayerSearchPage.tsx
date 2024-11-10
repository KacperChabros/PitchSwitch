import React, { useEffect, useState } from 'react'
import SearchForm from '../../Components/SearchForm/SearchForm';
import { AddButton } from '../../Components/Buttons/Buttons';
import ErrorHandler from '../../Helpers/ErrorHandler';
import { useAuth } from '../../Context/useAuth';
import { useNavigate } from 'react-router-dom';
import { PlayerDto, PlayerQueryObject } from '../../Dtos/PlayerDto';
import { getAllPlayersAPI } from '../../Services/PlayerService';
import Table from '../../Components/Table/Table';
import { getAllClubsAPI } from '../../Services/ClubService';
import { ClubDto, ClubQueryObject } from '../../Dtos/ClubDto';


type Props = {}
const createFieldsConfig = (clubs: { clubId: string; name: string }[]) => {
    return [
        { 
            name: 'firstName', 
            label: 'First Name', 
            type: 'input' as const, 
            placeholder: 'Enter first name',
        },
        { 
            name: 'lastName', 
            label: 'Last Name', 
            type: 'input' as const, 
            placeholder: 'Enter last name' 
        },
        { 
            name: 'dateOfBirth', 
            label: 'Date of Birth', 
            type: 'date' as const, 
            placeholder: 'Enter date of birth',
            inputType: 'date' as const
        },
        {
            name: 'dateOfBirthComparison',
            label: 'Date of Birth Comparison',
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
            name: 'nationality', 
            label: 'Nationality', 
            type: 'input' as const, 
            placeholder: 'Enter nationality' 
        },
        { 
            name: 'position', 
            label: 'Position', 
            type: 'input' as const, 
            placeholder: 'Enter position' 
        },
        { 
            name: 'marketValue', 
            label: 'Market Value', 
            type: 'input' as const, 
            placeholder: 'Enter market value',
            inputType: 'number' as const
        },
        {
            name: 'marketValueComparison',
            label: 'Market Value Comparison',
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
            name: 'clubId',
            label: 'Club',
            type: 'select' as const,
            placeholder: 'Select club',
            options: clubs.map((club) => ({
                label: club.name,
                value: club.clubId,
            })),
        },
        {
            name: 'filterForUnemployedIfClubIsEmpty',
            label: 'Unemployed?',
            type: 'checkbox' as const,
            defaultValue: false
        },
        {
            name: 'sortBy',
            label: 'Sort by',
            type: 'select' as const,
            placeholder: 'Choose field',
            options: [
                { label: 'First Name', value: 'firstName' },
                { label: 'Last Name', value: 'lastName' },
                { label: 'Date of Birth', value: 'dateOfBirth' },
                { label: 'Nationality', value: 'nationality' },
                { label: 'Position', value: 'position' },
                { label: 'Market Value', value: 'marketValue' },
            ],
        },
        {
            name: 'isDescending',
            label: 'Sort Order',
            type: 'select' as const,
            placeholder: 'Choose type',
            options: [
                { label: 'Ascending', value: 'asc' },
                { label: 'Descending', value: 'desc' },
            ],
            defaultValue: 'desc'
        }
    ];
}


const config = [
    {
        label: "Photo",
        render: (player: PlayerDto) => (
            <img 
                src={player.photoUrl && player.photoUrl.trim().length > 0
                    ? player.photoUrl
                    : "/images/default_player_photo.png"
                }
                alt={`${player.firstName} ${player.lastName}`} 
                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            />
        ),
        keyField: 'playerId'
    },
    {
        label: "Name",
        render: (player: PlayerDto) => `${player.firstName} ${player.lastName}`,
        keyField: 'playerId'
    },
    {
        label: "Date of Birth",
        render: (player: PlayerDto) => (
            player.dateOfBirth ? new Date(player.dateOfBirth).toLocaleDateString() : 'N/A'
        ),
        keyField: 'playerId'
    },
    {
        label: "Nationality",
        render: (player: PlayerDto) => player.nationality,
        keyField: 'playerId'
    },
    {
        label: "Position",
        render: (player: PlayerDto) => player.position,
        keyField: 'playerId'
    },
    {
        label: "Market Value",
        render: (player: PlayerDto) => (
            player.marketValue ? `${player.marketValue.toLocaleString()}€` : 'N/A'
        ),
        keyField: 'playerId'
    },
    {
        label: "Club",
        render: (player: PlayerDto) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                        src={player.club?.logoUrl ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${player.club.logoUrl}` : "/images/default_club_logo.png"} 
                        alt="Default logo" 
                        style={{ width: '20px', height: '20px', marginRight: '8px', borderRadius: '50%' }} 
                />
                <span>{player.club?.name ? player.club.name : 'Unemployed'}</span>
            </div>
        ),
        keyField: 'playerId'
    }
];


const PlayerSearchPage = (props: Props) => {
    const [playersData, setPlayersData] = useState<PlayerDto[]>([]);
    const [clubs, setClubs] = useState<{ clubId: string; name: string }[]>([]);
    const { logoutUser, IsAdmin} = useAuth();
    const errorHandler = new ErrorHandler(logoutUser);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    
    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const clubQuery: ClubQueryObject = {

                };
                const clubsData = await getAllClubsAPI(clubQuery);
                setClubs(clubsData.data.map((club) => ({
                    clubId: club.clubId.toString(),
                    name: club.name,
                })));
            } catch (e: any) {
                errorHandler.handle(e);
            }
        };
        fetchClubs();
    }, []);

    const fields = createFieldsConfig(clubs);

    const handleRowClick = (playerId: string) => {
        navigate(`/player/${playerId}`);
      };
    const handleSearch = async (values: any) => {
        const searchDto: PlayerQueryObject = {
            firstName: values.firstName,
            lastName: values.lastName,
            dateOfBirth: values.dateOfBirth,
            dateOfBirthComparison: values.dateOfBirthComparison,
            nationality: values.nationality,
            position: values.position,
            marketValue: values.marketValue,
            marketValueComparison: values.marketValueComparison,
            filterForUnemployedIfClubIsEmpty: values.filterForUnemployedIfClubIsEmpty,
            sortBy: values.sortBy,
            clubId: values.clubId,
            isDescending: values.sortOrder === 'desc' ? true : false,
            pageSize: 20,
            pageNumber: 1
        };

        try{
            const players = await getAllPlayersAPI(searchDto);
            setPlayersData(players.data);
        }catch(e: any){
            errorHandler.handle(e);
            console.log(e);
            setPlayersData([])
        }     
    };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
        <div>
            <SearchForm fields={fields} onSubmit={handleSearch} />
        </div>
        {IsAdmin() ? (
            <div className="fixed bottom-4 left-4 z-50">
                <AddButton onClick={openModal} label="Add New Player"/>
            </div>
        ) : null}

        {playersData.length === 0 ? (
                <p className="text-lg font-medium text-gray-500 mt-5 text-center italic">
                No players found.
              </p>
            ) : (
                <div style={{ marginTop: '20px', width: '80%' }}>
                    <Table config={config} data={playersData} onRowClick={handleRowClick} />
                </div>
            )}
    </div>
  )
}

export default PlayerSearchPage