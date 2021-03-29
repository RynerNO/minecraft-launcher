interface loginData {
    email: string,
    password: string

}

interface registerData {
    email: string,
    name: string,
    password: string
}


interface Window {
        config: {
            AUTH_URL: string
        };
    }
  
interface authResponse {
    id: string;
    name: string;
    selectedProfile: {
        id: string;
        name: string;
        legacy: boolean;
    };
    userProperties: {};
    token: string;
    accessToken: string;
    clientToken: string;
    avaliableProfiles: {};
    status: boolean;
    
}