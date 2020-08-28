'use strict'

class MyArray{
    constructor(...items){
        this.length = 0;
        items.forEach(s => {this[this.length] = s; this.length++;})
    }
    shift(){
        if(this.length > 0){
            let res = this[0];
            for(let i = 0; i < this.length; i++){
                if((i+1) <= this.length){
                    this[i] = this[i+1];
                }
            }
            this.length--;
            delete this[this.length];
            return res;
        }
    }
    unshift(...args){
        let prevLength = this.length;
        this.length += args.length;
        for(let i = this.length; i > 0; i--, prevLength--){
            this[i] = this[prevLength];
        }
        let counter = 0; 
        args.forEach(s => {this[counter] = s; counter++;});
        return this.length;
    }
    contains(value){
        for(let i = 0; i < this.length; i++){
            if(value == value){
                return true;
            }
        }
        return false;
    }
    toString(){
        let res = "[";
        for(let i = 0; i < this.length; i++){
            res += this[i] + ',';
        }
        res = res.slice(0, res.length-1);     
        res += "]";
        return res;
    }
}

const arr = new MyArray(1,2,3,4,5);

console.log("MyArray: " + arr);

console.log("Call MyArray.shift(): " + arr.shift());

console.log("MyArray: " + arr);

console.log("Call MyArray.unshift(...): " + arr.unshift(6,7,8));

console.log("MyArray: " + arr);

class ArrayHelper{
    static uniqueElemenst(array){
        let uniqueArr = [];
        array.filter(function(item){
            let i = uniqueArr.findIndex(x => x == item);
            if(i <= -1){
                uniqueArr.push(item);
            }
            return null;
        });
        return uniqueArr;
    }
}

class FlatHelper{
    static deepFlat(array) {
        return array.reduce( (acc, e) => {
          if(Array.isArray(e)) {
            return acc.concat(FlatHelper.deepFlat(e));
          } else {
            return acc.concat(e);
          }
        }, [] );
    };
    static deepUniqueFlat(array){
        return array.reduce( (acc, e) => {
            if(Array.isArray(e)) {         
              return acc.concat(FlatHelper.deepUniqueFlat(ArrayHelper.uniqueElemenst(e)));
            } else {
              return acc.concat(e);
            }
          }, [] );
    }
}

class Validator{
    static ValidateNumberInput(...args){
        let errMsgs = [];
        let arrToValidate = FlatHelper.deepFlat(args);
        for(let i = 0; i < arrToValidate.length; i++){
            if(isNaN(arrToValidate[i])){
                errMsgs.push(`Argument(s): ${arrToValidate[i]} should be a number`);
            }
        }
        if(errMsgs.length > 0){
            throw TypeError(errMsgs.join("; "));
        }
    }
    static ValidateRange(...args){
        let arrToValidate = FlatHelper.deepFlat(args);
        if(arrToValidate[0] >= arrToValidate[1]){
            throw Error("First argument must be less then second");
        }
    }
    static ValidateArgumentNumber(...args){
        let arrToValidate = FlatHelper.deepFlat(args);
        if(arrToValidate.length > 2){
            throw Error("Too much arguments");
        }
    }
}

class BaseValidator{
    ValidateData(...args){
        Validator.ValidateArgumentNumber(args);
        Validator.ValidateNumberInput(args);
        Validator.ValidateRange(args);
    }
}

class RangeValidator extends BaseValidator{
    constructor(...args){
        super();
        super.ValidateData(args);
        this._from = args[0];
        this._to = args[1];
    }    
    get from(){
        return this._from;
    }
    set from(value){
        super.ValidateData(value, this._to);
        this._from = value;
    }
    get to(){
        return this._to;
    }
    set to(value){
        super.ValidateData(this.from, value);
        this._to = value;
    }
    get range(){
        return [this._from, this._to];
    }
    validate(value){
        super.ValidateData(value);
        if(this._from < value < this._to){
            return true;
        }
        return false;
    }
    toString(){
        return `Range defined from ${this.from} to ${this._to}`;
    }
}

const rangeValidator = new RangeValidator(10,20);

console.log(rangeValidator.toString());

console.log(`Get range: ${rangeValidator.range}`);

console.log(`Call RangeValidator.validate(...): ${rangeValidator.validate(8)}`);

console.log(`MyArray: ${arr.toString()}`);

console.log(`Call MyArray.contais(...): ${arr.contains(4)}`);

function toNine(value){
    let res = 0;
    let arr = value.toString().split("");
    arr.forEach(s => res += Number(s));
    if(res <= 9){
        return res;
    }
    return toNine(res);   
}

console.log("Call toNine(...): " + toNine(124567895));

console.log("Call FlatHelper.deepUniqueFlat(...): " + FlatHelper.deepUniqueFlat([1,2,2,2,4,4], [1,1,2,[1,1,2,2,3,5],3,3,3], [2,2,2,3,3,4]));