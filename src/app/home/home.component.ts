import { Component, OnInit } from '@angular/core';

import { Article } from '../article';
import { ArticleService } from '../article.service';
import { TopicService } from '../topic.service';
// import { TopicService } from '../topic.service';
interface Option {
  id: string;
  value: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  
  currentArticle = '';
  options: Option[] = [
    { id: '1', value: 'Alphabet' },
    { id: '2', value: 'Date created' },
  ];
  
  // articles: Article[] = [];
  // selectedTopic: string = '';

  // constructor(private articleService: ArticleService, private topicService: TopicService) {}

  // ngOnInit(): void {
  //   this.topicService.selectedTopic$.subscribe((topic: string) => {
  //     this.selectedTopic = topic;
  //     this.getArticles();
  //   });
  // }

  // getArticles(): void {
  //   this.articleService.getArticlesByTopic(this.selectedTopic).subscribe(
  //     (articles) => {
  //       this.articles = articles;
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  // }

  // selectTopic(topic: string): void {
  //   this.topicService.setSelectedTopic(topic);
  // }














  articles: Article[] = [];
  selectedTopic: string = '';

  constructor(
    private articleService: ArticleService,
    private topicService: TopicService
  ) {}

  ngOnInit(): void {
    this.topicService.selectedTopic$.subscribe((topic: string) => {
      this.selectedTopic = topic;
      this.getArticles();
    });
  }

  getArticles(): void {
    this.articleService.getArticles().subscribe((articles) => {
      if (this.selectedTopic) {
        this.articles = articles.filter((article) => article.topic === this.selectedTopic);
      } else {
        this.articles = articles;
      }
    });
  }
}
