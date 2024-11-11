import React, { useEffect, useState } from 'react'
import SearchForm from '../../Components/SearchForm/SearchForm';
import { AddButton } from '../../Components/Buttons/Buttons';
import ErrorHandler from '../../Helpers/ErrorHandler';
import { useAuth } from '../../Context/useAuth';
import { useNavigate } from 'react-router-dom';
import { AddPlayerDto, PlayerDto, PlayerQueryObject } from '../../Dtos/PlayerDto';
import { addPlayerAPI, getAllPlayersAPI } from '../../Services/PlayerService';
import Table from '../../Components/Table/Table';
import { getAllClubsAPI, getAllMinimalClubsAPI } from '../../Services/ClubService';
import { ClubDto, ClubQueryObject } from '../../Dtos/ClubDto';
import Modal from '../../Components/Modal/Modal';
import GenericForm, { FormField } from '../../Components/GenericForm/GenericForm';
import { toast } from 'react-toastify';
import * as Yup from "yup";

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

const createAddFieldsConfig = (clubs: { clubId: string; name: string }[]) => {
    const addPlayerFields: FormField[] = [
        { 
            name: "firstName", 
            label: "First Name", 
            initialValue: "", 
            type: "text", 
            validationSchema: Yup.string().required("First name is required").min(2, "First name must be at least 2 characters").max(100, "First name can't be more than 100 characters") 
        },
        { 
            name: "lastName", 
            label: "Last Name", 
            initialValue: "", 
            type: "text", 
            validationSchema: Yup.string().required("Last name is required").min(2, "Last name must be at least 2 characters").max(100, "Last name can't be more than 100 characters") 
        },
        {
            name: "dateOfBirth",
            label: "Date of Birth",
            initialValue: "",
            type: "date",
            validationSchema: Yup.date()
                .required("Date of birth is required")
                .max(new Date(), "Date of birth must be in the past")
        },
        { 
            name: "nationality", 
            label: "Nationality", 
            initialValue: "", 
            type: "text", 
            validationSchema: Yup.string().required("Nationality is required").min(2, "Nationality must be at least 2 characters").max(100, "Nationality can't be more than 100 characters") 
        },
        { 
            name: "position", 
            label: "Position", 
            initialValue: "", 
            type: "text", 
            validationSchema: Yup.string().required("Position is required").min(2, "Position must be at least 2 characters").max(100, "Position can't be more than 100 characters") 
        },
        { 
            name: "height", 
            label: "Height (cm)", 
            initialValue: "", 
            type: "number", 
            validationSchema: Yup.number().required("Height is required").min(100, "Height must be at least 100 cm").max(230, "Height can't be more than 230 cm") 
        },
        { 
            name: "weight", 
            label: "Weight (kg)", 
            initialValue: "", 
            type: "number", 
            validationSchema: Yup.number().required("Weight is required").min(30, "Weight must be at least 30 kg").max(200, "Weight can't be more than 200 kg") 
        },
        { 
            name: "preferredFoot", 
            label: "Preferred Foot", 
            initialValue: "", 
            type: "select", 
            options: [
                { label: "Left", value: 0 },
                { label: "Right", value: 1 },
                { label: "Both", value: 2 },
            ],
            validationSchema: Yup.string().required("Preferred foot is required") 
        },
        { 
            name: "marketValue", 
            label: "Market Value (€)", 
            initialValue: "", 
            type: "number", 
            validationSchema: Yup.number().required("Market value is required").min(0, "Market value can't be negative").max(1000000000, "Market value can't be more than 1000000000")
        },
        {
            name: "clubId",
            label: "Club",
            initialValue: "",
            type: "select",
            options: [
                { label: "Unemployed", value: "" },
                ...clubs.map((club) => ({
                    label: club.name,
                    value: club.clubId,
                })),
            ],
            validationSchema: Yup.number().nullable()
        },
        { 
            name: "photo", 
            label: "Photo", 
            initialValue: null, 
            type: "file", 
            validationSchema: Yup.mixed().nullable()
        },
    ];
    return addPlayerFields;
}

const config = [
    {
        label: "Photo",
        render: (player: PlayerDto) => (
            <img 
                src={player.photoUrl && player.photoUrl.trim().length > 0
                    ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${player.photoUrl}`
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
    const [totalCount, setTotalCount] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(2);
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
                const clubsData = await getAllMinimalClubsAPI();
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
            pageSize: pageSize,
            pageNumber: pageNumber
        };

        try {
            const players = await getAllPlayersAPI(searchDto);
            setPlayersData(players.data.items);
            setTotalCount(players.data.totalCount);
        } catch (e: any) {
            errorHandler.handle(e);
            console.log(e);
            setPlayersData([]);
            setTotalCount(0);
        }    
    };
    const addClubFields = createAddFieldsConfig(clubs);
    const handleAddSubmit = async (addedFields: { [key: string]: string | number | File | null | boolean | Date }) => {
        const addPlayerDto: AddPlayerDto = {
            firstName: addedFields.firstName as string,
            lastName: addedFields.lastName as string,
            dateOfBirth: addedFields.dateOfBirth as Date,
            nationality: addedFields.nationality as string,
            position: addedFields.position as string,
            height: addedFields.height as number,
            weight: addedFields.weight as number,
            preferredFoot: addedFields.preferredFoot as number,
            marketValue: addedFields.marketValue as number,
            photo: addedFields.photo as File,
            clubId: addedFields.clubId !== '' ? addedFields.clubId as number : null,

        };
        try{
            const response = await addPlayerAPI(addPlayerDto);
            toast.success("Player has been added!");
        }catch(e: any){
          errorHandler.handle(e);
        }finally{
            setIsModalOpen(false);
        }  
    }

    const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
        <div>
        <SearchForm fields={fields} onSubmit={handleSearch} 
                                totalPages={totalPages}
                                currentPage={pageNumber}
                                onPageChange={setPageNumber}
            />
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

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <GenericForm fields={addClubFields} onSubmit={handleAddSubmit} />
            </Modal>
    </div>
  )
}

export default PlayerSearchPage