import { useState, useMemo, useEffect} from 'react';

import './App.scss';
import { VehicleCount, Vehicle } from './types';
import { parkingLot } from './helpers';

import ParkingLotStatus from './components/ParkingLotStatus';
import VehiclesTable from './components/VehicleTable';
import ParkingForm from './components/ParkingForm';


function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]| undefined>();
  const [openSpots, setOpenSpots] = useState<VehicleCount | undefined>();
  
  const occupiedSpots: VehicleCount | undefined = useMemo((): VehicleCount | undefined => { 
    if( vehicles){
      return parkingLot.getVehicleCount(vehicles)
    }   
  }, [vehicles])

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
    <div className="App">
      <header className="App-header">
         <h1>Parking Lot</h1>
      </header>
      <main>
        <section>
          <ParkingLotStatus title={"Spots Remaining"} vehicleCount={openSpots}/>
          <ParkingLotStatus title={"Vehicles Parked"} vehicleCount={occupiedSpots}/>
        </section>
        <section>
          <ParkingForm 
            vehicles={vehicles}
            openSpots={openSpots}
            setVehicles={setVehicles} 
            setOpenSpots={setOpenSpots}/>
        </section>
        <section>
          <VehiclesTable 
            vehicles={vehicles}
            setVehicles={setVehicles} 
            setOpenSpots={setOpenSpots}/>
        </section>  
      </main>
    </div>
  );
}

export default App;
