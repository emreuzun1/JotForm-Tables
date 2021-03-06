/* eslint-disable no-shadow */
import React, {FC, useEffect, useRef, useMemo} from 'react';
import {
  View,
  VirtualizedList,
  Dimensions,
  StyleSheet,
  LogBox,
} from 'react-native';
import {useSelector, connect} from 'react-redux';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp, useIsFocused} from '@react-navigation/native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import AntIcon from 'react-native-vector-icons/AntDesign';

import {RootStackParamList} from '../../Navigation/types';
import {getForm} from '../../redux/actions/formAction';
import {getActiveForms} from '../../redux/reducers/selector';
import {IState} from '../../Interfaces/actionInterface';
import {persistor} from '../../redux/store';

import {Loading} from '../../components';
import {FormCard} from '../../components';
import {
  requestLogout,
  resetQuestions,
  resetSubmissions,
} from '../../redux/actions';
import {Colors, getColor} from '../../constants/Colors';
import {FormInterface} from '../../Interfaces/FormsInterface';
import {BottomSheetModal, BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import OrderSheet from '../../components/OrderSheet';

type FormProps = StackNavigationProp<RootStackParamList, 'Form'>;
type FormRouteProp = RouteProp<RootStackParamList, 'Form'>;

const ViewWithSpinner = Loading(View);
const {width} = Dimensions.get('screen');

const StyledContainer = styled.View({
  flex: 1,
  backgroundColor: Colors.black,
});

const StyledLogOutContainer = styled.TouchableOpacity({
  marginLeft: width / 20,
});

const StyledOrderButton = styled.TouchableOpacity({
  width: '100%',
  marginTop: 24,
  marginLeft: 16,
  justifyContent: 'center',
  flexDirection: 'row',
  alignItems: 'center',
});

const StyledOrderText = styled.Text({
  color: Colors.lightGrey,
  marginRight: 4,
});

const StyledHandleContainer = styled.View({
  width: '100%',
  height: 30,
  backgroundColor: Colors.black,
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledHandleLine = styled.View({
  width: 92,
  height: 3,
  backgroundColor: 'white',
  borderRadius: 3,
});

interface Props {
  navigation: FormProps;
  route: FormRouteProp;
  loading: boolean;
  orderType: string;
  getForm: () => void;
  requestLogout: () => void;
  resetQuestions: () => void;
  resetSubmissions: () => void;
}

const FormPage: FC<Props> = props => {
  const data: FormInterface[] = useSelector(getActiveForms);
  const orderSheetModal = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['0%', '50%'], []);

  const {
    navigation,
    loading,
    orderType,
    requestLogout,
    getForm,
    resetQuestions,
    resetSubmissions,
  } = props;
  const isFocused = useIsFocused();

  const logOut = async () => {
    requestLogout();
    await persistor.purge().then(() => {
      navigation.navigate('Login', {
        isLogged: false,
      });
    });
  };

  useEffect(() => {
    LogBox.ignoreLogs(['Node of type rule not supported as an inline style']);
    let isActive = true;
    if (isActive) {
      resetQuestions();
      resetSubmissions();
      getForm();
    }
  }, [getForm, isFocused, resetQuestions, resetSubmissions]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'My Forms',
      headerTitleStyle: {
        color: Colors.lightGrey,
      },
      headerStyle: {
        backgroundColor: Colors.darkBlue,
      },
      headerLeft: () => (
        <StyledLogOutContainer onPress={logOut}>
          <Icon name="logout" size={24} color={Colors.lightGrey} />
        </StyledLogOutContainer>
      ),
    });
  });

  const getItem = (data: any, index: number) => ({
    id: data[index].id,
    title: data[index].title,
    updated_at: data[index].updated_at,
    count: data[index].count,
  });

  return (
    <StyledContainer>
      <ViewWithSpinner isLoading={loading}>
        <StyledOrderButton onPress={() => orderSheetModal.current?.present()}>
          <StyledOrderText>{orderType}</StyledOrderText>
          <AntIcon
            name="caretdown"
            size={14}
            color={Colors.lightGrey}
            style={styles.icon}
          />
        </StyledOrderButton>
        <VirtualizedList
          contentContainerStyle={styles.list}
          data={data}
          initialNumToRender={9}
          getItemCount={(data: FormInterface[]) => data.length}
          getItem={getItem}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => (
            <FormCard
              index={index}
              color={getColor(index)}
              title={item.title}
              update_at={item.updated_at}
              count={item.count}
              onPress={(color: string) =>
                navigation.navigate('Submission', {
                  id: item.id,
                  title: item.title,
                  color: color,
                  count: item.count,
                })
              }
            />
          )}
        />
        <BottomSheetModalProvider>
          <BottomSheetModal
            handleComponent={() => (
              <StyledHandleContainer>
                <StyledHandleLine />
              </StyledHandleContainer>
            )}
            ref={orderSheetModal}
            snapPoints={snapPoints}
            index={1}>
            <OrderSheet closeSheet={() => orderSheetModal.current?.close()} />
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </ViewWithSpinner>
    </StyledContainer>
  );
};

const styles = StyleSheet.create({
  icon: {
    marginRight: 24,
  },
  list: {
    height: '100%',
    marginTop: 8,
  },
});

const mapStateToProps = (state: IState) => {
  const {loading, orderType} = state.form;
  return {loading, orderType};
};

const mapDispatchToProps = {
  requestLogout,
  getForm,
  resetQuestions,
  resetSubmissions,
};

export default connect(mapStateToProps, mapDispatchToProps)(FormPage);
