export default interface ShortAnswerModel {
    id: string;
    uid: string;
    timestamp: string;
    name: string;
    question: string;
    wordLimit: number;
    active: boolean;
}
