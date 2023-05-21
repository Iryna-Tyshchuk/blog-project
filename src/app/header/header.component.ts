import { Component, OnInit } from '@angular/core';
import { TopicService } from '../topic.service';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  
  selectedTopic: string = '';
  isHomePage: boolean = false;

  constructor(private topicService: TopicService, private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event: RouterEvent | any) => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.url === '/';
      }
    });
  }

  selectTopic(topic: string): void {
    this.selectedTopic = topic;
    this.topicService.setSelectedTopic(topic);
  }
}
