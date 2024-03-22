import { Location } from "./location.model";
import { Encounter, GoEncounter } from "./encounter.model";

export interface HiddenEncounter extends Encounter {
    image: string;
    pointLocation: Location;
}

export interface GoHiddenEncounter extends GoEncounter {
    Image: string;
    Position: Location;
}