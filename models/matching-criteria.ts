export default interface MatchingCriteriaModel {
    id: string;
    timestamp: string;
    uid: string;
    name: string;
    criteria: {
        type: string;
        value: string;
        min: number;
        max: number;
        condition: string;
    }[]
}