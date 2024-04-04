import { Encounter, GoEncounter } from "./encounter.model";
import { GoParticipant, Participant } from "./participant.model";

export interface SocialEncounter extends Encounter{
    requiredParticipants: number
    currentlyInRange: Participant[]
}

export interface GoSocialEncounter extends GoEncounter {
    RequiredParticipants: number
    CurrentlyInRange: GoParticipant[]
}