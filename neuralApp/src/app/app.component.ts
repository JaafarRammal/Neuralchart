import { Component } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(){

  }

  ngInit(){

  }

  openConfig(){

  }

  saveConfig(){

  }

  generatePython(){
    console.log("sdf")
    axios.post(encodeURI('http://localhost:3000/download'), {
      "hyperparameters": {
        "optimiser": "adam",
        "loss": "BinaryCrossentropy"
      },
      "nodes": [{
        "type": "Input",
        "params": {
          "data_type": "Image",
          "dimensions": [26, 26, 26]
        }
      },
        {
          "type": "Flatten",
          "params": {}
        }, {
          "type": "Fully Connected Layer",
          "params": {
            "units": 5.0,
            "activation": "ReLU",
            "use_bias": true
          }
        }
      ]
    }).then((apiResponse) => {
      console.log(apiResponse);
    }).catch(() => {
      console.log("error!");
    });
  }

}
