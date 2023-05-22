import { Component, OnInit } from '@angular/core';

import { Article } from '../article';
import { ArticleService } from '../article.service';
import { TopicService } from '../topic.service';
import { PageEvent } from '@angular/material/paginator';

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
  options: Option[] = [
    { id: '1', value: 'Alphabet' },
    { id: '2', value: 'Date created' },
  ];

  searchText: string = '';
  startDate!: Date;
  endDate!: Date;
  selectedFilter: string = '';
  articles: Article[] = [];
  selectedTopic: string = '';
  totalPosts = 10;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

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
    this.articleService
      .getArticles(this.postsPerPage, this.currentPage)
      .subscribe((articles) => {
        this.articles = articles;
        this.applyFilters();
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
        return articleDate >= this.startDate && articleDate <= this.endDate;
      });
    }

    if (this.selectedFilter === 'Alphabet') {
      filteredArticles = filteredArticles.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    } else if (this.selectedFilter === 'Date created') {
      filteredArticles = filteredArticles.sort(
        (a, b) =>
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

  onChangedPage(pageData: PageEvent) {
    console.log('pageData', pageData);

    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.articleService.getArticles(this.postsPerPage, this.currentPage);
  }
}
