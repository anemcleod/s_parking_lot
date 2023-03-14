import {
    ParkingLot,
    Vehicle,
    VehicleCount,
    VehicleRequestProps,
    VehiclesType
} from './types'


export const parkingLot: ParkingLot = {
    getAvailableSpots: async(): Promise<VehicleCount| undefined> => {
        try {
        //Check local storage for data and return

        const localOpenSpots = window.localStorage.getItem('openSpots');
        if(localOpenSpots){
            return JSON.parse(localOpenSpots);
        }   

        //if no local storage get from api and return 

        const response = await fetch('https://us-central1-sealed-dev.cloudfunctions.net/take-home-mock/lot/available');
        if(response.status === 200){
            return await response.json();
        }

        } catch(error){
            console.error(error);
        }
    },
    getVehicles: async(): Promise<Vehicle[]| undefined> => {
        try {
        //Check local storage for data and return

        const localVehicles = window.localStorage.getItem('vehicles');
        if(localVehicles){
            return JSON.parse(localVehicles);
        }   

        //if no local storage get from api and return 

        const response = await fetch('https://us-central1-sealed-dev.cloudfunctions.net/take-home-mock/lot/parked');
        if(response.status === 200){
            return await response.json();
        }

        } catch(error){
            console.error(error);
        }
    },
    addVehicle: async(reqProps: VehicleRequestProps, openSpots: VehicleCount): Promise<Vehicle | undefined> => {
        try{
        //check if spot is available if not return parking lot is full error
            if(openSpots[VehiclesType[reqProps.type]] <= 0 ){
                throw new Error(`No available spots for ${reqProps.type} at this time.`)
            }

        //create vehicle
            const response = await fetch('https://us-central1-sealed-dev.cloudfunctions.net/take-home-mock/lot/park', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reqProps)
            });

            const data = await response.json();

            return data.vehicle;

        }catch(error){
            console.log(error);
            alert(error);
        }
    },
    removeVehicle: async(id: string): Promise<string | undefined> => {
        //send delete request
        try {
            const response = await fetch(`https://us-central1-sealed-dev.cloudfunctions.net/take-home-mock/lot/remove/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            return data.status

        } catch(error) {
            console.error(error)
        }
    },
    getVehicleCount(vehicles: Vehicle[]): VehicleCount {
        const vehicleCount: VehicleCount = {
            cars: 0,
            motorcycles: 0,
            vans: 0,
        };
    
        vehicles.forEach(e => {
            vehicleCount[VehiclesType[e.type]] += 1;
        });
    
        return vehicleCount;
    } 
}