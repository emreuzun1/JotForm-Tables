import {call, put, takeLatest} from 'redux-saga/effects';
import {
  getSubmissionsApi,
  editSubmissionApi,
  postNewSubmission,
  deleteSubmissionApi,
} from '../../lib/api';
import {IActionInterface} from '../../Interfaces/actionInterface';
import Toast from 'react-native-toast-message';

import {
  FORM_SUBMISSION_REQUEST,
  FORM_SUBMISSION_SUCCESS,
  FORM_SUBMISSION_FAIL,
  FORM_SUBMISSIONPOST_REQUEST,
  NEW_SUBMISSION_POST,
  SUBMISSION_DELETE_REQUEST,
} from '../actionTypes';

function* getSubmissions(action: IActionInterface) {
  try {
    const {apikey, id} = action.payload;
    const {
      data: {content, responseCode},
    } = yield call(getSubmissionsApi, apikey, id);
    if (responseCode === 200) {
      yield put({
        type: FORM_SUBMISSION_SUCCESS,
        payload: content.filter((item: any) => item.status === 'ACTIVE'),
      });
    } else {
      yield put({type: FORM_SUBMISSION_FAIL});
    }
  } catch (err) {}
}

function* editSubmission(action: IActionInterface) {
  try {
    const {apikey, id, qid, values, name} = action.payload;
    yield call(editSubmissionApi, apikey, id, qid, values, name);
  } catch (err) {}
}

function* postNewSubmissionSaga(action: IActionInterface) {
  try {
    const {apikey, id, data} = action.payload;
    const {
      data: {responseCode},
    } = yield call(postNewSubmission, apikey, id, data);
    if (responseCode === 200)
      Toast.show({
        type: 'success',
        text1: 'Added!',
        text2: `Submission successfully added.`,
        position: 'bottom',
        visibilityTime: 1500,
      });
  } catch (err) {}
}

function* deleteSubmission(action: IActionInterface) {
  try {
    const {apikey, submissionId} = action.payload;
    const {
      data: {responseCode, content},
    } = yield call(deleteSubmissionApi, apikey, submissionId);
    if (responseCode === 200) {
      Toast.show({
        type: 'success',
        text1: 'Deleted',
        text2: `${content}`,
        position: 'bottom',
        visibilityTime: 1500,
      });
    }
  } catch (err) {}
}

const submissionSaga = [
  takeLatest(FORM_SUBMISSION_REQUEST, getSubmissions),
  takeLatest(FORM_SUBMISSIONPOST_REQUEST, editSubmission),
  takeLatest(NEW_SUBMISSION_POST, postNewSubmissionSaga),
  takeLatest(SUBMISSION_DELETE_REQUEST, deleteSubmission),
];

export default submissionSaga;
