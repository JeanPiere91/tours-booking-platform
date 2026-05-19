import { Fragment } from 'react';
import { Link } from 'react-router-dom';

export default function Breadcrumb({ items }) {
  if (!items?.length) return null;

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <Fragment key={`${item.label}-${index}`}>
              <li className="breadcrumb__item">
                {item.to && !isLast ? (
                  <Link to={item.to} className="breadcrumb__link">
                    {item.label}
                  </Link>
                ) : (
                  <span className="breadcrumb__current" aria-current={isLast ? 'page' : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
              {!isLast && (
                <li className="breadcrumb__separator" aria-hidden="true">
                  ›
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
