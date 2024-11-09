import React, { useState } from 'react';import { Input, Select, Button, Form, Row, Col } from 'antd';
import SearchForm from '../../Components/SearchForm/SearchForm';
import { ClubDto, ClubQueryObject } from '../../Dtos/ClubDto';
import { getAllClubsAPI } from '../../Services/ClubService';
import { toast } from 'react-toastify';
import Table from '../../Components/Table/Table';
import { useAuth } from '../../Context/useAuth';
import ErrorHandler from '../../Helpers/ErrorHandler';
import { useNavigate } from 'react-router-dom';
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
            label: 'Short name', 
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
            label: '',
            type: 'select' as const,
            placeholder: 'Choose type',
            options: [
                { label: 'Asc', value: 'asc' },
                { label: 'Desc', value: 'desc' },
            ],
            defaultValue: 'desc'
        },
        ...(isAdmin ? [{
            name: 'includeArchived',
            label: 'Include\nArchived?',
            type: 'select' as const,
            placeholder: 'IncludeArchived?',
            options: [
                { label: 'No', value: 'false' },
                { label: 'Yes', value: 'true' },
            ],
            defaultValue: 'false'
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

const ClubSearchPage = (props: Props) => {
    const [clubsData, setClubsData] = useState<ClubDto[]>([]);
    const { logoutUser, IsAdmin} = useAuth();
    const errorHandler = new ErrorHandler(logoutUser);
    const navigate = useNavigate();

    const fields = createFieldsConfig(IsAdmin());

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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}>
            <SearchForm fields={fields} onSubmit={handleSearch} />
            
            {clubsData.length === 0 ? (
                <p className="text-lg font-medium text-gray-500 mt-5 text-center italic">
                No clubs found.
              </p>
            ) : (
                <div style={{ marginTop: '20px', width: '80%' }}>
                    <Table config={config} data={clubsData} onRowClick={handleRowClick} />
                </div>
            )}
        </div>
  )
}

export default ClubSearchPage