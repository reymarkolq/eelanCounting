export type RootStackParamList = {
    Explore: undefined;
    DiseaseDetail: {
        name: string;
        description: string;
        image: any;
        moreInfo: string;
    };
    camera: undefined; // Add this line to inlcude the camera screen
};