import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Context/useAuth';
import ErrorHandler from '../../Helpers/ErrorHandler';
import { useNavigate } from 'react-router-dom';
import { TransferType } from '../../Dtos/TransferDto';
import { getAllMinimalClubsAPI } from '../../Services/ClubService';
import { getAllMinimalPlayersAPI } from '../../Services/PlayerService';
import SearchForm from '../../Components/SearchForm/SearchForm';
import { AddButton } from '../../Components/Buttons/Buttons';
import GenericForm, { FormField } from '../../Components/GenericForm/GenericForm';
import Modal from '../../Components/Modal/Modal';
import Table from '../../Components/Table/Table';
import * as Yup from "yup";
import { toast } from 'react-toastify';
import { AddTransferRumourDto, TransferRumourDto, TransferRumourQueryObject } from '../../Dtos/TransferRumourDto';
import { addTransferRumourAPI, getAllTransferRumoursAPI } from '../../Services/TransferRumourService';

type Props = {}

const createTransferRumourFieldsConfig = (
    clubs: { clubId: string; name: string }[],
    players: { playerId: string; fullname: string }[]
) => {
    return [
        { 
            name: 'transferType', 
            label: 'Transfer Type', 
            type: 'select' as const, 
            placeholder: 'Select transfer type',
            options: [
                { label: 'Permanent', value: '0' },
                { label: 'Loan', value: '1' },
            ],
        },
        { 
            name: 'rumouredFee', 
            label: 'Rumoured Fee', 
            type: 'number' as const, 
            placeholder: 'Enter rumoured fee',
            inputType: 'number' as const
        },
        {
            name: 'rumouredFeeComparison',
            label: 'Rumoured Fee Comparison',
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
            name: 'confidenceLevel',
            label: 'Confidence Level (%)',
            type: 'number' as const,
            placeholder: 'Enter confidence level',
            inputType: 'number' as const,
        },
        {
            name: 'confidenceLevelComparison',
            label: 'Confidence Level Comparison',
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
            name: 'playerId',
            label: 'Player',
            type: 'select' as const,
            placeholder: 'Select player',
            options: players.map((player) => ({
                label: player.fullname,
                value: player.playerId,
            })),
        },
        {
            name: 'sellingClubId',
            label: 'Selling Club',
            type: 'select' as const,
            placeholder: 'Select selling club',
            options: clubs.map((club) => ({
                label: club.name,
                value: club.clubId,
            })),
        },
        {
            name: 'filterForEmptySellingClubIfEmpty',
            label: 'Without Selling Club?',
            type: 'checkbox' as const,
            defaultValue: false
        },
        {
            name: 'buyingClubId',
            label: 'Buying Club',
            type: 'select' as const,
            placeholder: 'Select buying club',
            options: clubs.map((club) => ({
                label: club.name,
                value: club.clubId,
            })),
        },
        {
            name: 'filterForEmptyBuyingClubIfEmpty',
            label: 'Without Buying Club?',
            type: 'checkbox' as const,
            defaultValue: false
        },
        {
            name: 'sortBy',
            label: 'Sort by',
            type: 'select' as const,
            placeholder: 'Choose field',
            options: [
                { label: 'Rumoured Fee', value: 'rumouredFee' },
                { label: 'Confidence Level', value: 'confidenceLevel' },
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
};

const transferRumoursConfig = [
    {
        label: "Player",
        render: (rumour: TransferRumourDto) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                    src={rumour.player.photoUrl 
                        ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${rumour.player.photoUrl}`
                        : "/images/default_player_photo.png"
                    } 
                    alt="Player Photo" 
                    style={{ width: '20px', height: '20px', marginRight: '8px', borderRadius: '50%' }}
                />
                <span>{rumour.player.firstName} {rumour.player.lastName}</span>
            </div>
        ),
        keyField: 'transferRumourId'
    },
    {
        label: "Transfer Type",
        render: (rumour: TransferRumourDto) => TransferType[rumour.transferType],
        keyField: 'transferRumourId'
    },
    {
        label: "Rumoured Fee",
        render: (rumour: TransferRumourDto) => (
            rumour.rumouredFee ? `${rumour.rumouredFee.toLocaleString()}€` : 'Undisclosed'
        ),
        keyField: 'transferRumourId'
    },
    {
        label: "Confidence Level",
        render: (rumour: TransferRumourDto) => `${rumour.confidenceLevel}%`,
        keyField: 'transferRumourId'
    },
    {
        label: "Selling Club",
        render: (rumour: TransferRumourDto) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                    src={rumour.sellingClub?.logoUrl 
                        ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${rumour.sellingClub.logoUrl}`
                        : "/images/default_club_logo.png"
                    } 
                    alt="Selling Club Logo" 
                    style={{ width: '20px', height: '20px', marginRight: '8px', borderRadius: '50%' }}
                />
                <span>{rumour.sellingClub?.name || 'Free Agent'}</span>
            </div>
        ),
        keyField: 'transferRumourId'
    },
    {
        label: "Buying Club",
        render: (rumour: TransferRumourDto) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                    src={rumour.buyingClub?.logoUrl 
                        ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${rumour.buyingClub.logoUrl}`
                        : "/images/default_club_logo.png"
                    } 
                    alt="Buying Club Logo" 
                    style={{ width: '20px', height: '20px', marginRight: '8px', borderRadius: '50%' }}
                />
                <span>{rumour.buyingClub?.name || 'N/A'}</span>
            </div>
        ),
        keyField: 'transferRumourId'
    },
    {
        label: "Created By",
        render: (rumour: TransferRumourDto) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                    src={rumour.createdByUser?.profilePictureUrl 
                        ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${rumour.createdByUser.profilePictureUrl}`
                        : "/images/default_user_picture.png"
                    } 
                    alt="User Picture" 
                    style={{ width: '20px', height: '20px', marginRight: '8px', borderRadius: '50%' }}
                />
                <span>{rumour.createdByUser?.userName || 'Unknown'}</span>
            </div>
        ),
        keyField: 'transferRumourId'
    },
    {
        label: "Status",
        render: (rumour: TransferRumourDto) => (
            rumour.isConfirmed ? 'Confirmed' : rumour.isArchived ? 'Archived' : 'Pending'
        ),
        keyField: 'transferRumourId'
    }
];


const createAddTransferRumourFieldsConfig = (
    clubs: { clubId: string; name: string }[],
    players: { playerId: string; fullname: string }[]
) => {
    const addTransferRumourFields: FormField[] = [
        {
            name: "playerId",
            label: "Player",
            initialValue: "",
            type: "select",
            options: players.map((player) => ({
                label: player.fullname,
                value: player.playerId
            })),
            validationSchema: Yup.number().required("Player selection is required")
        },
        {
            name: "buyingClubId",
            label: "Buying Club",
            initialValue: "",
            type: "select",
            options: [
                { label: "Unemployed", value: "" },
                ...clubs.map((club) => ({
                    label: club.name,
                    value: club.clubId
                }))
            ],
            validationSchema: Yup.number().nullable()
        },
        {
            name: "transferType",
            label: "Transfer Type",
            initialValue: "",
            type: "select",
            options: [
                { label: "Permanent", value: 0 },
                { label: "Loan", value: 1 },
            ],
            validationSchema: Yup.string().required("Transfer type is required")
        },
        {
            name: "rumouredFee",
            label: "Rumoured Fee (€)",
            initialValue: "",
            type: "number",
            validationSchema: Yup.number()
                .required("Rumoured fee is required")
                .min(0, "Rumoured fee can't be negative")
                .max(1000000000, "Rumoured fee can't be more than 1,000,000,000")
        },
        {
            name: "confidenceLevel",
            label: "Confidence Level (%)",
            initialValue: 50,
            type: "number",
            validationSchema: Yup.number()
                .required("Confidence level is required")
                .min(0, "Confidence level can't be less than 0%")
                .max(100, "Confidence level can't be more than 100%")
        },
    ];
    return addTransferRumourFields;
};




const TransferSearchPages = (props: Props) => {
    const [transferRumoursData, setTransferRumoursData] = useState<TransferRumourDto[]>([]);
    const [clubs, setClubs] = useState<{ clubId: string; name: string }[]>([]);
    const [players, setPlayers] = useState<{ playerId: string; fullname: string }[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const { logoutUser, IsAdmin, IsJournalist} = useAuth();
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

        const fetchPlayers = async () => {
            try {
                const playersData = await getAllMinimalPlayersAPI();
                setPlayers(playersData.data.map((player) => ({
                    playerId: player.playerId.toString(),
                    fullname: `${player.firstName} ${player.lastName}`,
                })));
            } catch (e: any) {
                errorHandler.handle(e);
            }
        }
        fetchClubs();
        fetchPlayers();
    }, []);

    const handleRowClick = (transferRumourId: string) => {
        navigate(`/transferrumour/${transferRumourId}`);
      };
    const handleSearch = async (values: any) => {
        const searchDto: TransferRumourQueryObject = {
            transferType: values.transferType,
            rumouredFee: values.rumouredFee,
            rumouredFeeComparison: values.rumouredFeeComparison,
            confidenceLevel: values.confidenceLevel,
            confidenceLevelComparison: values.confidenceLevelComparison,
            playerId: values.playerId,
            sellingClubId: values.sellingClubId,
            buyingClubId: values.buyingClubId,
            filterForEmptySellingClubIfEmpty: values.filterForEmptySellingClubIfEmpty,
            filterForEmptyBuyingClubIfEmpty: values.filterForEmptyBuyingClubIfEmpty,
            sortBy: values.sortBy,
            isDescending: values.sortOrder === 'desc' ? true : false,
            pageSize: pageSize,
            pageNumber: pageNumber
        };

        try {
            const transfersRumours = await getAllTransferRumoursAPI(searchDto);
            setTransferRumoursData(transfersRumours.data.items);
            setTotalCount(transfersRumours.data.totalCount);
        } catch (e: any) {
            errorHandler.handle(e);
            console.log(e);
            setTransferRumoursData([]);
            setTotalCount(0);
        }    
    };

    const handleAddSubmit = async (addedFields: { [key: string]: string | number | File | null | boolean | Date }) => {
        const addTransferRumourDto: AddTransferRumourDto = {
            transferType: addedFields.transferType as number,
            rumouredFee: addedFields.rumouredFee as number,
            confidenceLevel: addedFields.confidenceLevel as number,
            playerId: addedFields.playerId as number,
            buyingClubId: addedFields.buyingClubId !== '' ? addedFields.buyingClubId as number : null,
        };
        try{
            const response = await addTransferRumourAPI(addTransferRumourDto);
            toast.success("Transfer Rumour has been added!");
        }catch(e: any){
          errorHandler.handle(e);
        }finally{
            setIsModalOpen(false);
        }  
    }

    const fields = createTransferRumourFieldsConfig(clubs, players);
    const addTransferRumourFields = createAddTransferRumourFieldsConfig(clubs, players);
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
        {IsAdmin() || IsJournalist() ? (
            <div className="fixed bottom-4 left-4 z-50">
                <AddButton onClick={openModal} label="Add New Transfer Rumour"/>
            </div>
        ) : null}

        {transferRumoursData.length === 0 ? (
                <p className="text-lg font-medium text-gray-500 mt-5 text-center italic">
                No transfers rumours found.
              </p>
            ) : (
                <div style={{ marginTop: '20px', width: '80%' }}>
                    <Table config={transferRumoursConfig} data={transferRumoursData} onRowClick={handleRowClick} />
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                
                <GenericForm fields={addTransferRumourFields} onSubmit={handleAddSubmit} />
            </Modal>
    </div>
  )
}

export default TransferSearchPages