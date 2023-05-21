import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Article } from './article';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private articlesUrl =
    'https://645b67d199b618d5f31a4c59.mockapi.io/api/blog/articles';

  private myBackendUrl = 'http://localhost:3000/api/posts';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  constructor(private http: HttpClient) {}

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.myBackendUrl).pipe(
      tap((_) => this.log('fetched posts')),
      catchError(this.handleError<Article[]>('getPosts', []))
    );
  }

  getArticle(id: string): Observable<Article> {
    const url = `${this.myBackendUrl}/${id}`;
    return this.http.get<Article>(url).pipe(
      tap((_) => this.log(`fetched post id=${id}`)),
      catchError(this.handleError<Article>(`getPost id=${id}`))
    );
  }


  // getArticlesByTopic(topic: string): Observable<Article[]> {
  //   const params = topic ? { topic: topic } : {};
  //   return this.http.get<Article[]>(`${this.myBackendUrl}/posts/topic`, { params });
  // }

  // getArticlesByTopic(topic: string): Observable<Article[]> {
  //   const params = topic ? { topic: topic } : {};
  //   return this.http.get<Article[]>(`${this.apiUrl}/posts/topic`, { params });
  // }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    // this.messageService.add(`HeroService: ${message}`);
    console.log('message', message);
  }

  updateArticle(article: Article): Observable<any> {
    return this.http.put(this.articlesUrl, article, this.httpOptions).pipe(
      tap((_) => this.log(`updated post id=${article.id}`)),
      catchError(this.handleError<any>('updatePost'))
    );
  }

  /** POST: add a new hero to the server */
  addArticle(article: any, file: any): Observable<Article> {
    return this.http
      .post<Article>(this.myBackendUrl, article, this.httpOptions)
      .pipe(
        tap((newArticle: Article) =>
          this.log(`added post w/ id=${newArticle._id}`)
        ),
        catchError(this.handleError<Article>('addPost'))
      );
  }

  /** DELETE: delete the hero from the server */
  deleteArticle(id: string): Observable<Article> {
    const url = `${this.articlesUrl}/${id}`;

    return this.http.delete<Article>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Article>('deleteArticle'))
    );
  }

  /* GET heroes whose name contains search term */
  searchArticles(term: string): Observable<Article[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Article[]>(`${this.articlesUrl}/?name=${term}`).pipe(
      tap((x) =>
        x.length
          ? this.log(`found posts matching "${term}"`)
          : this.log(`no posts matching "${term}"`)
      ),
      catchError(this.handleError<Article[]>('searchPosts', []))
    );
  }
}
