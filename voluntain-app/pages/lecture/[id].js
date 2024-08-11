import Head from 'next/head';
import styles from '../../styles/Home.module.css';
import { url } from '../../config/next.config';
import Youtube from 'react-youtube';
import Router from 'next/router';
import Link from "next/link";
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Button, Hidden } from '@material-ui/core';
import { useWindowSize } from '../../components/useWindowSize';
import { LectureCards } from '../../components/LectureCards';

export default function Home({ course, course2, qnas }) {
  const size = useWindowSize();

  const [cookies, setCookie, removeCookie] = useCookies(['courseId', 'lectureId', 'videoEnd', 'noCookie']);
  const [questionTitle, setQuestionTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [questions, setQuestions] = useState(qnas || []);
  const [targetPlayer, setTargetPlayer] = useState({});
  const [lectureId, setLectureId] = useState(0);
  const [isFirstLecture, setFirstLecture] = useState(1);
  const [isLastLecture, setLastLecture] = useState(course.length == 1 ? 1 : 0);

  const opts = {
    height: size.height > 650 ? '400' : size.height - 100,
    width: size.width > 1050 ? '700' : size.width - 4000,
    playerVars: {
      cc_load_policy: 1,
      modestbranding: 1,
    },
  };

  const onPlayerReady = (event) => {
    setTargetPlayer(event.target);
  };

  const toExercise = () => {
    targetPlayer.seekTo(course.exercise_answer, true);
  };

  const handleVideoEnd = () => {
    if (cookies.noCookie === undefined)
      setCookie('videoEnd', 1, { path: '/', maxAge: 31536000 });
  };

  const handleVideoStart = () => {
    if (cookies.noCookie == undefined) {
      setCookie('courseId', course2.id, { path: '/', maxAge: 31536000 });
      setCookie('lectureId', course.id, { path: '/', maxAge: 31536000 });
      setCookie('videoEnd', 0, { path: '/', maxAge: 31536000 });
      setCookie('isLastLecture', isLastLecture, { path: '/', maxAge: 31536000 });
    }
  };

  useEffect(() => {
    if (cookies.lectureId !== undefined && cookies.courseId == course.id) {
      console.log(`Loading the recent history...`);
      setLectureId(cookies.lectureId);
      setFirstLecture(cookies.lectureId == 0 ? 1 : 0);
      setLastLecture(cookies.lectureId == course.length - 1 ? 1 : 0);
    }
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    var link = "/newcourse/" + course2.id;
    Router.push(link);
  };

  const handleClick2 = (e) => {
    e.preventDefault();
    Router.push('/');
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${url}/qnas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: questionTitle,
        content: question,
        lecture: course.id,
      }),
    });

    if (response.ok) {
      const newQuestion = await response.json();
      setQuestions([...questions, newQuestion]);
      setQuestionTitle('');
      setQuestion('');
    }
  };

  const list2 = () => (
    <div>
      {course2.lectures.map((element, index) => {
        var active;
        if (element.id == course.id) {
          active = "list-group-item list-group-item-action active"
        } else {
          active = "list-group-item list-group-item-action"
        }
        return (
          <ul className="list-group" key={index}>
            <li className={active}>
              <div className={styles.courselist}>
                <div className="ms-2 me-auto">
                  <div className="fw-bold">
                    <Link href={"/lecture/" + (element.id == undefined ? 'landing' : element.id)}>
                      <h6>{element.title}</h6>
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        )
      })}
    </div>
  );

  return (
    <div>
      <Head>
        <title>{course.title}</title>
      </Head>
      <div className="d-md-flex align-items-stretch mx-5">
        <Hidden smDown>
          <nav className="px-1 pt-5 my-1 py-1 text-center border-bottom">
            <h1 className="display-4 fw-bold">&nbsp;Lectures&nbsp;</h1>
            {list2()}
          </nav>
        </Hidden>
        <div className="px-2 pt-5 my-2 text-center border-bottom">
          <div className={styles.course} >
            <h1 className="display-4 fw-bold">{course.title}</h1>
            <div className="col-lg-6 mx-auto">
              <p className="lead mb-4 text-center">{course.about}</p>
              <div className={styles.videoresponsive}>
                <Youtube videoId={course.video_link} opts={opts} onReady={onPlayerReady} onPlay={handleVideoStart} onEnd={handleVideoEnd} />
              </div>
              <br></br>
              <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-5">
                <button type="button" className="btn btn-outline-secondary btn-lg px-4" onClick={(e) => handleClick(e)}>
                  Go back to course
                </button>
                <Button variant="contained" color="primary" onClick={toExercise}>Check Answer</Button>
              </div>
            </div>
          </div>
          <div className={styles.lectureCardContainer}>
            <div className={styles.lectureCardsRow}>
              <LectureCards
                title='Exercise'
                content={course.exercise_question}
              />
            </div>
          </div>

          {/* QnA 섹션 */}
          <div className={styles.qnaSection}>
            <h2>Questions & Answers</h2>
            <form onSubmit={handleQuestionSubmit}>
              <input
                type="text"
                value={questionTitle}
                onChange={(e) => setQuestionTitle(e.target.value)}
                placeholder="Enter your question title"
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
              />
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question"
                rows="4"
                style={{ width: '100%', padding: '10px' }}
              ></textarea>
              <Button type="submit" variant="contained" color="primary">Submit Question</Button>
            </form>

            <div className={styles.qnaList}>
              <h3>Previous Questions</h3>
              {questions.map((q, index) => (
                <div key={index} className={styles.qnaItem}>
                  <h4>{q.title}</h4>
                  <p>{q.content}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// send GET Request to {url}/lectures and get course list
export const getStaticProps = async (context) => {
  const data = await fetch(`${url}/lectures/${context.params.id}`);
  const course = await data.json();

  const data2 = await fetch(`${url}/courses/${course.course.id}`);
  const course2 = await data2.json();

  const qnaResponse = await fetch(`${url}/qnas/lecture/${context.params.id}?sort=createdAt:desc`);
  const qnas = await qnaResponse.json();

  return {
    props: { course, course2, qnas },
    revalidate: 1,
  };
};

// send GET Request to {url}/lectures and get course list
export async function getStaticPaths() {
  const res = await fetch(`${url}/lectures`);
  const courses = await res.json();

  const paths = courses.map((item) => ({
    params: { id: item.id.toString() },
  }));

  return { paths, fallback: false };
};
