import { UserResponseData } from "../../models/users/user-response.interface";
import { ApiResponse } from "./api-response.interface";

export type UserResponse = ApiResponse<UserResponseData>;
