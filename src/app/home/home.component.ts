import { Component, OnInit } from '@angular/core';

import { Article } from '../article';
import { ArticleService } from '../article.service';
interface Option {
  id: string;
  value: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {

  articles: Article[] = [];

  options: Option[] = [
    {id: 'steak-0', value: 'alphabet'},
    {id: 'pizza-1', value: 'date created'},
  ];

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.getArticles();
  }

  getArticles(): void {
    this.articleService
      .getArticles()
      .subscribe((articles) => (this.articles = articles));
  }
}
