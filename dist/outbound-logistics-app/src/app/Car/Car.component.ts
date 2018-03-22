import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CarService } from './Car.service';
import 'rxjs/add/operator/toPromise';
@Component({
	selector: 'app-Car',
	templateUrl: './Car.component.html',
	styleUrls: ['./Car.component.css'],
  providers: [CarService]
})
export class CarComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
	private errorMessage;

  
      
          boot = new FormControl("", Validators.required);
        
  
      
          doors = new FormControl("", Validators.required);
        
  
      
          vin = new FormControl("", Validators.required);
        
  
      
          brand = new FormControl("", Validators.required);
        
  
      
          model = new FormControl("", Validators.required);
        
  
      
          manufacturedDate = new FormControl("", Validators.required);
        
  
      
          manufacturingPlant = new FormControl("", Validators.required);
        
  


  constructor(private serviceCar:CarService, fb: FormBuilder) {
    this.myForm = fb.group({
    
        
          boot:this.boot,
        
    
        
          doors:this.doors,
        
    
        
          vin:this.vin,
        
    
        
          brand:this.brand,
        
    
        
          model:this.model,
        
    
        
          manufacturedDate:this.manufacturedDate,
        
    
        
          manufacturingPlant:this.manufacturingPlant
        
    
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    let tempList = [];
    return this.serviceCar.getAll()
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: "outbound.logistics.Car",
      
        
          "boot":this.boot.value,
        
      
        
          "doors":this.doors.value,
        
      
        
          "vin":this.vin.value,
        
      
        
          "brand":this.brand.value,
        
      
        
          "model":this.model.value,
        
      
        
          "manufacturedDate":this.manufacturedDate.value,
        
      
        
          "manufacturingPlant":this.manufacturingPlant.value
        
      
    };

    this.myForm.setValue({
      
        
          "boot":null,
        
      
        
          "doors":null,
        
      
        
          "vin":null,
        
      
        
          "brand":null,
        
      
        
          "model":null,
        
      
        
          "manufacturedDate":null,
        
      
        
          "manufacturingPlant":null
        
      
    });

    return this.serviceCar.addAsset(this.asset)
    .toPromise()
    .then(() => {
			this.errorMessage = null;
      this.myForm.setValue({
      
        
          "boot":null,
        
      
        
          "doors":null,
        
      
        
          "vin":null,
        
      
        
          "brand":null,
        
      
        
          "model":null,
        
      
        
          "manufacturedDate":null,
        
      
        
          "manufacturingPlant":null 
        
      
      });
    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else{
            this.errorMessage = error;
        }
    });
  }


   updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: "outbound.logistics.Car",
      
        
          
            "boot":this.boot.value,
          
        
    
        
          
            "doors":this.doors.value,
          
        
    
        
          
        
    
        
          
            "brand":this.brand.value,
          
        
    
        
          
            "model":this.model.value,
          
        
    
        
          
            "manufacturedDate":this.manufacturedDate.value,
          
        
    
        
          
            "manufacturingPlant":this.manufacturingPlant.value
          
        
    
    };

    return this.serviceCar.updateAsset(form.get("vin").value,this.asset)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
            else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceCar.deleteAsset(this.currentId)
		.toPromise()
		.then(() => {
			this.errorMessage = null;
		})
		.catch((error) => {
            if(error == 'Server error'){
				this.errorMessage = "Could not connect to REST server. Please check your configuration details";
			}
			else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
			}
			else{
				this.errorMessage = error;
			}
    });
  }

  setId(id: any): void{
    this.currentId = id;
  }

  getForm(id: any): Promise<any>{

    return this.serviceCar.getAsset(id)
    .toPromise()
    .then((result) => {
			this.errorMessage = null;
      let formObject = {
        
          
            "boot":null,
          
        
          
            "doors":null,
          
        
          
            "vin":null,
          
        
          
            "brand":null,
          
        
          
            "model":null,
          
        
          
            "manufacturedDate":null,
          
        
          
            "manufacturingPlant":null 
          
        
      };



      
        if(result.boot){
          
            formObject.boot = result.boot;
          
        }else{
          formObject.boot = null;
        }
      
        if(result.doors){
          
            formObject.doors = result.doors;
          
        }else{
          formObject.doors = null;
        }
      
        if(result.vin){
          
            formObject.vin = result.vin;
          
        }else{
          formObject.vin = null;
        }
      
        if(result.brand){
          
            formObject.brand = result.brand;
          
        }else{
          formObject.brand = null;
        }
      
        if(result.model){
          
            formObject.model = result.model;
          
        }else{
          formObject.model = null;
        }
      
        if(result.manufacturedDate){
          
            formObject.manufacturedDate = result.manufacturedDate;
          
        }else{
          formObject.manufacturedDate = null;
        }
      
        if(result.manufacturingPlant){
          
            formObject.manufacturingPlant = result.manufacturingPlant;
          
        }else{
          formObject.manufacturingPlant = null;
        }
      

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
        if(error == 'Server error'){
            this.errorMessage = "Could not connect to REST server. Please check your configuration details";
        }
        else if(error == '404 - Not Found'){
				this.errorMessage = "404 - Could not find API route. Please check your available APIs."
        }
        else{
            this.errorMessage = error;
        }
    });

  }

  resetForm(): void{
    this.myForm.setValue({
      
        
          "boot":null,
        
      
        
          "doors":null,
        
      
        
          "vin":null,
        
      
        
          "brand":null,
        
      
        
          "model":null,
        
      
        
          "manufacturedDate":null,
        
      
        
          "manufacturingPlant":null 
        
      
      });
  }

}
