const e = 2.71828


function relu(input) {
    if (input < 0) {
        return 0;
    }
    return input;
}

function sigmoid(input) {
    return 1/(1+e**(-input));
}

function mult(mat1, mat2) {
    
}


class neuron{
    constructor(activation) {
        this.activation = activation
    }
    feedForward(input) {
        if (this.activation === 'relu') {
            return relu(input);
        } else if (this.activation === 'sigmoid') {
            return sigmoid(input);
        }
    }

}

class neuralNetwork{
    constructor(){
        this.weights = [];
        this.activations = [];
    }
    create(shape, activations){
        for (let i = 0; i < shape.length - 1; i++) {
            let weightLayer = [];
            for (let j = 0; j < shape[i]; j++){
                let weightSection = [];
                for (let k = 0; k < shape[i+1]; k++){
                    weightSection.push(Math.random());
                }
                weightLayer.push(weightSection);
            }
            this.weights.push(weightLayer)
        }
    }
    
}