/* eslint-disable react/display-name */

import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { url } from "../../config/next.config";

import { useCookies } from 'react-cookie';
import dynamic from 'next/dynamic';
import { Button, Collapse, Drawer, Fab, List, ListItem, ListItemText, Hidden } from '@material-ui/core';
import { useWindowSize } from '../../components/useWindowSize';
import styles from '../../styles/Home.module.css';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ListIcon from '@material-ui/icons/List';
import { makeStyles } from '@material-ui/core/styles';

// Dynamically import LectureCards to optimize the initial load
const DynamicLectureCards = dynamic(() => import('../../components/LectureCards'), {
  ssr: false,
  loading: () => <p>Loading lecture cards...</p>,
});

// Dynamically import Youtube component
const DynamicYoutube = dynamic(() => import('react-youtube'), {
  ssr: false,
  loading: () => <p>Loading video player...</p>,
});

export default function LecturePage({ course, titles }) {
  const [cookies, setCookie, removeCookie] = useCookies(['courseId', 'lectureId', 'videoEnd', 'noCookie']);
  const [targetPlayer, setTargetPlayer] = useState({});
  const [lectureId, setLectureId] = useState(0);
  const [isFirstLecture, setFirstLecture] = useState(1);
  const [isLastLecture, setLastLecture] = useState(course.lectures.length == 1 ? 1 : 0);
  const size = useWindowSize();

  const opts = {
    height: size.height > 650 ? '600' : size.height - 50,
    width: size.width > 1050 ? '900' : size.width - 250,
    playerVars: {
      cc_load_policy: 1,
      modestbranding: 1,
    },
  };

  const [openSidebar, setOpenSidebar] = useState(false);
  const responsivesidebar = () => setOpenSidebar(!openSidebar);

  const onPlayerReady = (event) => setTargetPlayer(event.target);

  const toExercise = () => targetPlayer.seekTo(course.lectures[lectureId].exercise_answer, true);

  const handleClick = (lecture_number) => {
    setLectureId(lecture_number);
    setFirstLecture(lecture_number === 0 ? 1 : 0);
    setLastLecture(lecture_number === course.lectures.length - 1 ? 1 : 0);
  };

  const nextLecture = () => {
    const nextId = lectureId + 1;
    setLectureId(nextId);
    setFirstLecture(0);
    setLastLecture(nextId === course.lectures.length - 1 ? 1 : 0);
  };

  const prevLecture = () => {
    const prevId = lectureId - 1;
    setLectureId(prevId);
    setLastLecture(0);
    setFirstLecture(prevId === 0 ? 1 : 0);
  };

  const handleVideoEnd = () => {
    if (!cookies.noCookie) setCookie('videoEnd', 1, { path: '/', maxAge: 31536000 });
  };

  const handleVideoStart = () => {
    if (!cookies.noCookie) {
      setCookie('courseId', course.id, { path: '/', maxAge: 31536000 });
      setCookie('lectureId', lectureId, { path: '/', maxAge: 31536000 });
      setCookie('videoEnd', 0, { path: '/', maxAge: 31536000 });
      setCookie('isLastLecture', isLastLecture, { path: '/', maxAge: 31536000 });
    }
  };

  const useStyles = makeStyles({
    default: {
      height: 48,
      '&$selected': {
        backgroundColor: '#00A553',
        "&:hover": {
          backgroundColor: "#00A553",
        },
      },
    },
    selected: {},
  });
  const classes = useStyles();

  const sidebar = () => (
    <aside className={styles.lectureSidebar}>
      <ListItem onClick={responsivesidebar} style={{ height: 60 }}>
        <ListItemText primary={course.title} />
        {openSidebar ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={openSidebar} timeout="auto" unmountOnExit>
        <div className={styles.lectureSidebarComponent}>
          {course.lectures.map((element, index) => (
            <List key={index} disablePadding>
              <ListItem button classes={{ root: classes.default, selected: classes.selected }}
                selected={index === lectureId}
                onClick={() => handleClick(element.lecture_number)}>
                <ListItemText primary={element.title} style={{ marginLeft: '20px' }} />
              </ListItem>
            </List>
          ))}
        </div>
      </Collapse>
    </aside>
  );

  useEffect(() => {
    if (cookies.lectureId !== undefined && cookies.courseId == course.id) {
      setLectureId(cookies.lectureId);
      setFirstLecture(cookies.lectureId === 0 ? 1 : 0);
      setLastLecture(cookies.lectureId === course.lectures.length - 1 ? 1 : 0);
    }
    setOpenSidebar(true);
  }, []);

  const [openDrawer, setOpenDrawer] = useState(false);
  const toggleDrawer = () => setOpenDrawer(!openDrawer);

  return (
    <div className={styles.container}>
      <Head>
        <title>{course.lectures[lectureId].title} - Voluntain</title>
      </Head>

      <main className={styles.lecturePage}>
        <Hidden smDown>
          {sidebar()}
        </Hidden>

        <Drawer open={openDrawer} onClose={toggleDrawer}>
          {sidebar()}
        </Drawer>

        <div className={styles.lectureContent}>
          <h1 className={styles.lectureTitle}>{course.lectures[lectureId].title}</h1>
          <p className={styles.lectureDate}>{course.lectures[lectureId].uploaded_date}</p>
          <hr />
          <div>
            <DynamicYoutube videoId={course.lectures[lectureId].video_link}
              opts={opts}
              onPlay={handleVideoStart}
              onEnd={handleVideoEnd}
              onReady={onPlayerReady} />
          </div>
          <hr />
          <div>
            <Button variant="contained" color="primary" disabled={isFirstLecture} onClick={prevLecture}>{'< Prev'}</Button>
            {' '}
            <Button variant="contained" color="primary" disabled={isLastLecture} onClick={nextLecture}>{'Next >'}</Button>
          </div>

          <div className={styles.lectureCardContainer}>
            <div className={styles.lectureCardsRow}>
              <DynamicLectureCards
                title='Lecture Info'
                content={course.lectures[lectureId].about}
              />
            </div>
            <div className={styles.lectureCardsRow}>
              <DynamicLectureCards
                title='Exercise'
                content={course.lectures[lectureId].exercise_question}
              />
            </div>
            <Button variant="contained" color="primary" onClick={toExercise}>Check Answer</Button>
          </div>
        </div>
      </main>

      <Hidden mdUp>
        <Fab color="primary" style={{ position: 'sticky', bottom: 10, left: 10 }}>
          <ListIcon onClick={toggleDrawer} />
        </Fab>
      </Hidden>
    </div>
  );
};

// Fetch course data and titles for navigation
export const getStaticProps = async (context) => {
  const data = await fetch(`${url}/courses/${context.params.id}`);
  const course = await data.json();

  const data0 = await fetch(`${url}/courses/title`);
  const titles = await data0.json();

  return {
    props: { course, titles },
    revalidate: 3600, // 1 hour revalidate
  };
};

// Fetch course IDs for static paths
export async function getStaticPaths() {
  const res = await fetch(`${url}/courses`);
  const courses = await res.json();

  const paths = courses.map((item) => ({
    params: { id: item.id.toString() },
  }));

  return { paths, fallback: false };
}
