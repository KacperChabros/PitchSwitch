import axios from 'axios';
import { AddJournalistStatusApplicationDto, JournalistStatusApplicationDto, JournalistStatusApplicationQueryObject, NewJournalistStatusApplicationDto, ReviewJournalistStatusApplicationDto, UpdateJournalistStatusApplicationDto } from '../Dtos/JournalistStatusApplicationDto';
import { PaginatedListDto } from '../Dtos/PaginatedListDto';

const jsaApiUri = `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_API_URL}journaliststatusapplications`;

export const addJournalistApplicationAPI = async (addJSADto: AddJournalistStatusApplicationDto) => {
    const response = await axios.post<NewJournalistStatusApplicationDto>(`${jsaApiUri}/addapplication`, addJSADto);  
    return response;
}

export const getAllJournalistApplicationsAPI = async (jsaQueryObject: JournalistStatusApplicationQueryObject) => {
    const response = await axios.get<PaginatedListDto<JournalistStatusApplicationDto>>(`${jsaApiUri}/getallapplications`, {
        params: jsaQueryObject,
    });
    return response;
};

export const getAllJournalistApplicationsForUserAPI = async (jsaQueryObject: JournalistStatusApplicationQueryObject) => {
    const response = await axios.get<PaginatedListDto<JournalistStatusApplicationDto>>(`${jsaApiUri}/getalliuserapplications`, {
        params: jsaQueryObject,
    });
    return response;
};

export const updateApplicationAPI = async (applicationId: number, updateApplicationDto: UpdateJournalistStatusApplicationDto) => {
    const response = await axios.put<JournalistStatusApplicationDto>(`${jsaApiUri}/updateapplication/${applicationId}`, updateApplicationDto);  
    return response;
}

export const reviewApplicationAPI = async (applicationId: number, reviewApplicationDto: ReviewJournalistStatusApplicationDto) => {
    const response = await axios.put<JournalistStatusApplicationDto>(`${jsaApiUri}/reviewapplication/${applicationId}`, reviewApplicationDto);  
    return response;
}

export const deleteApplicationAPI = async (applicationId: number) => {
    const response = await axios.delete(`${jsaApiUri}/deleteapplication/${applicationId}`);
    return response;
}