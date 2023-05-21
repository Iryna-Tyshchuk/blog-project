export interface Article {
  createdAt?: string;
  title: string;
  image?: string;
  subtitle?: string;
  description?: string;
  topic?: string;
  // date: number;
  id?: any;
  images?: Array<any>;

  _id: string; // in mongodb id is a string
}
