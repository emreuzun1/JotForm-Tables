import produce from 'immer';
import * as type from '../actionTypes';

const initialState = {
  data: [],
  loading: true,
};

export default (state = initialState, action: any) =>
  produce(state, draft => {
    switch (action.type) {
      case type.FORM_SUBMISSION_REQUEST:
        draft.loading = true;
        break;
      case type.FORM_SUBMISSION_SUCCESS:
        draft.data = action.payload;
        draft.loading = false;
        break;
      case type.FORM_SUBMISSION_FAIL:
        draft.loading = false;
        break;
      default:
        return state;
    }
  });