import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Article } from './article';
import { Comment } from './comment';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private myBackendUrl = 'http://localhost:3000/api/posts';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };
  httpOptionsFiles = {
    headers: new HttpHeaders({
      'Content-Type': 'multipart/form-data',
    }),
  };

  constructor(private http: HttpClient) {}

  // getArticles(filters: any): Observable<Article[]> {
  //   return this.http
  //     .get<Article[]>(`${this.myBackendUrl}`, { params: filters })
  //     .pipe(
  //       tap((_) => this.log('fetched posts')),
  //       catchError(this.handleError<Article[]>('getPosts', []))
  //     );
  // }

  getArticle(id: string): Observable<Article> {
    const url = `${this.myBackendUrl}/${id}`;
    return this.http.get<Article>(url).pipe(
      tap((_) => this.log(`fetched post id=${id}`)),
      catchError(this.handleError<Article>(`getPost id=${id}`))
    );
  }

  getArticles(
    params: any
  ): Observable<{ posts: Article[]; totalPosts: number }> {
    const url = `${this.myBackendUrl}`;
    return this.http.get<{ posts: Article[]; totalPosts: number }>(url, {
      params,
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    // this.messageService.add(`HeroService: ${message}`);
    console.log('message', message);
  }

  updateArticle(postId: string, formData: FormData): Observable<any> {
    const url = `${this.myBackendUrl}/${postId}`;
    return this.http.put(url, formData).pipe(
      tap((_) => this.log(`updated post id=${postId}`)),
      catchError(this.handleError<any>('updatePost'))
    );
  }

  addArticle(formData: FormData): Observable<any> {
    return this.http.post(`${this.myBackendUrl}`, formData).pipe(
      tap((newArticle) => this.log(`added post w/ id=${newArticle}`)),
      catchError(this.handleError('addPost'))
    );
  }

  deleteArticle(id: string): Observable<Article> {
    const url = `${this.myBackendUrl}/${id}`;

    return this.http.delete<Article>(url, this.httpOptions).pipe(
      tap((_) => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Article>('deleteArticle'))
    );
  }

  searchArticles(term: string): Observable<Article[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Article[]>(`${this.myBackendUrl}/?name=${term}`).pipe(
      tap((x) =>
        x.length
          ? this.log(`found posts matching "${term}"`)
          : this.log(`no posts matching "${term}"`)
      ),
      catchError(this.handleError<Article[]>('searchPosts', []))
    );
  }

  getCommentsForPost(postId: string): Observable<Comment[]> {
    const url = `${this.myBackendUrl}/${postId}/comments`;
    return this.http.get<Comment[]>(url).pipe(
      tap((_) => this.log(`fetched comments for post id=${postId}`)),
      catchError(
        this.handleError<Comment[]>(`getCommentsForPost postId=${postId}`)
      )
    );
  }

  createCommentForPost(postId: string, comment: Comment): Observable<Comment> {
    const url = `${this.myBackendUrl}/${postId}/comments`;
    return this.http.post<Comment>(url, comment, this.httpOptions).pipe(
      tap((_) => this.log(`created comment for post id=${postId}`)),
      catchError(
        this.handleError<Comment>(`createCommentForPost postId=${postId}`)
      )
    );
  }
}
