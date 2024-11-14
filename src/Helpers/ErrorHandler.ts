import { toast } from 'react-toastify';

class ErrorHandler {
    private logoutUser: () => void;

    constructor(logoutUser: () => void) {
        this.logoutUser = logoutUser;
    }

    private handleErrors(errors: { [key: string]: string[] | string }): void {
        Object.entries(errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
                messages.forEach((message) => {
                    toast.error(`${field}: ${message}`);
                });
            } else {
                toast.error(`${field}: ${messages}`);
            }
        });
    }

    public handle(error: any): void {
        if (error.name === 'AxiosError') {
            if (error.response?.status === 401) {
                this.logoutUser();
                toast.error("You've been logged out");
            } else if(error.response?.status === 403){
                toast.error("You are not allowed to perform this action");
            } else if (error.response?.status === 404) {
                toast.warning(`Error: ${error.response?.data}`);
            } else {
                if (error.response?.data?.errors) {
                    this.handleErrors(error.response.data.errors);
                } else if (error.response?.data?.message){
                    toast.error(error.response.data.message);
                }else{
                    toast.error(error.response?.data || `Error: ${error.message}`);
                }
            }
        } else {
            toast.error(`Unexpected error: ${error.message}`);
        }
    }
}

export default ErrorHandler;
