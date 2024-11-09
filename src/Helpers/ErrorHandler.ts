import { toast } from 'react-toastify';

class ErrorHandler {
    private logoutUser: () => void;

    constructor(logoutUser: () => void) {
        this.logoutUser = logoutUser;
    }

    public handle(error: any): void {
        if (error.name === 'AxiosError') {
            if (error.status === 401) {
                this.logoutUser();
            } else if (error.status === 404) {
                toast.warning(`Error: ${error.response?.data}`);
            } else {
                toast.error(error.response?.data || `Error: ${error.message}`);
            }
        } else {
            toast.error(`Unexpected error: ${error.message}`);
        }
    }
}

export default ErrorHandler;