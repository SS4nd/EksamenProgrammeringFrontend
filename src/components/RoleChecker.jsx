import PropTypes from "prop-types";
import { useAuth } from "../context/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

export default function RoleChecker({ children, roles }) {
  const auth = useAuth();
  const location = useLocation();
  const userRoles = auth.roles || []; // Use an empty array as fallback

  if (!userRoles.length || !roles.some((role) => userRoles.includes(role))) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

RoleChecker.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};
