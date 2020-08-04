import { Component, OnInit } from '@angular/core';
import * as typesJSON from '../assets/types.json';
import { Card } from './services/card';
import { DomSanitizer } from '@angular/platform-browser';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  index: number = -1; // card in tree selected
  types:  any  = (typesJSON  as  any).default; // types of blocks
  insert: number = 0; // where to insert next block
  selecting = false; // if selecting to insert a block
  template: number = -1// selected template from blocks selection
  link = null

  // tree
  tree: Card[] = []

  constructor(private sanitizer: DomSanitizer){
    this.clearCard()
  }
  
  ngOnInit(){

  }

  openConfig(){

  }

  saveConfig(){
    let jsonObject = {};  
    for(var i=0; i<this.tree.length; i++){
      jsonObject[i] = this.tree[i]
    } 
    let json = JSON.stringify(jsonObject);  
    var uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(json));
    this.link = uri
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

  // set card to view parameters
  setCard(i){
    this.clearCard();
    this.index = i;
    this.tree[i].selected = true;
    this.template = -1;
    this.selecting = true
  }

  clearCard(){
    for(var i=0; i<this.tree.length; i++){
      this.tree[i].selected = false
    }
    this.selecting = false
    this.index = -1
  }

  deleteCard(){
    if (this.index > -1) {
      this.tree.splice(this.index, 1);
      this.clearCard()
    }
  }

  addCard(i){
    if(this.template != -1){
      var item: Card = {
        title: this.types[this.template].type,
        description: this.types[this.template].description,
        params: [],
        selected: false
      }
      this.types[this.template]["params"].forEach(param => {
        item.params.push({title: param["title"], value: param["value"]})
      });
      this.tree.splice(i, 0, item)
      this.template = -1
    }
    if(this.index != -1){
      if(this.index < i) i--;
      i = i > 0 ? i : 0
      var temp: Card = this.tree[this.index]
      this.deleteCard()
      this.tree.splice(i, 0, temp)
      this.index = -1
      this.clearCard()
    }
    this.selecting = false
    this.clearCard()
  }
}
