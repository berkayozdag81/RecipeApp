import React from 'react';
import {StyleSheet, FlatList} from 'react-native';
import StoryListItem from './StoryListItem';
import theme from '../utils/Theme';
import Box from './Box';

const StoryContainer = ({stories, onStoryPress}) => {
  return (
    <React.Fragment>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        style={styles.container}
        data={stories}
        renderItem={({item}) => (
          <StoryListItem item={item} onStoryPress={onStoryPress} />
        )}
      />
      <Box height={1} bg={theme.colors.secondaryText} />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    marginTop: 10,
    paddingBottom: 10,
  },
});

export default StoryContainer;
