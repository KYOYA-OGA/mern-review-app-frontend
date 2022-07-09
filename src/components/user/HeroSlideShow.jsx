import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { getLatestUploads } from '../../api/movie';
import { useNotification } from '../../hooks';

let count = 0;
let intervalId;

let newTime = 0;
let lastTime = 0;

export default function HeroSlideShow() {
  const [currentSlide, setCurrentSlide] = useState({});
  const [cloneSlide, setCloneSlide] = useState({});
  const [slides, setSlides] = useState([]);
  const [upNext, setUpNext] = useState([]);
  const [visible, setVisible] = useState(true);
  const slideRef = useRef();
  const cloneSlideRef = useRef();

  const { updateNotification } = useNotification();

  const startSlideShow = () => {
    intervalId = setInterval(() => {
      newTime = Date.now();
      const delta = newTime - lastTime;

      // prevent setInterval bugs
      if (delta < 4000) return clearInterval(intervalId);

      handleOnNextClick();
    }, 3500);
  };
  const pauseSlideShow = () => {
    clearInterval(intervalId);
  };

  const handleAnimationEnd = () => {
    const classes = [
      'slide-in-from-right',
      'slide-out-to-right',
      'slide-in-from-left',
      'slide-out-to-left',
    ];
    slideRef.current.classList.remove(...classes);
    cloneSlideRef.current.classList.remove(...classes);
    // prevent flickering
    cloneSlideRef.current.classList.add('-z-10');
    setCloneSlide({});
    startSlideShow();
  };

  const updateUpNext = (currentIndex) => {
    if (!slides.length) return;

    const upNextCount = currentIndex + 1;
    const end = upNextCount + 3;

    let newSlides = [...slides];
    newSlides = newSlides.slice(upNextCount, end);

    if (!newSlides.length) {
      newSlides = [...slides].slice(0, 3);
    }

    setUpNext([...newSlides]);
  };

  const handleOnNextClick = () => {
    lastTime = Date.now();
    pauseSlideShow();
    // prevent flickering
    if (cloneSlideRef.current?.classList.value.includes('-z-10')) {
      cloneSlideRef.current.classList.remove('-z-10');
    }

    setCloneSlide(slides[count]);

    count = (count + 1) % slides.length;
    setCurrentSlide(slides[count]);

    cloneSlideRef.current?.classList.add('slide-out-to-left');
    slideRef.current?.classList.add('slide-in-from-right');

    updateUpNext(count);
  };

  const handleOnPrevClick = () => {
    pauseSlideShow();
    // prevent flickering
    if (cloneSlideRef.current?.classList.value.includes('-z-10')) {
      cloneSlideRef.current?.classList.remove('-z-10');
    }
    setCloneSlide(slides[count]);

    count = (count + slides.length - 1) % slides.length;
    setCurrentSlide(slides[count]);

    cloneSlideRef.current?.classList.add('slide-out-to-right');
    slideRef.current?.classList.add('slide-in-from-left');

    updateUpNext(count);
  };

  const fetchLatestUploads = async (signal) => {
    const { error, movies } = await getLatestUploads(signal);
    if (error) return updateNotification('error', error);

    setSlides([...movies]);
    setCurrentSlide(movies[0]);
  };

  const handleOnVisibilityChange = () => {
    const visibility = document.visibilityState;
    if (visibility === 'hidden') setVisible(false);
    if (visibility === 'visible') setVisible(true);
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchLatestUploads(ac.signal);
    document.addEventListener('visibilitychange', handleOnVisibilityChange);

    return () => {
      ac.abort();
      pauseSlideShow();
      document.removeEventListener(
        'visibilitychange',
        handleOnVisibilityChange
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (slides.length && visible) {
      startSlideShow();
      updateUpNext(count);
    } else {
      pauseSlideShow();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length, visible]);

  return (
    <div className="w-full flex">
      <div className="w-full md:w-4/5 aspect-video relative overflow-hidden">
        <Slide
          title={currentSlide.title}
          src={currentSlide.poster}
          ref={slideRef}
          id={currentSlide.id}
        />

        {/* cloned slide */}
        <Slide
          ref={cloneSlideRef}
          src={cloneSlide.poster}
          className="absolute inset-0"
          onAnimationEnd={handleAnimationEnd}
          title={cloneSlide.title}
          id={currentSlide.id}
        />

        <SlideShowController
          onNextClick={handleOnNextClick}
          onPrevClick={handleOnPrevClick}
        />
      </div>

      <div className="hidden md:block md:w-1/5 space-y-3 px-3">
        <h1 className="font-semibold text-2xl text-primary dark:text-white">
          Up Next
        </h1>
        {upNext.map(({ poster, id }) => {
          return (
            <img
              key={id}
              src={poster}
              alt=""
              className="aspect-video object-cover rounded"
            />
          );
        })}
      </div>
    </div>
  );
}

const SlideShowController = ({ onPrevClick, onNextClick }) => {
  const btnClass = `bg-primary rounded border-2 text-white text-xl p-2 outline-none`;
  return (
    <div className="absolute top-1/2 -translate-y-1/2 w-full flex items-center justify-between px-2">
      <button onClick={onPrevClick} type="button" className={btnClass}>
        <AiOutlineDoubleLeft />
      </button>
      <button onClick={onNextClick} type="button" className={btnClass}>
        <AiOutlineDoubleRight />
      </button>
    </div>
  );
};

const Slide = forwardRef((props, ref) => {
  const { id, title, src, className = '', ...rest } = props;
  return (
    <Link
      to={`/movie/${id}`}
      ref={ref}
      className={`w-full cursor-pointer block ${className}`}
      {...rest}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="aspect-video object-cover"
          // onAnimationEnd={handleAnimationEnd}
        />
      ) : null}
      {title ? (
        <div className="absolute inset-0 flex flex-col justify-end py-3 bg-gradient-to-t from-white via-transparent dark:from-primary dark:via-transparent">
          <h1 className="font-semibold text-4xl dark:text-highlight-dark text-highlight">
            {title}
          </h1>
        </div>
      ) : null}
    </Link>
  );
});
