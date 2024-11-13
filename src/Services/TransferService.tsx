import axios from 'axios';
import { AddTransferDto, MinimalTransferDto, NewTransferDto, TransferDto, TransferQueryObject, UpdateTransferDto } from '../Dtos/TransferDto';
import { PaginatedListDto } from '../Dtos/PaginatedListDto';

const transferApiUrl = `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_API_URL}transfers`;

export const getAllTransfersAPI = async (transferQueryObject: TransferQueryObject) => {
    const response = await axios.get<PaginatedListDto<TransferDto>>(`${transferApiUrl}/gettransfers`, {
        params: transferQueryObject,
    });
    return response;
};

export const getAllMinimalTransfersAPI = async () => {
    const response = await axios.get<MinimalTransferDto[]>(`${transferApiUrl}/getallmintransfers`);
    return response;
};

export const addTransferAPI = async (addTransferDto: AddTransferDto) => {
    const response = await axios.post<NewTransferDto>(`${transferApiUrl}/addtransfer`, addTransferDto);  
    return response;
}

export const getTransferByIdAPI = async (transferId: number) => {
    const response = await axios.get<TransferDto>(`${transferApiUrl}/gettransfer/${transferId}`);
    return response;
}

export const updateTransferAPI = async (transferId: number, updateTransferDto: UpdateTransferDto) => {
    const response = await axios.put<TransferDto>(`${transferApiUrl}/updatetransfer/${transferId}`, updateTransferDto);  
    return response;
}

export const deleteTransferAPI = async (transferId: number) => {
    const response = await axios.delete(`${transferApiUrl}/deletetransfer/${transferId}`);
    return response;
}