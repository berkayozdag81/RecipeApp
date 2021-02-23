import * as React from 'react';
import Box from '../components/Box';
import Text from '../components/Text';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View, StyleSheet, Dimensions} from 'react-native';
import theme from '../utils/Theme';
import {Share2} from '../components/icons';
import {ScrollView} from 'react-native-gesture-handler';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {useNavigation, useRoute} from '@react-navigation/native';
import MustLogin from './MustLogin';
import AuthContext from '../context/AuthContext';
import {API, Auth, graphqlOperation} from 'aws-amplify';
import Button from '../components/Button';
import {getUser} from '../graphql/queries';
import {S3Image} from 'aws-amplify-react-native';

const FirstRoute = () => (
  <Box
    flexDirection="row"
    px={24}
    flexWrap="wrap"
    justifyContent={'space-between'}
  />
);

const SecondRoute = () => (
  <View style={[styles.scene, {backgroundColor: '#673ab7'}]} />
);

const renderTabBar = (props) => (
  <TabBar
    {...props}
    indicatorStyle={{backgroundColor: theme.colors.mainGreen}}
    style={{backgroundColor: 'white', color: 'black'}}
    renderLabel={({route, focused, color}) => (
      <Text color={theme.colors.mainText} fontSize={15} fontWeight={600}>
        {route.title}
      </Text>
    )}
  />
);

export default function ProfileScreen() {
  const [index, setIndex] = React.useState(0);
  const [user, setUser] = React.useState({});
  const navigation = useNavigation();
  const route = useRoute();

  const {isLogged, setLogged} = React.useContext(AuthContext);

  const [routes] = React.useState([
    {key: 'first', title: 'First'},
    {key: 'second', title: 'Second'},
  ]);

  React.useEffect(() => {
    const fetchUser = async () => {
      const userData = await API.graphql(
        graphqlOperation(getUser, {id: route.params.id}),
      );
      if (userData) {
        setUser(userData.data.getUser);
      }
    };
    fetchUser();
  }, [route.params.id]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const initialLayout = {width: Dimensions.get('window').width};

  return isLogged ? (
    <Box as={SafeAreaView} bg={'white'} flex={1}>
      <ScrollView>
        <Box alignItems={'flex-end'} mr={24} pt={24}>
          <Button
            onPress={() => {
              Auth.signOut();
              navigation.navigate('Auth');
              setLogged(false);
            }}>
            <Share2 stroke={theme.colors.mainText} />
          </Button>
        </Box>
        <Box alignItems="center" mt={20}>
          <S3Image
            imgKey={user.avatar}
            style={{
              width: 100,
              height: 100,
              borderRadius: 9999,
            }}
          />
          <Text
            fontWeight={700}
            fontSize={17}
            color={theme.colors.mainText}
            mt="24px">
            {user && user.fullname}
          </Text>
        </Box>
        <Box flexDirection="row" mt="24px" justifyContent="space-around">
          <Box flexDirection="column" alignItems={'center'}>
            <Text fontWeight={700} fontSize={17} color={theme.colors.mainText}>
              32
            </Text>
            <Text
              mt={2}
              fontWeight={500}
              fontSize={15}
              color={theme.colors.secondaryText}>
              Recipes
            </Text>
          </Box>
          <Box flexDirection="column" alignItems={'center'}>
            <Text fontWeight={700} fontSize={17} color={theme.colors.mainText}>
              782
            </Text>
            <Button onPress={() => navigation.navigate('Following')}>
              <Text
                mt={2}
                fontWeight={500}
                fontSize={15}
                color={theme.colors.secondaryText}>
                Following
              </Text>
            </Button>
          </Box>
          <Box flexDirection="column" alignItems={'center'}>
            <Text fontWeight={700} fontSize={17} color={theme.colors.mainText}>
              1287
            </Text>
            <Text
              mt={2}
              fontWeight={500}
              fontSize={15}
              color={theme.colors.secondaryText}>
              Followers
            </Text>
          </Box>
        </Box>
        <Box mt={24} height={8} bg={theme.colors.mainGray} />
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={renderTabBar}
          initialLayout={initialLayout}
        />
      </ScrollView>
    </Box>
  ) : (
    <MustLogin />
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});
