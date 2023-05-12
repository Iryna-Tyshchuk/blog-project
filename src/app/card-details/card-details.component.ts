
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Article } from '../article';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.css']
})
export class CardDetailsComponent implements OnInit {
  article: Article | undefined;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getArticle();
  }

  getArticle(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.articleService.getArticle(id)
      .subscribe(article => this.article = article);
  }
}
