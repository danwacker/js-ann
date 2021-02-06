/* 
ANN classes for direct use
written by Dan Wacker
*/

import {sub, mult, transpose, activate, activeDeriv} from './ANNmath.js';
//class responsible for 
export class network{
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
                    weightSection.push(Math.random()/shape[i]);
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
        loadnetwork(this,filename);
    }

    //saves network state to specified file
    save(filename) {
        let saver = {
            weights : this.weights,
            activations : this.activations 
        };
        let xhttp = new XMLHttpRequest();
        xhttp.open(
            'POST',
            filename,
            true
        );
        xhttp.setRequestHeader('Content-Type','text/plain')
        xhttp.send(JSON.stringify(saver));
        
    }
    
    //simple query function just needs inputs, gives you outputs
    query(inputs) {
        //initialize results
        let result = transpose(inputs);
        //loop through each layer
        for (let i=0; i<this.weights.length; i++) {
            //apply weights
            result = mult(result, this.weights[i]);
            //apply activation functions
            result = activate(result, this.activations[i]);
        }
        //return variable after every layer of weighting/activating
        return result;
    }

    //training function. requires inputs and outputs and a training factor
    train(inputs, outputs, factor) {
        //record outputs of input layer (the inputs)
        let layerOutputs = [transpose(inputs)];
        //create layer input matrix
        let layerInputs = [];
        //loop through each layer
        for (let i=0; i<this.weights.length; i++) {
            layerInputs.push(mult(layerOutputs[i],this.weights[i]));
            layerOutputs.push(activate(layerInputs[i], this.activations[i]));
        }
        //calculate output error
        let error = [sub(outputs,layerOutputs.pop())];
        //loop through every layer
        for (let i=this.weights.length-1; i>=0; i--) {
            //backprop error before adjusting weights
            let prevError = mult((this.weights[i]),error);
            //find activation derivatives for layer
            let derivs = activeDeriv(layerInputs[i][0],this.activations[i]);
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

function loadnetwork(net, filename) {
    net.loaded = false;
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                let loader = JSON.parse(xhttp.response);
                net.weights = loader.weights;
                net.activations = loader.activations;
                net.loaded = true;
                console.log('Network Loaded From File');
            }
        }
        xhttp.open(
            'GET',
            filename,
            true
        );
        xhttp.send();
}