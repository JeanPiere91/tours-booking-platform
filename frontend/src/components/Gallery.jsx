const GRADIENTS = ['andes', 'lake', 'rainbow', 'valley', 'desert', 'premium'];

function buildSlots(mainGradient) {
  const others = GRADIENTS.filter((g) => g !== mainGradient);
  return [mainGradient, ...others.slice(0, 4)];
}

export default function Gallery({ mainGradient = 'andes', extraPhotosLabel = '+12 photos' }) {
  const [main, t2, t3, t4, t5] = buildSlots(mainGradient);

  return (
    <div className="gallery" role="img" aria-label="Tour photo gallery">
      <div className={`gallery__main tour-img--${main}`} />
      <div className={`gallery__cell gallery__cell--tl tour-img--${t2}`} />
      <div className={`gallery__cell gallery__cell--tr tour-img--${t3}`} />
      <div className={`gallery__cell gallery__cell--bl tour-img--${t4}`} />
      <div className={`gallery__cell gallery__cell--br tour-img--${t5}`}>
        <span className="gallery__extra">{extraPhotosLabel}</span>
      </div>
    </div>
  );
}
