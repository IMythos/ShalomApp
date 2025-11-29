import { SolicitudeResponseData } from "../../models/solicitude/solicitude-response.model";
import { ApiResponse } from "./api-response.interface";

export type SolicitudeResponse = ApiResponse<SolicitudeResponseData>;
export type SolicitudeListResponse = ApiResponse<SolicitudeResponseData[]>;
