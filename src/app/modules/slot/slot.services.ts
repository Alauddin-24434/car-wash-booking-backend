
import { TSlot } from "./slot.interface";
import { Slot } from "./slot.model";
import { formatMinutesToTime, parseTimeToMinutes } from "./slot.utils";

const createSlotServicesIntoDB = async (payload:TSlot,duration:number) => {
    
 
    const { service, date, startTime, endTime} = payload;
    
 const slotsArry:TSlot[]=[];

 const startMinutes=parseTimeToMinutes(startTime);
 const endMinutes=parseTimeToMinutes(endTime);

 for(let time= startMinutes; time < endMinutes ; time += duration){
    const slot:TSlot={
        service,
        date,
        startTime:formatMinutesToTime(time),
        endTime:formatMinutesToTime(time+ duration),
        isBooked: 'available',
    };
    const createSlot= await Slot.create(slot);
    slotsArry.push(createSlot)
 }

 return slotsArry;
  
};


//  Get available slots



export const  getAvilabeSlotIntoDB = async (serviceId: string, date: string) => {
  // Find slots in the database by service ID and date, and populate the service field with service details
    const slots = await Slot.find({ service: serviceId, date }).populate('service');
    return slots;
  };
  


export const services={
    createSlotServicesIntoDB ,
    getAvilabeSlotIntoDB,

 }