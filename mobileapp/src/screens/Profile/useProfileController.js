import { useDispatch, useSelector } from 'react-redux';
import { ROLES } from '../../helpers/data';
import { navigate } from '../../helpers/navigation';
import { ROUTES } from '../../helpers/routes';
import { logout } from '../../redux/slices/auth.slice';
import { selectUser } from '../../redux/selectors';

const useProfileController = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const role_label = user?.role === ROLES.DEVELOPER ? 'Developer' : 'QA Engineer';

  const handleLogout = () => dispatch(logout());
  const goToChangePassword = () => navigate(ROUTES.CHANGE_PASSWORD);

  return {
    values: {
      user,
      role_label,
    },
    functions: {
      handleLogout,
      goToChangePassword,
    },
  };
};

export default useProfileController;
