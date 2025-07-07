export function navigateHook(navigate, path,userType) {
  if (typeof navigate === 'function') {
    if(userType === 'admin') {
      navigate('/admin/' + path);
    }
    else if(userType === 'seller') {
      navigate('/seller/' + path);
    }
    else if(userType === 'walmart') {
      navigate('/walmart/' + path);
    }
    else{
        navigate('/' + path);
    }
  }else{
    return;
  }
}