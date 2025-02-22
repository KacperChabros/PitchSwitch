import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Context/useAuth';
import ErrorHandler from '../../Helpers/ErrorHandler';
import { useNavigate } from 'react-router-dom';
import { AddTransferDto, TransferDto, TransferQueryObject, TransferType } from '../../Dtos/TransferDto';
import { getAllMinimalClubsAPI } from '../../Services/ClubService';
import { getAllMinimalPlayersAPI } from '../../Services/PlayerService';
import SearchForm from '../../Components/SearchForm/SearchForm';
import { addTransferAPI, getAllTransfersAPI } from '../../Services/TransferService';
import { AddButton } from '../../Components/Buttons/Buttons';
import GenericForm, { FormField } from '../../Components/GenericForm/GenericForm';
import Modal from '../../Components/Modal/Modal';
import Table from '../../Components/Table/Table';
import * as Yup from "yup";
import { toast } from 'react-toastify';

type Props = {}

const createTransferFieldsConfig = (
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
                { label: 'Permanent', value: "0" },
                { label: 'Loan', value: "1" },
            ],
        },
        { 
            name: 'transferDate', 
            label: 'Transfer Date', 
            type: 'date' as const, 
            placeholder: 'Enter transfer date',
            inputType: 'date' as const
        },
        {
            name: 'transferDateComparison',
            label: 'Transfer Date Comparison',
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
            name: 'transferFee', 
            label: 'Transfer Fee', 
            type: 'number' as const, 
            placeholder: 'Enter transfer fee',
            inputType: 'number' as const
        },
        {
            name: 'transferFeeComparison',
            label: 'Transfer Fee Comparison',
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
                { label: 'Transfer Date', value: 'transferDate' },
                { label: 'Transfer Fee', value: 'transferFee' },
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

const transferConfig = [
    {
        label: "Player",
        render: (transfer: TransferDto) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                    src={transfer.player.photoUrl 
                        ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${transfer.player.photoUrl}`
                        : "/images/default_player_photo.png"
                    } 
                    alt="Buying Club Logo" 
                    style={{ width: '20px', height: '20px', marginRight: '8px', borderRadius: '50%' }}
                />
                <span>{transfer.player.firstName} {transfer.player.lastName}</span>
            </div>
        ),
        keyField: 'transferId'
    },
    {
        label: "Transfer Type",
        render: (transfer: TransferDto) => TransferType[transfer.transferType],
        keyField: 'transferId'
    },
    {
        label: "Transfer Date",
        render: (transfer: TransferDto) => (
            transfer.transferDate ? new Date(transfer.transferDate).toLocaleDateString() : 'N/A'
        ),
        keyField: 'transferId'
    },
    {
        label: "Transfer Fee",
        render: (transfer: TransferDto) => (
            transfer.transferFee ? `${transfer.transferFee.toLocaleString()}€` : 'Free Transfer'
        ),
        keyField: 'transferId'
    },
    {
        label: "Selling Club",
        render: (transfer: TransferDto) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                    src={transfer.sellingClub?.logoUrl 
                        ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${transfer.sellingClub.logoUrl}`
                        : "/images/default_club_logo.png"
                    } 
                    alt="Selling Club Logo" 
                    style={{ width: '20px', height: '20px', marginRight: '8px', borderRadius: '50%' }}
                />
                <span>{transfer.sellingClub?.name ? transfer.sellingClub.name : 'Free Agent'}</span>
            </div>
        ),
        keyField: 'transferId'
    },
    {
        label: "Buying Club",
        render: (transfer: TransferDto) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                    src={transfer.buyingClub?.logoUrl 
                        ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${transfer.buyingClub.logoUrl}`
                        : "/images/default_club_logo.png"
                    } 
                    alt="Buying Club Logo" 
                    style={{ width: '20px', height: '20px', marginRight: '8px', borderRadius: '50%' }}
                />
                <span>{transfer.buyingClub?.name ? transfer.buyingClub.name : 'N/A'}</span>
            </div>
        ),
        keyField: 'transferId'
    }
];

const createAddTransferFieldsConfig = (
    clubs: { clubId: string; name: string }[],
    players: { playerId: string; fullname: string }[]
) => {
    const addTransferFields: FormField[] = [
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
            name: "sellingClubId",
            label: "Selling Club",
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
            name: "transferDate",
            label: "Transfer Date",
            initialValue: new Date(),
            type: "date",
            validationSchema: Yup.date()
                .required("Transfer date is required")
                .max(new Date(), "Transfer date must be in the past")
        },
        {
            name: "transferFee",
            label: "Transfer Fee (€)",
            initialValue: "",
            type: "number",
            validationSchema: Yup.number()
                .required("Transfer fee is required")
                .min(0, "Transfer fee can't be negative")
                .max(1000000000, "Transfer fee can't be more than 1,000,000,000")
        },
    ];
    return addTransferFields;
};




const TransferSearchPages = (props: Props) => {
    const [transfersData, setTransfersData] = useState<TransferDto[]>([]);
    const [clubs, setClubs] = useState<{ clubId: string; name: string }[]>([]);
    const [players, setPlayers] = useState<{ playerId: string; fullname: string }[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
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

    const handleRowClick = (transferId: string) => {
        navigate(`/transfer/${transferId}`);
      };
    const handleSearch = async (values: any) => {
        const searchDto: TransferQueryObject = {
            transferType: values.transferType,
            transferDate: values.transferDate,
            transferDateComparison: values.transferDateComparison,
            transferFee: values.transferFee,
            transferFeeComparison: values.transferFeeComparison,
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
            const transfers = await getAllTransfersAPI(searchDto);
            setTransfersData(transfers.data.items);
            setTotalCount(transfers.data.totalCount);
        } catch (e: any) {
            errorHandler.handle(e);
            console.log(e);
            setTransfersData([]);
            setTotalCount(0);
        }    
    };

    const handleAddSubmit = async (addedFields: { [key: string]: string | number | File | null | boolean | Date }) => {
        const addTransferDto: AddTransferDto = {
            transferType: addedFields.transferType as number,
            transferDate: addedFields.transferDate as Date,
            transferFee: addedFields.transferFee as number,
            playerId: addedFields.playerId as number,
            sellingClubId: addedFields.sellingClubId !== '' ? addedFields.sellingClubId as number : null,
            buyingClubId: addedFields.buyingClubId !== '' ? addedFields.buyingClubId as number : null,
        };
        try{
            const response = await addTransferAPI(addTransferDto);
            toast.success("Transfer has been added!");
        }catch(e: any){
          errorHandler.handle(e);
        }finally{
            setIsModalOpen(false);
        }  
    }

    const fields = createTransferFieldsConfig(clubs, players);
    const addTransferFields = createAddTransferFieldsConfig(clubs, players);
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
                <AddButton onClick={openModal} label="Add New Transfer"/>
            </div>
        ) : null}

        {transfersData.length === 0 ? (
                <p className="text-lg font-medium text-gray-500 mt-5 text-center italic">
                No transfers found.
              </p>
            ) : (
                <div style={{ marginTop: '20px', width: '80%' }}>
                    <Table config={transferConfig} data={transfersData} onRowClick={handleRowClick} />
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                    Add Transfer
                </h1>
                <GenericForm fields={addTransferFields} onSubmit={handleAddSubmit} />
            </Modal>
    </div>
  )
}

export default TransferSearchPages