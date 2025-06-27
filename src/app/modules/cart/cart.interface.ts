import { ISlot } from "../slot/slot.interface";


export interface CartItem {
  userId: string;
  serviceId: string;
  serviceName: string;
  price: number;
  quantity: number;
  selectedDate: string;
  selectedSlots: ISlot[];

}
