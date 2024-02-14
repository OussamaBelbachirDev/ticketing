import Link from 'next/link';
const Header = ({ currentUser }) => {
  return (
    <div>
      <nav className="navbar navbar-lignt bg-light px-4">
        <Link className="navbar-brand" href="/">
          GitTix
        </Link>
        <div className="d-flex justify-content-end">
          <ul className="nav d-flex align-items-center">
            {currentUser && (
              <>
                <Link className="navbar-brand" href="/tickets/new">
                  Sell Tickets
                </Link>
                <Link className="navbar-brand" href="/orders">
                  My Orders
                </Link>
                <Link className="navbar-brand" href="/auth/signout">
                  Sign Out
                </Link>
              </>
            )}

            {!currentUser && (
              <>
                <Link className="navbar-brand" href="/auth/signup">
                  Sign Up
                </Link>
                <Link className="navbar-brand" href="/auth/signin">
                  Sign In
                </Link>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Header;
