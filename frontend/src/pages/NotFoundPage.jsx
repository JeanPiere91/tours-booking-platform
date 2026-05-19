import { Link } from 'react-router-dom';

import StateMessage from '../components/StateMessage.jsx';

export default function NotFoundPage() {
  return (
    <div className="container">
      <StateMessage
        title="Page not found"
        description="The page you're looking for doesn't exist."
        action={
          <Link to="/tours" className="button">
            Go to tours
          </Link>
        }
      />
    </div>
  );
}
