import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace outbound.logistics{
   export enum Markets {
      UNITEDKINGDOM,
      NETHERLANDS,
      FRANCE,
      GERMANY,
      ITALY,
   }
   export abstract class Company extends Participant {
      companyId: string;
   }
   export class Manufacturer extends Company {
      manufacturerName: string;
   }
   export class Plant extends Participant {
      plantId: string;
      owner: Manufacturer;
   }
   export class Compound extends Participant {
      compoundId: string;
      owner: Manufacturer;
   }
   export abstract class TransportationCompany extends Company {
      companyName: string;
   }
   export class Haulier extends TransportationCompany {
   }
   export class Port extends TransportationCompany {
   }
   export abstract class Vehicle extends Asset {
      vin: string;
      brand: string;
      model: string;
      manufacturedDate: Date;
      manufacturingPlant: Plant;
   }
   export class Car extends Vehicle {
      boot: boolean;
      doors: number;
   }
   export class ManufactureCar extends Transaction {
      vin: string;
      brand: string;
      model: string;
   }
   export class CarManufactured extends Event {
      cardId: string;
   }
   export abstract class Address {
      street: string;
      city: string;
      country: string;
   }
   export class UnitedKingdomAddress extends Address {
      postcode: string;
   }
   export class route {
      origin: Address;
      destination: Address;
      sender: Company;
      receiver: Company;
   }
// }
