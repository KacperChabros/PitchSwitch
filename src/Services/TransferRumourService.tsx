import axios from 'axios';
import { AddTransferRumourDto, NewTransferRumourDto, TransferRumourDto, TransferRumourQueryObject, UpdateTransferRumourDto } from '../Dtos/TransferRumourDto';
import { PaginatedListDto } from '../Dtos/PaginatedListDto';

const transferRumourApiUrl = `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_API_URL}transferrumours`;

export const getAllTransferRumoursAPI = async (transferRumourQueryObject: TransferRumourQueryObject) => {
    const response = await axios.get<PaginatedListDto<TransferRumourDto>>(`${transferRumourApiUrl}/gettransferrumours`, {
        params: transferRumourQueryObject,
    });
    return response;
};

export const addTransferRumourAPI = async (addTransferRumourDto: AddTransferRumourDto) => {
    const response = await axios.post<NewTransferRumourDto>(`${transferRumourApiUrl}/addtransferrumour`, addTransferRumourDto);  
    return response;
}

export const getTransferRumourByIdAPI = async (transferRumourId: number) => {
    const response = await axios.get<TransferRumourDto>(`${transferRumourApiUrl}/gettransferrumour/${transferRumourId}`);
    return response;
}

export const updateTransferRumourAPI = async (transferRumourId: number, updateTransferRumourDto: UpdateTransferRumourDto) => {
    const response = await axios.put<TransferRumourDto>(`${transferRumourApiUrl}/updatetransferrumour/${transferRumourId}`, updateTransferRumourDto);  
    return response;
}

export const archiveTransferRumourAPI = async (transferRumourId: number, isConfirmed: boolean) => {
    const response = await axios.put<TransferRumourDto>(`${transferRumourApiUrl}/archivetransferrumour/${transferRumourId}?isConfirmed=${isConfirmed}`);
    return response;
}

export const deleteTransferRumourAPI = async (transferRumourId: number) => {
    const response = await axios.delete(`${transferRumourApiUrl}/deletetransferrumour/${transferRumourId}`);
    return response;
}