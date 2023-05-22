
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Article } from '../article';
import { ArticleService } from '../article.service';
import { SlideInterface } from '../imageSlider/types/slide.interface';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss']
})
export class CardDetailsComponent implements OnInit {

  article: Article | undefined;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private location: Location
  ) {}

  slides: SlideInterface[] = [] ;


  ngOnInit(): void {
    this.getArticle();
  }

  getArticle(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
      this.articleService.getArticle(id).subscribe(article => {
        this.article = article;
        this.slides = article.images;
      });
  }

  goBack(): void {
    this.location.back();
  }

}
