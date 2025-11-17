import { LoginResponseData } from "../../models/login/login-response.model";
import { ApiResponse } from "./api-response.interface";

export type LoginResponse = ApiResponse<LoginResponseData>;
