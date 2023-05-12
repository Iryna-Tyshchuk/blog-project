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
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

  articles: Article[] = [];

  options: Option[] = [
    {id: '1', value: 'Alphabet'},
    {id: '2', value: 'Date created'},
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
