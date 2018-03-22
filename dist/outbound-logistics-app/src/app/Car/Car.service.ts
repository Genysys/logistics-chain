import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Car } from '../outbound.logistics';
import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class CarService {

	
		private NAMESPACE: string = 'outbound.logistics.Car';
	



    constructor(private dataService: DataService<Car>) {
    };

    public getAll(): Observable<Car[]> {
        return this.dataService.getAll(this.NAMESPACE);
    }

    public getAsset(id: any): Observable<Car> {
      return this.dataService.getSingle(this.NAMESPACE, id);
    }

    public addAsset(itemToAdd: any): Observable<Car> {
      return this.dataService.add(this.NAMESPACE, itemToAdd);
    }

    public updateAsset(id: any, itemToUpdate: any): Observable<Car> {
      return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
    }

    public deleteAsset(id: any): Observable<Car> {
      return this.dataService.delete(this.NAMESPACE, id);
    }

}
