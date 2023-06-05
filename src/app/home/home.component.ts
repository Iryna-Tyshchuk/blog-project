import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

import { Article } from '../article';
import { ArticleService } from '../article.service';
import { TopicService } from '../topic.service';
import { Subscription } from 'rxjs';

interface Option {
  id: string;
  value: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
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
  totalPosts = 0;
  postsPerPage = 6;
  currentPage = 1;
  pageSizeOptions = [6, 12, 18];

  private topicSubscription: Subscription | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private articleService: ArticleService,
    private topicService: TopicService
  ) {}

  ngOnInit(): void {
    this.topicSubscription = this.topicService.selectedTopic$.subscribe(
      (topic) => {
        this.selectedTopic = topic;
        this.searchPosts();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.topicSubscription) {
      this.topicSubscription.unsubscribe();
    }
  }

  onChangedPage(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.postsPerPage = event.pageSize;
    this.searchPosts();
  }

  onFilter(): void {
    this.searchPosts();
  }

  searchByTitle(): void {
    this.searchPosts();
  }

  searchByDateRange(): void {
    this.searchPosts();
  }

  searchPosts(): void {
    const queryParams: any = {
      page: this.currentPage,
      perPage: this.postsPerPage,
    };

    if (this.searchText) {
      queryParams.search = this.searchText;
    }
    if (this.startDate && this.endDate) {
      queryParams.startDate = this.startDate;
      queryParams.endDate = this.endDate;
    }
    if (this.selectedTopic) {
      queryParams.topic = this.selectedTopic;
    }
    if (this.selectedFilter) {
      queryParams.filter = this.selectedFilter;
    }

    this.articleService.getArticles(queryParams).subscribe((result) => {
      this.articles = result.posts;
      this.totalPosts = result.totalPosts;
    });
  }
}
