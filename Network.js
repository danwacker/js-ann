/* 
ANN classes for direct use
written by Dan Wacker
*/

let fs = require('fs');
let ANNmath = require('./ANNmath.js');

//class responsible for 
module.exports = class network{
    //constructor just creates member objects for weights and activations
    constructor() {
        this.weights = [];
        this.activations = [];
    }

    //initializes network with specifications
    create(shape=[], activations=[]) {
        //loop each layer
        for (let i = 0; i < shape.length - 1; i++) {
            //var for a layer of weights
            let weightLayer = [];
            //loop through each row
            for (let j = 0; j < shape[i]; j++){
                //row of weights
                let weightSection = [];
                //loop each element
                for (let k = 0; k < shape[i+1]; k++){
                    //randomly initialize each weight
                    weightSection.push(Math.random());
                }
                //add row to layer
                weightLayer.push(weightSection);
            }
            //add layer to weights object
            this.weights.push(weightLayer);
        }
        //fill activations object
        this.activations = activations;
    }

    //initializes network by loading from file
    load(file) {
        file = './' + file;
        let loader = require(file);
        this.weights = loader.weights;
        this.activations = loader.activations;
    }

    //saves network state to specified file
    save(file) {
        let saver = {
            weights : this.weights,
            activations : this.activations 
        };
        fs.writeFileSync(file, JSON.stringify(saver), err => {
            if (err) throw err;
        });
    }
    
    //simple query function just needs inputs, gives you outputs
    query(inputs) {
        //initialize results
        let result = ANNmath.transpose(inputs);
        //loop through each layer
        for (let i=0; i<this.weights.length; i++) {
            //apply weights
            result = ANNmath.mult(result, this.weights[i]);
            //apply activation functions
            result = ANNmath.activate(result, this.activations[i]);
        }
        //return variable after every layer of weighting/activating
        return result;
    }

    //training function. requires inputs and outputs and a training factor
    train(inputs, outputs, factor) {
        //record outputs of input layer (the inputs)
        let layerOutputs = [ANNmath.transpose(inputs)];
        //create layer input matrix
        let layerInputs = [];
        //loop through each layer
        for (let i=0; i<this.weights.length; i++) {
            layerInputs.push(ANNmath.mult(layerOutputs[i],this.weights[i]));
            layerOutputs.push(ANNmath.activate(layerInputs[i], this.activations[i]));
        }
        //calculate output error
        let error = [ANNmath.sub(outputs,layerOutputs.pop())];
        //loop through every layer
        for (let i=this.weights.length-1; i>=0; i--) {
            //backprop error before adjusting weights
            let prevError = ANNmath.mult((this.weights[i]),error);
            //find activation derivatives for layer
            let derivs = ANNmath.activeDeriv(layerInputs[i][0],this.activations[i]);
            //loop through each weight in a layer
            for (let j=0; j<this.weights[i].length; j++) {
                for (let k=0; k<this.weights[i][0].length; k++) {
                    //weight adjustment scheme
                    this.weights[i][j][k] = this.weights[i][j][k] + factor * error[k] * derivs[k] * layerOutputs[i][0][j];
                }
            }
            //replace with backpropped error and do it again
            error = prevError;
        }
    }
}