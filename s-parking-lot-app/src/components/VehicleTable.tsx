import { Dispatch, SetStateAction, useState } from 'react';
import { Vehicle, VehicleCount, VehicleType, VehiclesType } from '../types';

import { parkingLot } from '../helpers';

const VehiclesTable = ({ vehicles, setVehicles, setOpenSpots }: VehiclesTableProps) => {
    const [removing, setRemoving] = useState<string | null>(null);

    const removeVehicle = async (id: string, type: VehicleType) => {
      try {
        //since it doesn't update a database this call will fail for vehicles added after original 3
        setRemoving(id);
        await parkingLot.removeVehicle(id);
      } catch(error){
        console.error(error);
      } finally {
        //remove vehicle and update state & localStorage
        const updatedVehicles = vehicles?.filter(e => e.id !== id);
        setVehicles(updatedVehicles)
        window.localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
        
        // add additional parking spot and update state and local storage
        setOpenSpots((prevState)  => {
            if(prevState){
                const copy = {...prevState};
                copy[VehiclesType[type]] += 1;
                window.localStorage.setItem('openSpots', JSON.stringify(copy));
                return copy
            }
        })
        setRemoving(null)
      }
    }

    return (
        <table className=' container vehicleTable'>
            <thead >
                <tr className='tableRows'>
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
                        <tr className='tableRows' key={`key-${vehicle.id}`}>
                            <td aria-label='vehicle Id'>{vehicle.id}</td>
                            <td aria-label='vehicle type'>{vehicle.type}</td>
                            <td aria-label='spot'>{vehicle.spot}</td>
                            <td aria-label='parked'>{date}</td>
                            <td>
                   
                                <button 
                                    disabled={removing === vehicle.id}
                                    onClick={()=>{
                                        removeVehicle(vehicle.id, vehicle.type)
                                    }}>
                                    {removing === vehicle.id ? 'loading' : 'remove'}
                                </button>     
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