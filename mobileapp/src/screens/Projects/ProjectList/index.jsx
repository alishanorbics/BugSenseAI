import React from 'react';
import { StyleSheet, View } from 'react-native';
import FlatList from '../../../components/FlatList';
import Icon from '../../../components/Icon';
import ProjectCard from '../../../components/ProjectCard';
import Row from '../../../components/Row';
import Text from '../../../components/Text';
import Touchable from '../../../components/Touchable';
import colors from '../../../helpers/colors';
import { heightPixel, widthPixel } from '../../../helpers/metrics';
import useProjectListController from './useProjectListController';

const ProjectList = () => {
  const { values, functions } = useProjectListController();
  const { sectioned_data, isLoading, is_qa } = values;
  const { goToProjectDetail, goToCreateProject } = functions;

  return (
    <View style={styles.container}>
      <Row justify="space-between" style={styles.header}>
        <Text family="heading" weight="bold" size={22}>
          Projects
        </Text>
        {is_qa && (
          <Touchable onPress={goToCreateProject} style={styles.add_button}>
            <Icon name="plus" color={colors.background} size={widthPixel(20)} />
          </Touchable>
        )}
      </Row>

      <FlatList
        data={sectioned_data}
        loading={isLoading}
        empty_text="No projects yet."
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.list_content}
        renderItem={({ item }) =>
          item.type === 'header' ? (
            <Text family="heading" weight="bold" size={14} color={colors.muted} style={styles.section_header}>
              {item.title.toUpperCase()}
            </Text>
          ) : (
            <ProjectCard project={item.project} onPress={() => goToProjectDetail(item.project._id)} />
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: widthPixel(24),
    paddingTop: heightPixel(60),
  },
  header: {
    marginBottom: heightPixel(20),
  },
  add_button: {
    width: widthPixel(36),
    height: widthPixel(36),
    borderRadius: widthPixel(18),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list_content: {
    paddingBottom: heightPixel(40),
  },
  section_header: {
    marginTop: heightPixel(16),
    marginBottom: heightPixel(10),
    letterSpacing: 0.5,
  },
});

export default ProjectList;
