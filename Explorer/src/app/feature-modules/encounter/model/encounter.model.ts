import { Completer } from "./completer.model";
import { Location } from "./location.model";
import { Participant } from "./participant.model";

export interface Encounter {
    id: number;
    name: string;
    description: string;
    location: Location;
    experience: number;
    status: EncounterStatus,
    type: EncounterType,
    radius: number;
    participants?: Participant[];
    completers?: Completer[];
}

export enum EncounterStatus {
    DRAFT = 1,
    ACTIVE,
    ARCHIVED,
}

export enum EncounterType {
    SOCIAL = 1,
    LOCATION,
    MISC,
}
