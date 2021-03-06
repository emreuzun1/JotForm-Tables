import React, {FC} from 'react';
import {VirtualizedList, StyleSheet} from 'react-native';
import styled from 'styled-components/native';

import {SubmissionTitleCard} from '../../components';
import {Colors} from '../../constants/Colors';
import {QuestionInterface} from '../../Interfaces/QuestionInterface';

interface ITitleProps {
  questionData: QuestionInterface[];
}

const StyledHeaderBackground = styled.View({
  width: '100%',
  marginLeft: 15,
  backgroundColor: Colors.black,
});

const Titles: FC<ITitleProps> = ({questionData}) => {
  return (
    <StyledHeaderBackground>
      <VirtualizedList
        horizontal
        scrollEnabled={false}
        keyExtractor={(item: any, index: number) => {
          return `${index}_${item.text}`;
        }}
        contentContainerStyle={styles.headerContainer}
        initialNumToRender={4}
        data={questionData}
        // @ts-ignore: Unreachable code error
        getItem={(data: QuestionInterface[], index: number) => ({
          question: data[index],
          index: index,
        })}
        getItemCount={data => data.length}
        renderItem={({item: {question}, index}) => (
          <SubmissionTitleCard question={question} index={index} />
        )}
      />
    </StyledHeaderBackground>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
  },
});

export default Titles;
