export interface Comment {
    _id?: string;
    author: string;
    comment: string;
    createdAt?: Date;
    updatedAt?: Date;
    owner: string ;
  }