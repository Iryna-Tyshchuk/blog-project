import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CardDetailsComponent } from './card-details/card-details.component';
import { CreateArticleComponent } from './create-article/create-article.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'articles/:id', component: CardDetailsComponent},
  { path: 'article', component: CreateArticleComponent },
  { path: "edit/:postId", component: CreateArticleComponent},
  
  { path: "**", redirectTo: "", component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
