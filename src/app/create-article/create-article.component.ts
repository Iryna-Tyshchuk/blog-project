// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, ParamMap } from '@angular/router';
// import {
//   FormArray,
//   FormBuilder,
//   FormControl,
//   FormGroup,
//   Validators,
// } from '@angular/forms';

// import { ArticleService } from '../article.service';
// import { EMPTY, debounceTime, first, of, switchMap, tap } from 'rxjs';

// @Component({
//   selector: 'app-create-article',
//   templateUrl: './create-article.component.html',
//   styleUrls: ['./create-article.component.scss'],
// })
// export class CreateArticleComponent implements OnInit {
//   form!: FormGroup;
//   title = '';
//   subTitle = '';
//   topic = '';
//   // images: { url: string; titleImg: 'post' }[] = [];
//   imagePreview!: string;
//   mode = 'create';

//   constructor(
//     public articleService: ArticleService,
//     public route: ActivatedRoute,
//     private fb: FormBuilder
//   ) {}

//   ngOnInit() {
//     this.form = new FormGroup({
//       title: new FormControl(null, { validators: [Validators.required] }),
//       subtitle: new FormControl(null, { validators: [Validators.required] }),
//       topic: new FormControl(null, { validators: [Validators.required] }),
//       description: new FormControl(null, { validators: [Validators.required] }),
//       // images: new FormArray([]),
//       images: this.fb.array([]),
//       // images: this.formBuilder.array([])
//     });
//     this.route.paramMap
//       .pipe(
//         first(),
//         switchMap((paramMap: ParamMap) => {
//           if (!paramMap.has('postId')) {
//             this.mode = 'create';
//             return EMPTY;
//           }

//           this.mode = 'edit';
//           const postId = paramMap.get('postId') as string;

//           return this.articleService.getArticle(postId).pipe(
//             tap((postData) => {
//               if (!postData) return;
//               this.form.setValue({
//                 title: postData.title,
//                 subtitle: postData.subtitle,
//                 topic: postData.topic,
//                 description: postData.description,
//                 images: [],
//               });

//               for (const img of postData.images) {
//                 this.images.push(this.fb.control(img));
//               }
//             })
//           );
//         })
//       )
//       .subscribe();
//   }

//   onSavePost() {
//     if (this.form.invalid) {
//       return;
//     }
//     const formData = new FormData();
//     console.log(this.form.value);
//     formData.append('title', this.form.value.title);
//     formData.append('subtitle', this.form.value.subtitle);
//     formData.append('description', this.form.value.description);
//     formData.append('topic', this.form.value.topic);
//     const images = this.form.value.images;
//     for (let i = 0; i < images.length; i++) {
//       formData.append('images', images[i]);
//     }
//     this.articleService.addArticle(formData);
//     this.form.reset();
//     // popUp ваш пост доданий успішно
//     // почистити масив картинок і редірект на home
//   }

//   onDragOver(event: DragEvent) {
//     event.preventDefault();
//   }

//   onDragLeave(event: DragEvent) {
//     event.preventDefault();
//   }

//   deleteImage(image: any) {
//     const index = this.images.value.indexOf(image);
//     if (index !== -1) this.images.removeAt(index);
//   }

//   onFileSelected(event: any) {
//     const { files } = event.target;
//     if (files) this.selectFiler(files);
//   }

//   onDrop(event: DragEvent) {
//     event.preventDefault();
//     const files = event.dataTransfer?.files;
//     if (files) this.selectFiler(files);
//   }

//   selectFiler(files: any) {
//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const reader = new FileReader();
//       reader.onload = (e: any) => {
//         this.images.push(
//           this.fb.control({
//             url: e.target.result,
//             titleImg: 'post',
//             isNewPhoto: true,
//           })
//         );
//       };
//       reader.readAsDataURL(file);
//     }
//   }
//   get images(): FormArray {
//     return <FormArray>this.form.controls['images'];
//   }
// }

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { ArticleService } from '../article.service';
import { EMPTY, first, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss'],
})
export class CreateArticleComponent implements OnInit {
  form!: FormGroup;
  mode = 'create';

  constructor(
    public articleService: ArticleService,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: [null, Validators.required],
      subtitle: [null, Validators.required],
      topic: [null, Validators.required],
      description: [null, Validators.required],
      images: this.fb.array([]),
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
              this.form.patchValue({
                title: postData.title,
                subtitle: postData.subtitle,
                topic: postData.topic,
                description: postData.description,
              });

              const imagesArray = this.form.get('images') as FormArray;
              postData.images.forEach((image) => {
                imagesArray.push(this.fb.control(image));
              });
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

    const formData = new FormData();
    formData.append('title', this.form.value.title);
    formData.append('subtitle', this.form.value.subtitle);
    formData.append('description', this.form.value.description);
    formData.append('topic', this.form.value.topic);

    const images = this.form.value.images;
    images.forEach((image: any) => {
      formData.append('images', image.file);
    });
    if (this.mode === 'create') {
      this.articleService.addArticle(formData).subscribe(() => {
        this.form.reset();
        this.images.clear();
        this.snackBar.open('Added successful', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/home']);
      });
    } else if (this.mode === 'edit') {
      const postId = this.route.snapshot.paramMap.get('postId') as string;
      this.articleService.updateArticle(postId, formData).subscribe(() => {
        this.form.reset();
        this.images.clear();
        this.snackBar.open('Updated successful', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/home']);
      });
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  deleteImage(index: number) {
    const imagesArray = this.form.get('images') as FormArray;
    imagesArray.removeAt(index);
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.selectFiles(files);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      this.selectFiles(files);
    }
  }

  selectFiles(files: FileList) {
    const imagesArray = this.form.get('images') as FormArray;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageControl = this.fb.group({
          file: file,
          url: e.target.result,
          titleImg: 'post',
          isNewPhoto: true,
        });
        imagesArray.push(imageControl);
      };
      reader.readAsDataURL(file);
    }
  }

  get images(): FormArray {
    return this.form.get('images') as FormArray;
  }
}
