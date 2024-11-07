/// <reference types="react-scripts" />
interface ProcessEnv{
    REACT_APP_PITCH_SWITCH_BACKEND_URL: string;
}

interface ImportMeta{
    readonly env: ProcessEnv;
}