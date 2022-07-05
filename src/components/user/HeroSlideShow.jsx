import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from 'react-icons/ai';
import { getLatestUploads } from '../../api/movie';
import { useNotification } from '../../hooks';

let count = 0;

export default function HeroSlideShow() {
  const [slide, setSlide] = useState({});
  const [cloneSlide, setCloneSlide] = useState({});
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef();
  const cloneSlideRef = useRef();

  const { updateNotification } = useNotification();

  const handleAnimationEnd = () => {
    slideRef.current.classList.remove('slide-in-from-right');
    cloneSlideRef.current.classList.remove('slide-out-to-left');
    setCloneSlide({});
  };

  const handleOnNextClick = () => {
    setCloneSlide(slides[count]);

    count = (count + 1) % slides.length;
    setSlide(slides[count]);
    setCurrentIndex(count);

    cloneSlideRef.current.classList.add('slide-out-to-left');
    slideRef.current.classList.add('slide-in-from-right');
  };
  const handleOnPrevClick = () => {};

  const fetchLatestUploads = async () => {
    const { error, movies } = await getLatestUploads();
    if (error) return updateNotification('error', error);

    setSlides([...movies]);
    setSlide(movies[0]);
  };

  useEffect(() => {
    fetchLatestUploads();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full flex">
      <div className="w-4/5 aspect-video relative overflow-hidden">
        <img
          ref={slideRef}
          src={slide.poster}
          alt=""
          className="aspect-video object-cover"
          onAnimationEnd={handleAnimationEnd}
        />
        <img
          ref={cloneSlideRef}
          src={cloneSlide.poster}
          alt=""
          className="aspect-video object-cover absolute inset-0"
          onAnimationEnd={handleAnimationEnd}
        />
        <SlideShowController onNextClick={handleOnNextClick} />
      </div>

      <div className="w-1/5 aspect-video bg-red-300"></div>
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
