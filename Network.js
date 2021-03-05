/* 
ANN classes for direct use
written by Dan Wacker
*/

const ANNmath = require('./ANNmath.js');
const fs = require('fs');
//class responsible for 
class network{
    //constructor just creates member objects for weights and activations
    constructor() {
        this.weights = [];
        this.activations = [];
        this.loaded = false;
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
                    weightSection.push(Math.random()*2/shape[i]);
                }
                //add row to layer
                weightLayer.push(weightSection);
            }
            //add layer to weights object
            this.weights.push(weightLayer);
        }
        //fill activations object
        this.activations = activations;
        this.loaded = true;
    }

    //initializes network by loading from file
    load(filename) {
        let loader = JSON.parse(fs.readFileSync(filename));
        this.weights = loader.weights;
        this.activations = loader.activations;
    }

    //saves network state to specified file
    save(filename) {
        let saver = {
            weights : this.weights,
            activations : this.activations 
        };
        fs.writeFileSync(filename, JSON.stringify(saver), (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('save successful')
            }
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
        return result[0];
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
        let finalout = layerOutputs.pop();
        let error = ANNmath.sub([outputs], finalout);
        if (error[0][0] > 100) {
        console.log(layerInputs[layerInputs.length-1]);
        console.log(finalout);
        console.log([outputs]);
        console.log(error);
        console.log(ANNmath.sub([outputs], finalout));
        console.log(outputs[0] - finalout[0][0]);
        console.log(outputs[1] - finalout[0][1]);
        console.log(outputs[2] - finalout[0][2]);
        }
        //loop through every layer
        for (let i=this.weights.length-1; i>=0; i--) {
            //backprop error before adjusting weights
            let prevError = ANNmath.mult(error,ANNmath.transpose(this.weights[i]));
            //find activation derivatives for layer
            let derivs = ANNmath.activeDeriv(layerInputs[i][0],this.activations[i]);
            //loop through each weight in a layer
            for (let j=0; j<this.weights[i].length; j++) {
                for (let k=0; k<this.weights[i][0].length; k++) {
                    //weight adjustment scheme
                    this.weights[i][j][k] = this.weights[i][j][k] + factor * error[0][k] * derivs[k] * layerOutputs[i][0][j];
                }
            }
            //replace with backpropped error and do it again
            error = prevError;
        }
    }
}

exports.network = network;