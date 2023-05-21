import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private selectedTopicSubject: BehaviorSubject<string> = new BehaviorSubject<string>('Home');
  public selectedTopic$: Observable<string> = this.selectedTopicSubject.asObservable();

  constructor() {}

  getSelectedTopic(): string {
    return this.selectedTopicSubject.getValue();
  }

  setSelectedTopic(topic: string): void {
    this.selectedTopicSubject.next(topic);
  }
}
