export default {
  collection(data) {
    data.rows = data.rows.map(row => this.item(row));
    return data;
  },
  async item(review) {
    const reviewer = await review.getReviewer();

    return {
      created_on: review.created_on,
      review_id: review.review_id,
      review: review.review,
      rating: review.rating,
      reviewer: reviewer.name,
      product_id: review.product_id,
    };
  },
};
