import React, { useState } from 'react';import { Input, Select, Button, Form, Row, Col } from 'antd';
import SearchForm from '../../Components/SearchForm/SearchForm';
import { AddClubDto, ClubDto, ClubQueryObject } from '../../Dtos/ClubDto';
import { addClubAPI, getAllClubsAPI } from '../../Services/ClubService';
import { toast } from 'react-toastify';
import Table from '../../Components/Table/Table';
import { useAuth } from '../../Context/useAuth';
import ErrorHandler from '../../Helpers/ErrorHandler';
import { useNavigate } from 'react-router-dom';
import Modal from '../../Components/Modal/Modal';
import GenericForm, { FormField } from '../../Components/GenericForm/GenericForm';
import * as Yup from "yup";
import { AddButton } from '../../Components/Buttons/Buttons';

type Props = {}

const createFieldsConfig = (isAdmin: boolean) => {
    const fields = [
        { 
            name: 'name', 
            label: 'Name', 
            type: 'input' as const, 
            placeholder: 'Enter name',
        },
        { 
            name: 'shortname', 
            label: 'Shortname', 
            type: 'input' as const, 
            placeholder: 'Enter shortname' 
        },
        { 
            name: 'league', 
            label: 'League', 
            type: 'input' as const, 
            placeholder: 'Enter league' 
        },
        { 
            name: 'country', 
            label: 'Country', 
            type: 'input' as const, 
            placeholder: 'Enter country' 
        },
        {
            name: 'sortBy',
            label: 'Sort by',
            type: 'select' as const,
            placeholder: 'Choose field',
            options: [
                { label: 'Name', value: 'name' },
                { label: 'Shortname', value: 'shortname' },
                { label: 'League', value: 'league' },
                { label: 'Country', value: 'country' },
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
            defaultValue: 'desc'
        },
        ...(isAdmin ? [{
            name: 'includeArchived',
            label: 'Include Archived?',
            type: 'checkbox' as const,
            placeholder: 'IncludeArchived?',
            defaultValue: false
        }] : []),
      ];
    return fields;
  };



const config = [
    {
        label: "Logo",
        render: (club: ClubDto) => <img src={club.logoUrl && club.logoUrl.trim().length > 0
            ? `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_URL}${club.logoUrl}` : "/images/default_club_logo.png"
         } alt={club.name} style={{ width: '40px', height: '40px' }} />,
        keyField: 'clubId'
    },
    {
      label: "Name",
      render: (club: ClubDto) => club.name,
      keyField: 'clubId'
    },
    {
        label: "Shortname",
        render: (club: ClubDto) => club.shortName,
        keyField: 'clubId'
    },
    {
        label: "League",
        render: (club: ClubDto) => club.league,
        keyField: 'clubId'
    },
    {
        label: "Country",
        render: (club: ClubDto) => club.country,
        keyField: 'clubId'
    }
]

const addClubFields: FormField[] = [
    { name: "name", label: "Name", initialValue: "", type: "text", validationSchema: Yup.string().required("Name is required").min(3, "Name must be at least 3 characters").max(255, "Name can't be more than 255 characters") },
    { name: "shortName", label: "Short Name", initialValue: "", type: "text", validationSchema: Yup.string().required("Shortname is required").min(2, "Shortname must be at least 2 characters").max(5, "Shortname can't be more than 5 characters") },
    { name: "league", label: "League", initialValue: "", type: "select", options: [
        { label: "Premier League", value: "Premier League" },
        { label: "La Liga", value: "La Liga" },
        { label: "Serie A", value: "Serie A" },
        { label: "Bundesliga", value: "Bundesliga" },
        { label: "Ligue 1", value: "Ligue 1" },
    ], validationSchema: Yup.string().required("League is required") },
    { name: "country", label: "Country", initialValue: "", type: "text", validationSchema: Yup.string().required("Country is required").min(3, "Country must be at least 3 characters").max(150, "Country can't be more than 150 characters") },
    { name: "city", label: "City", initialValue: "", type: "text", validationSchema: Yup.string().required("City is required").min(3, "City must be at least 3 characters").max(150, "City can't be more than 150 characters") },
    { name: "foundationYear", label: "Foundation Year", initialValue: new Date().getFullYear(), type: "number", validationSchema: Yup.number().min(1800, "Year must be later than 1800").max(new Date().getFullYear(), "Year can't be more than current year").required("Foundation Year is required") },
    { name: "stadium", label: "Stadium", initialValue: "", type: "text", validationSchema: Yup.string().required("Stadium is required").min(3, "Stadium must be at least 3 characters").max(255, "Stadium can't be more than 255 characters") },
    { name: "logo", label: "Logo", initialValue: null, type: "file"},
  ];
  

const ClubSearchPage = (props: Props) => {
    const [clubsData, setClubsData] = useState<ClubDto[]>([]);
    const { logoutUser, IsAdmin} = useAuth();
    const errorHandler = new ErrorHandler(logoutUser);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fields = createFieldsConfig(IsAdmin());

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleRowClick = (clubId: string) => {
        navigate(`/club/${clubId}`);
      };
    const handleSearch = async (values: any) => {
        const searchDto: ClubQueryObject = {
            name: values.name,
            shortname: values.shortname,
            league: values.league,
            country: values.country,
            includeArchived: values.includeArchived ? (values.includeArchived === 'true' ? true : false) : false,
            sortBy: values.sortBy,
            isDescending: values.sortOrder === 'desc' ? true : false,
            pageSize: 20,
            pageNumber: 1
        };

        try{
            const clubs = await getAllClubsAPI(searchDto);
            setClubsData(clubs.data);
        }catch(e: any){
            errorHandler.handle(e);
            console.log(e);
            setClubsData([])
        }     
    };

    const handleAddSubmit = async (updatedFields: { [key: string]: string | number | File | null | boolean }) => {
        const addClubDto: AddClubDto = {
            name: updatedFields.name as string,
            shortName: updatedFields.shortName as string,
            league: updatedFields.league as string,
            country: updatedFields.country as string,
            city: updatedFields.city as string,
            foundationYear: updatedFields.foundationYear as number,
            stadium: updatedFields.stadium as string,
            Logo: updatedFields.logo as File,
        };
        try{
            const response = await addClubAPI(addClubDto);
            toast.success("Club has been added!");
        }catch(e: any){
          errorHandler.handle(e);
        }finally{
            setIsModalOpen(false);
        }  
    }



    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
            <SearchForm fields={fields} onSubmit={handleSearch} />
            {IsAdmin() ? (<div className="fixed bottom-4 left-4 z-50">
                <AddButton onClick={openModal} label="Add New Club" />
            </div>) :(null)}

            {clubsData.length === 0 ? (
                <p className="text-lg font-medium text-gray-500 mt-5 text-center italic">
                No clubs found.
              </p>
            ) : (
                <div style={{ marginTop: '20px', width: '80%' }}>
                    <Table config={config} data={clubsData} onRowClick={handleRowClick} />
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <GenericForm fields={addClubFields} onSubmit={handleAddSubmit} />
            </Modal>
        </div>
  )
}

export default ClubSearchPage