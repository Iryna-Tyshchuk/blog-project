import { Component, OnInit } from '@angular/core';
import { TopicService } from '../topic.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  
  selectedTopic: string = '';

  constructor(private topicService: TopicService) {}

  ngOnInit(): void {}

  selectTopic(topic: string): void {
    this.selectedTopic = topic;
    this.topicService.setSelectedTopic(topic);
  }
}
