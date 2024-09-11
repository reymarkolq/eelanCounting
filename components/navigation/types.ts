// Define your RootStackParamlist
export type RootStackParamList = {
    camera: { gallery?: boolean }; // Allow camera screen to accept an optional "gallery" parameter
    explore: {
        photo: { uri: string }; // photo with a URI
        count: number | null;   // eel count or null
    };
};
