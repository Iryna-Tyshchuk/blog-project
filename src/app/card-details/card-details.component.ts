import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ArticleService } from '../article.service';
import { SlideInterface } from '../imageSlider/types/slide.interface';
import { Article } from '../article';
import { Comment } from '../comment';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss'],
})
export class CardDetailsComponent implements OnInit {
  article: Article | undefined;

  comments: Comment[] = [];

  newComment: Comment = {
    author: '',
    comment: '',
    owner: '',
  };

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private location: Location
  ) {}

  slides: SlideInterface[] = [];

  ngOnInit(): void {
    this.getArticle();
  }

  getArticle(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.articleService.getArticle(id).subscribe((article) => {
      this.article = article;
      this.slides = article.images;

      this.getComments();
    });
  }

  getComments(): void {
    if (this.article) {
      this.articleService
        .getCommentsForPost(this.article._id)
        .subscribe((comments) => {
          this.comments = comments;
        });
    }
  }

  createComment(): void {
    if (this.article) {
      this.articleService
        .createCommentForPost(this.article._id, this.newComment)
        .subscribe((comment) => {
          this.comments.push(comment);
          this.newComment = { author: '', comment: '', owner: '' };
        });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
