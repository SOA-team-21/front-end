import { Location } from "./location.model";
import { Encounter } from "./encounter.model";

export interface HiddenEncounter extends Encounter {
    image: string;
    pointLocation: Location;
}