import axios from 'axios';

const imageApiUri = `${process.env.REACT_APP_PITCH_SWITCH_BACKEND_API_URL}images`;

export const addImageAPI = async (entityType: string, formFile: File) => {
    const formData = new FormData();
    formData.append("entityType", entityType);
    formData.append("formFile", formFile);
    const response = await axios.post<string>(`${imageApiUri}/uploadimage`, {
        entityType: entityType,
        formFile: formFile
    }, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });   
    return response;
};