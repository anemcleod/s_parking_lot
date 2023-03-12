import { VehicleCount } from '../types';

const ParkingLotStatus = ({ title, vehicleCount }: ParkingLotStatusProps)=> {
    
    return (
        <div className='container'>
            <h4>{title}</h4>
            {
                vehicleCount ? (
                    <>
                        <div className='vehicleCountContainer'>
                            <p>Cars:</p>
                            <p>{vehicleCount.cars} </p>
                        </div>
                        <div className='vehicleCountContainer'>
                            <p>Vans:</p>
                            <p>{vehicleCount.vans} </p>
                        </div>
                        <div className='vehicleCountContainer'>
                            <p>Motorcycles:</p>
                            <p>{vehicleCount.motorcycles} </p>
                        </div>
                    </>
                ): <p>No status available</p>
            }
        </div>
    )
}

export default ParkingLotStatus;

interface ParkingLotStatusProps {
    title: string;
    vehicleCount: VehicleCount | undefined;
}