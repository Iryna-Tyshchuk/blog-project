import { Component, Input } from '@angular/core';
import { Article } from '../article';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() article!: Article;
  
}
