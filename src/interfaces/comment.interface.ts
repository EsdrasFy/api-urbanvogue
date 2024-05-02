export interface CommentI {
    comment_id: number;
    text_comment: string;
    user_id: number;
    user_img: string;
    product_id: number;
    rating: number;
    username: string;
    recommend: boolean;
    createdAt: Date; 
  }