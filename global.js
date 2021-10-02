import Constants from 'expo-constants';

const ENV = {
    default: {
        REACT_APP_API_KEY: "AIzaSyByqTiFojkYvQMLIpd9ocON5QijU0crM90",
        REACT_APP_AUTH_DOMAIN: "capstone-c19b7.firebaseapp.com",
        REACT_APP_PROJECT_ID: "capstone-c19b7",
        REACT_APP_STORAGE_BUCKET: "capstone-c19b7.appspot.com",
        REACT_APP_MESSAGING_SENDER_ID: "356757275156",
        REACT_APP_APP_ID: "1:356757275156:web:e7d09969db10ab6bba9d01",
        REACT_APP_MEASUREMENT_ID: "G-7QY3NHY3E8",
    }
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
    return ENV.default;
};

export default getEnvVars;