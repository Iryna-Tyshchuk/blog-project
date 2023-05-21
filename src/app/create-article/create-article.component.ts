import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Article } from '../article';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss'],
})
export class CreateArticleComponent implements OnInit {
  form!: FormGroup;
  title = '';
  subTitle = '';
  topic = '';
  article!: Article;
  images: { url: string , titleImg: "post"}[] = [];
  imagePreview!: string;
  private mode = 'create';
  private postId!: string | null;

  constructor(
    public articleService: ArticleService,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      subtitle: new FormControl(null, { validators: [Validators.required] }),
      topic: new FormControl(null, { validators: [Validators.required] }),
      description: new FormControl(null, { validators: [Validators.required] }),
      images: new FormControl(this.images),
      // images: this.formBuilder.array([])
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');

        this.articleService.getArticle(this.postId!).subscribe((postData) => {
          this.article = {
            _id: postData._id,
            title: postData.title,
            subtitle: postData.subtitle,
            topic: postData.topic,
            description: postData.description,
            images: postData.images,
            postDate: postData.postDate
          };
          this.form.setValue({
            title: this.article.title,
            subtitle: this.article.subtitle,
            topic: this.article.topic,
            description: this.article.description,
            images: this.article.images
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    console.log(this.form.value);
    this.articleService.addArticle({ ...this.form.value }, null);
    this.form.reset();
    // popUp ваш пост доданий успішно
    // почистити масив картинок і редірект на home

  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.images.push({ url: e.target.result , titleImg: "post"});
        };
        reader.readAsDataURL(file);
      }
    }
  }

  deleteImage(image: any) {
    const imageIndex = this.images.indexOf(image);
    if (imageIndex !== -1) {
      this.images.splice(imageIndex, 1);
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.images.push({ url: e.target.result, titleImg: "post" });
        };
        reader.readAsDataURL(file);
      }
    }
  }

}
