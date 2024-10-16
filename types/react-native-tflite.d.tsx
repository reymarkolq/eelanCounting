declare module 'react-native-tflite' {
  export default class Tflite {
    static loadModel: any;
    static runModel: any;
    loadModel(modelOptions: { model: string }, callback: (err: any, res: any) => void): void;
    runModel(modelOptions: { input: any; inputShape: number[] }, callback: (err: any, res: any) => void): void;
    close(): void;
  }
}
