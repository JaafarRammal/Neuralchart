import { Component, OnInit, Input } from '@angular/core';
import { Details } from 'src/app/services/details';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() title: string;
  @Input() description: string;
  @Input() selected: boolean;
  @Input() editable: boolean;
}
