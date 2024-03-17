import { Person } from "src/app/feature-modules/administration/model/userprofile.model";
import { Club } from "./club.model";

export interface MembershipRequest {
    id?: number;
    clubId?: number;
    touristId? : number;
    accepted? : boolean
}