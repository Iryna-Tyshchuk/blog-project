import { SlideInterface } from "./imageSlider/types/slide.interface";

export interface Article {
  createdAt?: string;
  title: string;
  image?: string;
  subtitle?: string;
  description?: string;
  topic?: string;
  postDate: Date;
  id?: any;
  // images?: Array<any>;
  images: SlideInterface[];
  _id: string; // in mongodb id is a string
}
