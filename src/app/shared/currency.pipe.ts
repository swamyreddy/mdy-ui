import {Pipe, PipeTransform} from "@angular/core"

@Pipe({
    name: "myCustomPipe"
})

export class myCustomPipe implements PipeTransform{
    transform(value: number, ...args: number[]): unknown {
        const [price] = args;
        return price * value;

    }
}