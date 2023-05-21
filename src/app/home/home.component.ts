import { Component, OnInit } from '@angular/core';

import { Article } from '../article';
import { ArticleService } from '../article.service';
import { TopicService } from '../topic.service';

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
  
  // currentArticle = '';
  options: Option[] = [
    { id: '1', value: 'Alphabet' },
    { id: '2', value: 'Date created' },
  ];
  searchText: string = '';
  startDate: Date = new Date();
  endDate: Date = new Date();
  selectedFilter: string = '';
  articles: Article[] = [];
  selectedTopic: string = '';

  constructor(
    private articleService: ArticleService,
    private topicService: TopicService
  ) {}


  ngOnInit(): void {
    this.getArticles();
    this.topicService.selectedTopic$.subscribe((topic: string) => {
      this.selectedTopic = topic;
      this.getArticles();
    });
  }

  getArticles(): void {
    this.articleService.getArticles().subscribe((articles) => {
      this.articles = articles;
      // this.applyFilters();
    });
  }

  applyFilters(): void {
    let filteredArticles = [...this.articles];

    if (this.selectedTopic) {
      filteredArticles = filteredArticles.filter(
        (article) => article.topic === this.selectedTopic
      );
    }

    if (this.searchText) {
      filteredArticles = filteredArticles.filter((article) =>
        article.title.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    if (this.startDate && this.endDate) {
      filteredArticles = filteredArticles.filter((article) => {
        const articleDate = new Date(article.postDate);
        return (
          articleDate >= this.startDate && articleDate <= this.endDate
        );
      });
    }

    if (this.selectedFilter === 'Alphabet') {
      filteredArticles = filteredArticles.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    } else if (this.selectedFilter === 'Date created') {
      filteredArticles = filteredArticles.sort((a, b) =>
        new Date(b.postDate).getTime() - new Date(a.postDate).getTime()
      );
    }

    this.articles = filteredArticles;
  }

  searchByTitle(): void {
    this.applyFilters();
  }

  searchByDateRange(): void {
    this.applyFilters();
  }

  applyFilter(): void {
    this.applyFilters();
  }
}
