import { NameSpace, ReviewStatus } from '../../../const';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchReviewsAction, postReviewAction } from './api-actions';
import { Review } from '../../../types/review';

type ReviewsData = {
  reviews: Review[];
  isReviewsLoading: boolean;
  isReviewsStatusSubmitting: boolean;
  reviewsStatus: ReviewStatus;
  hasError: boolean;
};

const initialState: ReviewsData = {
  reviews: [],
  isReviewsLoading: false,
  isReviewsStatusSubmitting: false,
  reviewsStatus: ReviewStatus.Idle,
  hasError: false,
};
export const reviewsData = createSlice({
  name: NameSpace.ReviewsData,
  initialState,
  reducers: {
    setReviewsErrorStatus: (state, action: PayloadAction<ReviewStatus>) => {
      state.reviewsStatus = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchReviewsAction.pending, (state) => {
        state.hasError = false;
        state.isReviewsLoading = true;
      })
      .addCase(fetchReviewsAction.fulfilled, (state, action) => {
        state.reviews = action.payload;
        state.isReviewsLoading = false;
      })
      .addCase(fetchReviewsAction.rejected, (state) => {
        state.hasError = true;
        state.isReviewsLoading = false;
      })
      .addCase(postReviewAction.pending, (state) => {
        state.reviewsStatus = ReviewStatus.Loading;
        state.isReviewsStatusSubmitting = true;
      })
      .addCase(postReviewAction.fulfilled, (state, action) => {
        state.reviewsStatus = ReviewStatus.Success;
        state.isReviewsStatusSubmitting = false;
        state.reviews.push(action.payload);
      })
      .addCase(postReviewAction.rejected, (state) => {
        state.reviewsStatus = ReviewStatus.Error;
        state.isReviewsStatusSubmitting = false;
      });
  },
});

export const { setReviewsErrorStatus } = reviewsData.actions;
