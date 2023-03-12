import React, {createContext, useState, useEffect, FC, Dispatch, SetStateAction } from 'react';
import { json } from 'stream/consumers';

export const DataContext = createContext<Partial<DataContextType>>({});

export const DataProvider: FC<Props> = ({children}) => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [openSpots, setOpenSpots] = useState<VehicleCount>({
        cars: 0,
        motorcycles: 0,
        vans: 0,
    });
    const [testData, setTestData] = useState("connect!");
  
    useEffect(() => {
        const fetchData = async () => {
            const vehiclesData = await parkingLot.getVehicles();
            if(vehiclesData){
                setVehicles(vehiclesData);
                window.localStorage.setItem('vehicles', JSON.stringify(vehiclesData));
            }            
        }
        fetchData()
      },[])

      useEffect(() => {
        const fetchData = async () => {
            const openSpotsData = await parkingLot.getAvailableSpots();
            if(openSpotsData){
                setOpenSpots(openSpotsData);
                window.localStorage.setItem('openSpots', JSON.stringify(openSpotsData));
            }            
        }
        fetchData()
      },[])

    return (
        <div>
            <DataContext.Provider 
                value={{
                    vehicles, 
                    setVehicles,
                    openSpots, 
                    setOpenSpots,
                    testData, 
                    setTestData
                }}
            >
                {children}
            </DataContext.Provider>
        </div>
    )
}

//Types
export interface DataContextType {
    vehicles: Vehicle[]; 
    setVehicles: Dispatch<SetStateAction<Vehicle[]>>; 
    openSpots: VehicleCount; 
    setOpenSpots: Dispatch<SetStateAction<VehicleCount>>; 
    testData: string;
    setTestData: Dispatch<SetStateAction<string>>;
}

export interface Props {
    children: React.ReactNode;
}

export interface VehicleCount {
    cars: number;
    motorcycles: number;
    vans: number;
}

export enum VehicleType {
    Cars = "cars",
    Motorcycles = "motorcycles",
    Vans = "vans"
}

export interface Vehicle {
    createdAt: Date;
    id: string;
    spot: string;
    type: VehicleType;
}
export interface VehicleRequestProps {
    type: VehicleType;
    id: string;
}

export  interface ParkingLot {
    getAvailableSpots: () =>  Promise<VehicleCount| undefined>;
    getVehicles: () => Promise<Vehicle[]| undefined>;
    addVehicle: (reqProps: VehicleRequestProps, openSpots: VehicleCount) => Promise<Vehicle | undefined>;
    removeVehicle:(id: string) => Promise<string | undefined>;
    getVehicleCount:(vehicles: Vehicle[]) => VehicleCount 
}

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
        return await response.json();

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
        return await response.json();

        } catch(error){
            console.error(error);
        }
    },
    addVehicle: async(reqProps: VehicleRequestProps, openSpots: VehicleCount): Promise<Vehicle | undefined> => {
        try{
        //check if spot is available if not return parking lot is full error
            if(openSpots[reqProps.type] <= 0 ){
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
            vehicleCount[e.type] += 1;
        });
    
        return vehicleCount;
    } 
}