import { Component, OnInit, Input } from '@angular/core';
import { Dice } from '../../models/dice';

@Component({
  selector: 'app-dice',
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss']
})
export class DiceComponent implements OnInit {
  @Input() dice: Dice;
  @Input() overrideDisplayValue: string;

  constructor() { }

  ngOnInit() {
  }

}
