import { Encounter } from "./encounter.model";
import { Participant } from "./participant.model";

export interface SocialEncounter extends Encounter{
    requiredParticipants: number
    currentlyInRange: Participant[]
}