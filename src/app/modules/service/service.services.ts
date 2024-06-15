import { TService } from './service.interface';
import { Service } from './service.model';


 const createServiceServicesIntoDB = async (payload:TService) => {
 
 
 
 
    const service = await Service.create(payload)
    return service;
  
};


// get all services 

const getAllServicesIntoDB= async ()=>{
    const services= await Service.find();
    return services;
}

//  get service find by Id

const getSingleServiceIntoDB= async (id:string)=>{
    const findService= await Service.findById(id)
    return findService;
}

 const updateServicesIntoDB = async (id:string, payload:TService) => {
    const updatedService = await Service.updateOne({ _id: id }, payload);
    if(updatedService.modifiedCount){
        const data=await Service.findById(id)
        return data;
    }
};


// Soft delete service by ID
const deletedServicesIntoDB = async (id: string) => {
    const softDeleted = await Service.updateOne({ _id: id }, { isDeleted: true });
    return softDeleted;
};



export const services={
   createServiceServicesIntoDB,
   updateServicesIntoDB ,
   deletedServicesIntoDB ,
   getSingleServiceIntoDB,
   getAllServicesIntoDB
}