import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";

export class CustomValidators {

    static numberValidation(control: FormControl){
        if(isNaN(control.value)){
            return {'invalidNumber': true}
        }
        return null
    }

    static stringLengthValidation(control: FormControl): Promise<any> | Observable<any>{
        const promise = new Promise<any>((resolve, reject) => {
            setTimeout(() => {
                if(control.value.length > 10){
                    resolve({'maximumLengthReached': true})
                } else {
                    resolve(null)
                }
            }, 2000)
        })
        return promise
    }
}