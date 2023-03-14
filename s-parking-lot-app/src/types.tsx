export interface VehicleCount {
    cars: number;
    motorcycles: number;
    vans: number;
}

export enum VehicleType {
    Car = "car",
    Motorcycle = "motorcycle",
    Van = "van"
}

//useful when accessing vehicle count by Vehicle type
export enum VehiclesType {
    car = "cars",
    motorcycle = "motorcycles",
    van = "vans"
}

export interface Vehicle {
    createdAt: string;
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
