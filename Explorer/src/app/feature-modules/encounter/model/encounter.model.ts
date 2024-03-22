import { Completer } from "./completer.model";
import { Location } from "./location.model";
import { GoParticipant, Participant } from "./participant.model";

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

export interface GoEncounter {
    id: number;
    Name: string;
    Description: string;
    Location: Location;
    Experience: number;
    Status: EncounterStatus,
    Type: EncounterType,
    Radius: number;
    Participants?: GoParticipant[];
    Completers?: Completer[];
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
