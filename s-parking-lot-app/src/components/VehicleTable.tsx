import { Dispatch, SetStateAction, useState } from "react";
import { Vehicle, VehicleCount, VehicleType, VehiclesType } from "../types";

import { parkingLot } from "../helpers";

const VehiclesTable = ({ vehicles, setVehicles, setOpenSpots }: VehiclesTableProps) => {
    const [removing, setRemoving] = useState<string | null>(null);

    const removeVehicle = async (id: string, type: VehicleType) => {
      try {
        //since it doesn't update a database this call limited
        setRemoving(id);
        await parkingLot.removeVehicle(id);
      } catch(error){
        console.error(error);
      } finally {
        //remove vehicle and update state & localStorage
        const updatedVehicles = vehicles?.filter(e => e.id !== id);
        setVehicles(updatedVehicles)

        // add additional parking spot and update state and local storage
        setOpenSpots((prevState)  => {
            if(prevState){
                const copy = {...prevState};
                copy[VehiclesType[type]] += 1;
                window.localStorage.setItem('openSpots', JSON.stringify(copy));
                return copy
            }
        })
        window.localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
        setRemoving(null)
      }
    }

    return (
        <table className=" container vehicleTable">
            <thead >
                <tr className="tableRows">
                    <th>Vehicle ID</th>
                    <th>Vehicle Type</th>
                    <th>Spot</th>
                    <th>Parked</th>
                    <th></th>
                </tr>    
            </thead>
            <tbody>
            {
                vehicles && vehicles.length ? vehicles.map(vehicle => {
                    const date = new Date(vehicle.createdAt).toString()
                    return (
                        <tr className="tableRows" key={`key-${vehicle.id}`}>
                            <td>{vehicle.id}</td>
                            <td>{vehicle.type}</td>
                            <td>{vehicle.spot}</td>
                            <td>{date}</td>
                            <td>
                                {
                                    removing === vehicle.id ? "Loading..." : (
                                        <button onClick={()=>{
                                            removeVehicle(vehicle.id, vehicle.type)
                                        }}>
                                            remove
                                        </button>
                                    )
                                }
                                
                            </td>
                        </tr>
                    )
                }) : <tr><td>No current cars in the lot</td></tr>
            }
            </tbody>
        </table>
    )
}

export default VehiclesTable

interface VehiclesTableProps {
    vehicles: Vehicle[] | undefined;
    setVehicles: Dispatch<SetStateAction<Vehicle[]| undefined>>; 
    setOpenSpots: Dispatch<SetStateAction<VehicleCount | undefined>>; 
}