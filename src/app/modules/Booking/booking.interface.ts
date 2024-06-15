export type VehicleType = 'car' | 'truck' | 'SUV' | 'van' | 'motorcycle' | 'bus' | 'electricVehicle' | 'hybridVehicle' | 'bicycle' | 'tractor';

export type TBooking = {
  serviceId: object;
  slotId: object;
  vehicleType: VehicleType;
  vehicleBrand: string;
  vehicleModel: string;
  manufacturingYear: number;
  registrationPlate: string;
  createdAt?: Date;
  updatedAt?: Date;
}

