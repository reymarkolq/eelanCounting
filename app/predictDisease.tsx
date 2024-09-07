const predictDisease = async (imageUri: string) => {
  // Mock function to simulate prediction
  // In a real scenario, this would involve sending the image to a backend service
  // that runs a model to classify the disease.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: 'Skin Lesion',
        description: 'This is a description of the detected disease.',
        moreInfo: 'More information about the detected disease.',
      });
    }, 2000);
  });
};
