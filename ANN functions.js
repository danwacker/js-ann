/* 
ANN classes for direct use
written by Dan Wacker
*/



class network{
    constructor(){
        this.weights = [];
        this.activations = [];
    }
    create(shape=[], activations=[]){
        for (let i = 0; i < shape.length - 1; i++) {
            let weightLayer = [];
            for (let j = 0; j < shape[i]; j++){
                let weightSection = [];
                for (let k = 0; k < shape[i+1]; k++){
                    weightSection.push(Math.random());
                }
                weightLayer.push(weightSection);
            }
            this.weights.push(weightLayer);
        }
        this.activations = activations;
    }
    load(file) {
        
    }
    query(inputs) {
        let result = inputs;
        for (let i=0; i<this.weights.length; i++) {
            result = mult(result, weights[i]);
            result = activate(result);
        }
        return result;
    }
    train(inputs,outputs) {

    }
}