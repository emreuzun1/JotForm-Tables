import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import TextInputMask from 'react-native-text-input-mask';
import {StyleSheet} from 'react-native';

import style from 'styled-components/native';
import {ISubmissionEdit} from '../../../Interfaces/SubmissionEditInterface';
import {Colors} from '../../../constants/Colors';

const StyledContainer = style.View({
  width: '100%',
  marginTop: 24,
  marginHorizontal: 15,
});

const StyledHeader = style.Text({
  color: Colors.grey,
  fontSize: 20,
  maxWidth: '80%',
});

const StyledInputContainer = style.View({
  width: '50%',
});

const StyledSubTitles = style.Text({
  fontSize: 13,
  marginTop: 4,
  color: Colors.grey,
});

const StyledErrorText = style.Text({
  fontSize: 13,
  marginTop: 4,
  color: Colors.lightRed,
});

const phoneValidationSchema = Yup.object().shape({
  phone: Yup.string().min(14, 'Too Short!').required('Required'),
});

export function PhoneEdit({answer, question, onPress}: ISubmissionEdit) {
  const initialValues: any = {
    phone: answer
      ? answer!.prettyFormat
        ? answer!.prettyFormat
        : answer!.answer
      : '',
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values: any) => onPress(question.qid, values.phone)}
      validationSchema={phoneValidationSchema}>
      {({handleChange, handleBlur, values, handleSubmit, errors, touched}) => (
        <StyledContainer>
          <StyledHeader>{question.text}</StyledHeader>
          <StyledInputContainer>
            <TextInputMask
              style={styles.textInputMask}
              value={values.phone}
              onChangeText={handleChange('phone')}
              onBlur={handleBlur('phone')}
              onEndEditing={handleSubmit}
              keyboardType="number-pad"
              mask={'([000]) [000]-[00][00]'}
            />
            <StyledSubTitles>
              {
                // @ts-ignore: Unreachable code error
                question.sublabels!.masked
              }
            </StyledSubTitles>
            {errors.phone && touched.phone ? (
              <StyledErrorText>{errors.phone}</StyledErrorText>
            ) : null}
          </StyledInputContainer>
        </StyledContainer>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  textInputMask: {
    width: '100%',
    height: 46,
    backgroundColor: Colors.darkBlue,
    borderRadius: 6,
    padding: 8,
    color: 'white',
    fontSize: 15,
    marginTop: 4,
  },
});
