
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

  slides: SlideInterface[] = [
    { url: '/assets/image-1.jpeg', title: 'beach' },
    { url: '/assets/image-2.jpeg', title: 'boat' },
    { url: '/assets/image-3.jpeg', title: 'forest' },
    { url: '/assets/image-4.jpeg', title: 'city' },
    { url: '/assets/image-5.jpeg', title: 'italy' },
  ];


  ngOnInit(): void {
    this.getArticle();
  }

  getArticle(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.articleService.getArticle(id)
      .subscribe(article => this.article = article);
  }

  goBack(): void {
    this.location.back();
  }

}
