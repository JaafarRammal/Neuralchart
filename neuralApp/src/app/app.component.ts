import { Component, OnInit } from '@angular/core';
import * as typesJSON from '../assets/types.json';
import { Card } from './services/card';
import { DomSanitizer } from '@angular/platform-browser';

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

  // tree example
  tree: Card[] = [
    {
      title: "test",
      description: "Hey",
      selected: false,
      params: [
        {
          title: "param1",
          value: 3.4
        },
        {
          title: "param2",
          value: 2.7
        },
        {
          title: "param3",
          value: 1.2
        }
      ]
    },
    {
      title: "test2",
      description: "Nops",
      selected: false,
      params: [
        {
          title: "param1",
          value: -1.2
        },
        {
          title: "param3",
          value: 2.7
        },
        {
          title: "param9",
          value: 1.2
        }
      ]
    },
    {
      title: "test3",
      description: "Nops",
      selected: false,
      params: [
        {
          title: "param1",
          value: -1.2
        },
        {
          title: "param3",
          value: 2.7
        },
        {
          title: "param9",
          value: 1.2
        }
      ]
    }
  ]

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
      this.index = -1
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
        item.params.push({title: param["title"], value: 0})
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
