export interface SolicitudeResponseData {
  id: number;
  clientId: number;
  clientFullname: string;
  recipientDni: string;
  recipientName: string;
  recipientCity: string;
  destinationCity: string;
  description: string;
  packageImageUrl: string;
  status: string;
  requestDate: string;
}
