import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Article } from '../article';
import { ArticleService } from '../article.service';
import { EMPTY, debounceTime, first, of, switchMap, tap } from 'rxjs';

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
  // images: { url: string; titleImg: 'post' }[] = [];
  imagePreview!: string;
  mode = 'create';

  constructor(
    public articleService: ArticleService,
    public route: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      subtitle: new FormControl(null, { validators: [Validators.required] }),
      topic: new FormControl(null, { validators: [Validators.required] }),
      description: new FormControl(null, { validators: [Validators.required] }),
      images: new FormArray([]),
      // images: this.formBuilder.array([])
    });
    this.route.paramMap
      .pipe(
        first(),
        switchMap((paramMap: ParamMap) => {
          if (!paramMap.has('postId')) {
            this.mode = 'create';
            return EMPTY;
          }

          this.mode = 'edit';
          const postId = paramMap.get('postId') as string;

          return this.articleService.getArticle(postId).pipe(
            tap((postData) => {
              if (!postData) return;
              this.form.setValue({
                title: postData.title,
                subtitle: postData.subtitle,
                topic: postData.topic,
                description: postData.description,
                images: [],
              });

              for (const img of postData.images) {
                this.images.push(this.fb.control(img));
              }
            })
          );
        })
      )
      .subscribe();
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    console.table(this.form.value);
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

  deleteImage(image: any) {
    const index = this.images.value.indexOf(image);
    if (index !== -1) this.images.removeAt(index);
  }

  onFileSelected(event: any) {
    const { files } = event.target;
    if (files) this.selectFiler(files);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) this.selectFiler(files);
  }

  selectFiler(files: any) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.images.push(
          this.fb.control({
            url: e.target.result,
            titleImg: 'post',
            isNewPhoto: true,
          })
        );
      };
      reader.readAsDataURL(file);
    }
  }
  get images(): FormArray {
    return <FormArray>this.form.controls['images'];
  }
}
