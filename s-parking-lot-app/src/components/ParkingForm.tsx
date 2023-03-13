import { VehicleType, VehicleCount, Vehicle, VehiclesType } from '../types';
import {SyntheticEvent, useState, Dispatch, SetStateAction} from 'react'
import { parkingLot } from '../helpers';

const ParkingForm = ({ openSpots, setVehicles, setOpenSpots, vehicles } : ParkingFormProps) =>{
    const [id, setId] = useState<string>('');
    const [type, setType] = useState<VehicleType | 'default'>('default');
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const submitHandler = async (e:SyntheticEvent ) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            if(type !== 'default' && id && openSpots && vehicles){
                //Check if id already exists since ids are input manually
                const duplicate = vehicles.find(e => e.id === id);
                if(duplicate){
                    alert(`A vehicle with id ${id} already exists.`)
                    throw new Error(`A vehicle with id ${id} already exists.`)
                }

                const addedVehicle = await parkingLot.addVehicle({id, type}, openSpots);
                
                //add vehicle and update state & localStorage
                if(addedVehicle){
                    const updatedVehicles = [...vehicles, addedVehicle];
                    setVehicles(updatedVehicles)
                    window.localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));

                    //remove additional parking spot and update state and local storage
                    setOpenSpots((prevState)  => {
                        if(prevState){
                            const copy = {...prevState};
                            copy[VehiclesType[addedVehicle.type]] -= 1;
                            window.localStorage.setItem('openSpots', JSON.stringify(copy));
                            return copy
                        }
                    })                   
                }                
           }
            
        } catch(error){
            console.error(error)
        } finally{
            setIsLoading(false);
            setId('');
            setType('default');
        }
        
        
    }

    return (
        <form 
            className='container'
            onSubmit={(e) =>{
               submitHandler(e);
        }}>
            <h4>Park Vehicle</h4>
            <div className='form-container'>
                <input 
                    type='text'
                    name='id'
                    value={id}
                    placeholder='Vehicle ID'
                    onChange={(e) => setId(e.target.value)}
                    required>
                </input>

                <select 
                    name='type'
                    value={type}
                    onChange={(e) => setType(e.target.value as VehicleType)}
                    required>
                    <option value='default' disabled selected hidden>
                        Vehicle Type 
                    </option>
                    <option 
                        disabled={!(openSpots?.cars && openSpots.cars > 0)}
                        value={VehicleType.Car}>
                        {VehicleType.Car}
                    </option>
                    <option 
                        disabled={!(openSpots?.motorcycles && openSpots.motorcycles > 0)}
                        value={VehicleType.Motorcycle}>
                        {VehicleType.Motorcycle}
                    </option>
                    <option
                        disabled={!(openSpots?.vans && openSpots.vans > 0)} 
                        value={VehicleType.Van}>
                        {VehicleType.Van}
                    </option>
                </select>
                <button disabled={isLoading}>
                    {isLoading ? 'loading': 'add'}
                </button>
            </div>           
        </form>
    )
}

export default ParkingForm;

interface ParkingFormProps{
    vehicles: Vehicle[] | undefined;
    openSpots: VehicleCount | undefined;
    setVehicles: Dispatch<SetStateAction<Vehicle[]| undefined>>; 
    setOpenSpots: Dispatch<SetStateAction<VehicleCount | undefined>>; 
}