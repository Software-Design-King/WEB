import { useUserStore } from '../stores/userStore';

export const useAuthContext = () => {
  const userInfo = useUserStore(state => state.userInfo);
  const isLoading = useUserStore(state => state.isLoading);
  const error = useUserStore(state => state.error);
  const loadUserInfo = useUserStore(state => state.loadUserInfo);
  const logout = useUserStore(state => state.logout);
  
  return { 
    userInfo, 
    isLoading, 
    error, 
    loadUserInfo, 
    logout 
  };
};
